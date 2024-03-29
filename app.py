import os
import requests
from flask import (
    Flask, flash, render_template,
    redirect, request, session, url_for,
    jsonify, make_response, abort)
from flask_pymongo import PyMongo
from datetime import datetime
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
if os.path.exists("env.py"):
    import env


app = Flask(__name__)


app.config["MONGO_DBNAME"] = os.environ.get("MONGO_DBNAME")
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.secret_key = os.environ.get("SECRET_KEY")


mongo = PyMongo(app)

# Contant Values
TITLE_LIMIT = 70
BODY_LIMIT = 200
LAZY_LIMIT = 10


@app.route("/", methods=["GET", "POST"])
def home():
    """
    POST: Log in function.
    This is the home page of the app.
    """
    if request.method == "POST":
        check_user = mongo.db.users.find_one(
            {"username": request.form.get("username").lower()})
        if check_user:
            if check_password_hash(check_user["password"], request.form.get("password")):
                session["user"] = request.form.get("username").lower()
                return redirect(url_for("home"))
            else:
                flash("Incorrect username or password. Please try again.", "error")
                return redirect(url_for("home"))
        else:
            flash("Incorrect username or password. Please try again.", "error")
            return redirect(url_for("home"))
    else:
        if not is_logged():
            return render_template("welcome.html")
        return redirect(url_for("feed"))


@app.route("/feed")
def feed():
    """
    Enable a logged in user to view their feed.
    """
    if not is_logged():
        return redirect(url_for("home"))
    user_info = mongo.db.users.find_one_or_404({"username": session["user"]})
    entries = list(mongo.db.entries.find(
        {"user": session["user"]}))
    return render_template(
        "feed.html",
        entries=entries,
        user=user_info
        )


@app.route("/load")
def load():
    """
    Enable a logged in user to request their own entries as json object.
    """

    if not is_logged():
        return abort(400)
    db = list(mongo.db.entries.find({"user": session["user"], "pinned": True}).sort("_id", -1))

    entries = list(mongo.db.entries.find({"user": session["user"], "pinned": False}).sort("_id", -1))

    db.extend(entries)

    for entry in db:
        entry['_id'] = str(entry['_id'])

    quantity = LAZY_LIMIT

    if request.args:
        try:
            if int(request.args.get("c")):
                pass
        except ValueError:
            abort(400)

        # The 'counter' value sent in the QS
        counter = int(request.args.get("c"))

        if counter == 0:
            # Slice 0 -> quantity from the db
            res = make_response(jsonify(db[0: quantity]), 200)
        elif counter == len(db):
            res = make_response(jsonify({}), 200)
        else:
            # Slice counter -> quantity from the db
            res = make_response(jsonify(db[counter: counter + quantity]), 200)
    else:
        return abort(404)
    return res


@app.route("/signout")
def signout():
    """
    Enable a logged in user to end their session
    """
    if not is_logged():
        flash("You must be logged in to access this page.", "error")
        return render_template("welcome.html")
    else:
        session.pop("user")
        return redirect(url_for("home"))


@app.route("/register", methods=["GET", "POST"])
def register():
    """
    Enable a new user to register an account
    """
    if request.method == "POST":
        username_check = mongo.db.users.find_one(
            {"username": request.form.get("username").lower()})
        if username_check:
            flash("User already exists, try logging in instead.", "warning")
            return redirect(url_for("home"))
        password_check = len(request.form.get("password"))
        name_check = len(request.form.get("firstname"))
        username_check = len(request.form.get("username"))
        if password_check < 6:
            flash("Your password is too short, make sure it's at least 6 characters long.", "warning")
            return render_template("register.html")
        elif name_check > 10:
            flash("Your name is too long, please enter a name that is 10 characters or less.", "warning")
            return render_template("register.html")
        elif username_check > 15:
            flash("Your username is too long, please enter a username that is 15 characters or less.", "warning")
            return render_template("register.html")
        new_user = {
            "firstname": request.form.get("firstname").lower().capitalize(),
            "username": request.form.get("username").lower(),
            "password": generate_password_hash(request.form.get("password"))
        }
        mongo.db.users.insert_one(new_user)

        session["user"] = request.form.get("username").lower()
        flash("You're in! Click on the + button above to create your first entry.", "success")
        return redirect(url_for("home"))
    else:
        if is_logged():
            flash("You're already logged in.", "warning")
            return redirect(url_for("home"))
        else:
            return render_template("register.html")


