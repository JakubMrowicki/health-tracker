import os
from flask import (
    Flask, flash, render_template,
    redirect, request, session, url_for)
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
            if check_password_hash(
                check_user["password"], request.form.get("password")):
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
        {"user": session["user"]}))
    return render_template("feed.html", entries=entries, user=user_info)

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
        if request.method == "POST":
            current_time = datetime.now()
            body = request.form.get("body") if len(request.form.get("body")) > 1 else None
            pinned = True if request.form.get("pinned") == "pin" else False
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
        return render_template("new.html")


if __name__ == "__main__":
    app.run(host=os.environ.get("IP"),
            port=int(os.environ.get("PORT")),
            debug=True) #change at end to False