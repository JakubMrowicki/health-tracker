import os
from flask import (
    Flask, flash, render_template,
    redirect, request, session, url_for)
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
if os.path.exists("env.py"):
    import env


app = Flask(__name__)


app.config["MONGO_DBNAME"] = os.environ.get("MONGO_DBNAME")
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.secret_key = os.environ.get("SECRET_KEY")


mongo = PyMongo(app)


@app.route("/")
def home():
    return render_template("welcome.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username_check = mongo.db.users.find_one({"username": request.form.get("username").lower()})
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
        return redirect(url_for("register"))
    return render_template("register.html")


if __name__ == "__main__":
    app.run(host=os.environ.get("IP"),
            port=int(os.environ.get("PORT")),
            debug=True) #change at end to False