@app.route("/new", methods=["GET", "POST"])
def new():
    """
    Enable a logged in user to create a new entry.
    """
    if not is_logged():
        flash("You must be logged in to access this page.", "error")
        return render_template("welcome.html")
    else:
        pinned_count = list(mongo.db.entries.find({
                "user": session["user"],
                "pinned": True
            }))
        if request.method == "POST":
            current_time = datetime.now()

            # check if title and body exceed character limits
            if len(request.form.get("title")) > TITLE_LIMIT or len(request.form.get("body")) > BODY_LIMIT:
                flash("Your title or body is too long.", "warning")
                return redirect(url_for("home"))

            # check if body is present
            body = request.form.get(
                "body") if len(request.form.get("body")) > 1 else None

            # check if post is to be pinned
            pinned = True if request.form.get("pinned") == "pin" and len(
                pinned_count) < 5 else False
            entry = {
                "title": request.form.get("title"),
                "body": body,
                "type": request.form.get("type"),
                "pinned": pinned,
                "date": current_time.strftime("%d/%m/%Y"),
                "user": session["user"]
            }
            mongo.db.entries.insert_one(entry)
            flash("Your entry has been added!", "success")
            return redirect(url_for("home"))
    return abort(404)


@app.route("/pin/<entry_id>")
def pin(entry_id):
    """
    Enable a logged in user to pin an entry to the top of their feed.
    Check if user reached pin limit.
    """
    if not is_object_id_valid(entry_id):
        abort(400)
    if not is_logged():
        flash("You must be logged in to access this page.", "error")
        return render_template("welcome.html")
    else:
        entry = mongo.db.entries.find_one_or_404({"_id": ObjectId(entry_id)})
        if entry["user"] == session["user"]:
            pinned_count = mongo.db.entries.find({
                "user": entry["user"],
                "pinned": True
            })
            if len(list(pinned_count)) >= 5 and not entry["pinned"]:
                flash("You can only pin 5 diary entries at a time. Try unpinning some old entries to make room.", "warning")
                return redirect(url_for("home"))
            else:
                if entry["pinned"]:
                    mongo.db.entries.update_one(
                        {"_id": ObjectId(entry_id)},
                        {"$set": {"pinned": False}})
                    return redirect(url_for("home"))
                else:
                    mongo.db.entries.update_one(
                        {"_id": ObjectId(entry_id)},
                        {"$set": {"pinned": True}})
                    return redirect(url_for("home"))
        else:
            flash("You can only pin your own diary entries.", "error")
            return redirect(url_for("home"))


@app.route("/delete/<entry_id>")
def delete(entry_id):
    """
    Enable a logged in user delete their own entries.
    """
    if not is_object_id_valid(entry_id):
        abort(400)
    if not is_logged():
        flash("You must be logged in to access this page.", "error")
        return render_template("welcome.html")
    else:
        entry = mongo.db.entries.find_one_or_404({"_id": ObjectId(entry_id)})
        if entry["user"] == session["user"]:
            if entry["pinned"]:
                mongo.db.entries.delete_one(
                    {"_id": ObjectId(entry_id)})
                return redirect(url_for("home"))
            else:
                mongo.db.entries.delete_one(
                    {"_id": ObjectId(entry_id)})
                return redirect(url_for("home"))
        else:
            flash("You can only delete your own diary entries.", "error")
            return redirect(url_for("home"))


@app.route("/edit/<entry_id>", methods=["GET", "POST"])
def edit(entry_id):
    """
    POST: Enable a logged in user to edit the contents of their entries
    GET: Return a json object of requested entry
    """
    if not is_object_id_valid(entry_id):
        return abort(400)
    if not is_logged():
        return abort(404)
    entry = mongo.db.entries.find_one_or_404({"_id": ObjectId(entry_id)})
    pinned_count = list(mongo.db.entries.find({
                    "user": entry["user"],
                    "pinned": True
                }))
    if request.method == "GET":
        if entry["user"] == session["user"]:
            entry['_id'] = str(entry['_id'])
            entry['pin_allowed'] = True if entry['pinned'] or len(
                pinned_count) < 5 else False
            res = make_response(jsonify(entry), 200)
            return res
        else:
            abort(400)
    if request.method == "POST":
        if is_object_id_valid(entry_id):
            if entry["user"] == session["user"]:
                # check if title and body exceed character limits
                if len(request.form.get("title")) > TITLE_LIMIT or len(request.form.get("body")) > BODY_LIMIT:
                    flash("Your title or body is too long.", "warning")
                    return redirect(url_for("home"))
                # check if entry is to be pinned
                pinned = True if request.form.get("pinned") == "pin" and (len(
                    pinned_count) < 5 or entry["pinned"] is True) else False
                mongo.db.entries.update_one(
                        {
                            "_id": ObjectId(entry_id)
                        },
                        {"$set": {
                            "_id": ObjectId(entry_id),
                            "title": request.form.get("title"),
                            "body": request.form.get("body"),
                            "type": request.form.get("type"),
                            "pinned": pinned
                        }})
                flash("Entry updated.", "success")
                return redirect(url_for("home"))
            else:
                abort(400)
        else:
            abort(400)


