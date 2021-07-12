import os
from flask import (
    Flask, flash, render_template,
    redirect, request, session, url_for,
    jsonify, make_response)
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


def isLogged():
    try:
        if session["user"]:
            return True
    except KeyError:
        return False


@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        check_user = mongo.db.users.find_one(
            {"username": request.form.get("username").lower()})
        if check_user:
            if check_password_hash(check_user["password"], request.form.get("password")):
                session["user"] = request.form.get("username").lower()
                flash("Welcome, {}!".format(check_user["firstname"]))
                return redirect(url_for("home"))
            else:
                flash("Incorrect username or password. Please try again.")
                return redirect(url_for("home"))
        else:
            flash("Incorrect username or password. Please try again.")
            return redirect(url_for("home"))
    if not isLogged():
        return render_template("welcome.html")
    else:
        return feed()


def feed():
    user_info = mongo.db.users.find_one({"username": session["user"]})
    entries = list(mongo.db.entries.find(
        {"user": session["user"]}).sort("_id", -1))
    pinned_entries = list(mongo.db.entries.find(
        {
            "user": session["user"],
            "pinned": True
        }
    ).sort("_id", -1))
    return render_template(
        "feed.html",
        pinned_entries=pinned_entries,
        entries=entries,
        user=user_info
        )


@app.route("/load")
def load():
    """ Route to return the posts """

    db = list(mongo.db.entries.find(
        {"user": session["user"],
            "pinned": False}
            ).sort("_id", -1))
    posts = len(db)

    for entry in db:
        entry['_id'] = str(entry['_id'])

    quantity = 5


    if request.args:
        # The 'counter' value sent in the QS
        counter = int(request.args.get("c"))

        if counter == 0:
            print(f"Returning posts 0 to {quantity}")
            # Slice 0 -> quantity from the db
            res = make_response(jsonify(db[0: quantity]), 200)

        elif counter == posts:
            print("No more posts")
            res = make_response(jsonify({}), 200)

        else:
            print(f"Returning posts {counter} to {counter + quantity}")
            # Slice counter -> quantity from the db
            res = make_response(jsonify(db[counter: counter + quantity]), 200)

    return res


@app.route("/signout")
def signout():
    if not isLogged():
        flash("You must be logged in to access this page.")
        return render_template("welcome.html")
    else:
        flash("You've been signed out.")
        session.pop("user")
        return redirect(url_for("home"))


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username_check = mongo.db.users.find_one(
            {"username": request.form.get("username").lower()})
        if username_check:
            flash("User already exists, try logging in instead.")
            return redirect(url_for("home"))
        password_check = len(request.form.get("password"))
        if password_check < 6:
            flash("Your password is too short, make sure it's at least 6 characters long.")
            return render_template("register.html")
        new_user = {
            "firstname": request.form.get("firstname").lower().capitalize(),
            "username": request.form.get("username").lower(),
            "password": generate_password_hash(request.form.get("password"))
        }
        mongo.db.users.insert_one(new_user)

        session["user"] = request.form.get("username").lower()
        flash("You're in!")
        return redirect(url_for("home"))
    return render_template("register.html")


@app.route("/new", methods=["GET", "POST"])
def new():
    if not isLogged():
        flash("You must be logged in to access this page.")
        return render_template("welcome.html")
    else:
        pinned_count = list(mongo.db.entries.find({
                "user": session["user"],
                "pinned": True
            }))
        if request.method == "POST":
            current_time = datetime.now()
            body = request.form.get(
                "body") if len(request.form.get("body")) > 1 else None
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
            flash("Your entry has been added!")
            return redirect(url_for("home"))
        return render_template("new.html", pinned_count=pinned_count)


@app.route("/pin/<entry_id>")
def pin(entry_id):
    if not isLogged():
        flash("You must be logged in to access this page.")
        return render_template("welcome.html")
    else:
        entry = mongo.db.entries.find_one_or_404({"_id": ObjectId(entry_id)})
        if entry["user"] == session["user"]:
            pinned_count = mongo.db.entries.find({
                "user": entry["user"],
                "pinned": True
            })
            if len(list(pinned_count)) >= 5 and not entry["pinned"]:
                flash("You can only pin 5 diary entries at a time. Try unpinning some old entries to make room.")
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
            flash("You can only pin your own diary entries.")
            return redirect(url_for("home"))


@app.route("/delete/<entry_id>")
def delete(entry_id):
    if not isLogged():
        flash("You must be logged in to access this page.")
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
            flash("You can only delete your own diary entries.")
            return redirect(url_for("home"))


@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return render_template('404.html'), 404


@app.errorhandler(500)
def page_not_found(e):
    # note that we set the 500 status explicitly
    return render_template('500.html'), 500


if __name__ == "__main__":
    app.run(host=os.environ.get("IP"),
            port=int(os.environ.get("PORT")),
            debug=True)  # change at end to False