@app.route("/search", methods=["GET", "POST"])
def search():
    """
    Enable a logged in user to query their own entries.
    """
    if request.method == "POST" and is_logged():
        query = request.form.get("query")
        entries = list(mongo.db.entries.find(
            {
                "$text": {"$search": query},
                "user": session["user"]
            }).sort("_id", -1).limit(10))
        if not len(entries):
            flash("No results found, try different keywords.", "warning")
            return redirect(url_for('home'))
        return render_template("search.html", entries=entries)
    else:
        abort(404)


@app.route("/edit_profile", methods=["GET", "POST"])
def edit_profile():
    """
    Enable a logged in user to update profile details.
    """
    if not is_logged():
        return abort(400)
    user_info = mongo.db.users.find_one(
        {
            "username": session["user"]
        })
    if request.method == "POST":
        if not is_url_image(request.form.get("profile-image")):
            flash("Image URL you entered isn't valid, try a different image.", "warning")
            return redirect(url_for("home"))
        mongo.db.users.update_one(
            {
                "username": session["user"]
            },
            {"$set": {
                "firstname": request.form.get("firstname"),
                "profile_image": request.form.get("profile-image"),
                "bio": request.form.get("bio"),
                "allergies": request.form.get("allergens")
            }})
        return redirect(url_for("home"))
    del user_info["_id"]
    del user_info["password"]
    return make_response(jsonify(user_info), 200)


@app.route("/account_settings", methods=["GET", "POST"])
def account_settings():
    """
    Enable a logged in user to update their username or password.
    """
    if not is_logged():
        return abort(400)
    user_info = mongo.db.users.find_one(
        {
            "username": session["user"]
        })
    if request.method == "POST":
        if check_password_hash(user_info["password"], request.form.get("old-password")):
            if request.form.get("new-password"):
                password = generate_password_hash(request.form.get("new-password"))
            else:
                password = user_info["password"]
            username_check = mongo.db.users.find_one(
                {"username": request.form.get("username").lower()})
            if username_check:
                flash("Username is already taken.", "warning")
                return redirect(url_for("feed"))
            if len(request.form.get("username")) > 15:
                flash("Your username is too long, please enter a username that is 15 characters or less.", "warning")
                return redirect(url_for("feed"))
            mongo.db.users.update_one({
                "username": session["user"]
            }, {
                "$set": {
                    "username": request.form.get("username").lower(),
                    "password": password
                }
            })
            session.pop("user")
            flash("Your account settings have been updated. Please sign back in.", "success")
            return redirect(url_for("home"))
        else:
            flash("Incorrect password, please try again.", "warning")
            return redirect(url_for("feed"))
    return make_response(jsonify(user_info["username"]), 200)


@app.errorhandler(404)
def page_not_found(e):
    # handle a page not found error
    return render_template("error.html", error=404), 404


@app.errorhandler(500)
def internal_server(e):
    # handle a server error.
    return render_template("error.html", error=500), 500


@app.errorhandler(400)
def handle_bad_request(e):
    # handle a bad request.
    return render_template("error.html", error=400), 400


def is_logged():
    # check if user is signed in
    return "user" in session


def is_object_id_valid(id_value):
    # validate is the id_value is a valid ObjectId
    return id_value != "" and ObjectId.is_valid(id_value)


def is_url_image(image_url):
    # check if a url returns an image
    # Credit: https://stackoverflow.com/a/48909668
    image_formats = ("image/png", "image/jpeg", "image/jpg", "image/gif")
    r = requests.head(image_url)
    return r.headers["content-type"] in image_formats


@app.route("/check_pins")
def check_pins():
    # check for number of pinned entries and return the number.
    if is_logged():
        pinned_count = list(mongo.db.entries.find({
                "user": session["user"],
                "pinned": True
            }))
        return str(len(pinned_count))
    else:
        abort(400)


if __name__ == "__main__":
    app.run(host=os.environ.get("IP"),
            port=int(os.environ.get("PORT")))  # change at end to False
    app.register_error_handler(404, page_not_found)
    app.register_error_handler(500, internal_server)
    app.register_error_handler(400, handle_bad_request)
