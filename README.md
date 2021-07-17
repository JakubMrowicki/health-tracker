# Health Tracker - Track Your Health

![AmIResponsive](https://i.imgur.com/ejPKxgw.png)

[View Project on Heroku](http://health-diary-tracker.herokuapp.com/)


The goal of this project is to create an __easy to use health and well-being tracker__. Add entries to keep track of your prescriptions, doctor's advice, appointments and more.

# Table of Contents
1. [Overview/Description](#1-overviewdescription)
2. [User Stories](#2-user-stories)
3. [User Experience (UX)](#3-user-experienceux)
    * [Strategy Plane](#strategy-plane)
    * [Scope Plane](#scope-plane)
    * [Structure Plane](#structure-plane)
    * [Skeleton Plane](#skeleton-plane)
    * [Surface Plane](#surface-plane)
4. [Features](#4-features)
    * [Future Features](#future-features)
5. [Technologies Used](#5-technologies-used)
6. [Trials & Testing](#6-trials--testing)
7. [Problem Solving](#7-problem-areas--solutions)
8. [Code Validation](#8-code-validation)
9. [Website Deployment](#9-website-deployment)
10. [Credits & Acknowledgments](#10-credits--acknowledgments)
11. [Repository Support](#11-repository-support)

# 1: Overview/Description

This project aims to create a diary style app that allow you to keep track of your health.

The website will allow the user to keep track of what they notice about their health, keep history of what medications they've been prescribed, record allergic reactions they have experienced and more.

# 2: User Stories

Below are some user stories which reveal how this website is useful for the end user.
+ 'A user: I want to __keep track of my health and well-being__'
+ 'A user: I want to be able to search for a medication name and check if I have previously had an adverse reaction to it'
+ 'A user: I want to write down and save my doctor's advice so that I don't forget it'
+ 'A user: I want to be able to pin important entries to the top of my timeline, such as important things to mention to my doctor upon my next visit'
+ 'A user: I want to be able to keep a well-being diary where I can write about how I'm feeling'
+ 'A user: I want my profile to display my bio and allergies'

# 3: User Experience(UX)
## Strategy Plane
* What is the purpose of this website?
    * The purpose of this project is to create a health and well-being diary.
* Who is the user?
    * This game suits all age groups, anybody can use it to keep record of their health.
* Value for the user?
    * The user gets to keep track of their health and be able to recall their health details easier if asked my a professional.

---
## Scope Plane
### Function Requirements
* Provide a timeline of the users entries sorted by new to old.
* Allow the user to search for keywords. For example the user might have a diary entry where they have an adverse reaction to particular medication and may choose to find an alternative.
* Allow the user to add, pin, edit and delete diary entries.

### Content Requirements
* Home page where new users are introduced to the web app.
* Private profile where you can see your current medications, any allergies etc.
* A timeline of diary entries, sorted by new with pinned messages highlighted at the top.
* Account settings page where you can edit your profile details.

---
## Structure Plane
### Information Architecture
* There should be annotations on inputs to best describe what they mean.
### Data Structure
__'users' Collection__
key | type | purpose | required?
--- | --- | --- | ---
_id | objectid | unique id | yes
firstname | string | user's first name to be displayed in profile | yes
username | string | user's username | yes
password | string | user's password(hashed) | yes
profile_image | string | image url | no
bio | string | user's bio for profile | no
allergies | string | user's allergies for profile | no

__'entries' Collection__
key | type | purpose | required?
--- | --- | --- | ---
_id | objectid | unique id | yes
title | string | entry title | yes
body | string | entry body | no
type | string | entry type | yes
pinned | boolean | true if entry is pinned | yes
date | string | timestamp of entry creation | yes(automatic)
user | string | entry creator | yes

### Interaction Design
* There should be a way to edit a user's profile/account settings
* Each entry should be able to be pinned, edited and deleted.
* Search functionality

---
## Skeleton Plane
Wireframes can be found [here](https://github.com/JakubMrowicki/health-tracker/blob/master/static/docs/wireframes.pdf)

The footer will contain copyright information.

---
## Surface Plane
### Colours
__Primary Colours:__
Colour | Colour Code | Preview
--- | --- | :---:
Light-Blue | #336AFF | ![#F26432](https://via.placeholder.com/15/336AFF/000000?text=+)
Green | #2B9348 | ![!2B9348](https://via.placeholder.com/15/2B9348/000000?text=+)
Red | #D90429 | ![#D90429](https://via.placeholder.com/15/D90429/000000?text=+)


__Text Body Colours:__
Colour | Colour Code | Preview
--- | --- | :---:
Charcoal | #2c3e50 | ![#2c3e50](https://via.placeholder.com/15/2c3e50/000000?text=+)


### Typography

"[Roboto](https://fonts.google.com/specimen/Roboto)" will be used for any headings.

"[Open Sans](https://fonts.google.com/specimen/Open+Sans)" will be used for the body.
# 4: Features
* User Authentication: Register, Log In and Sign Out functions
* Lazy loading with infinite scroll for viewing entry feed
* Edit and update entries
* Delete entries with confirmation
* Pin entries to be stuck to the top(Limited to 5 pins)
* Search entries function
* Edit Profile and Account settings function

### Future Features
* Ability to attach images to entries
* Ability to upload files, like pdf prescriptions to attach to entries

# 5: Technologies Used
This project uses the following technologies:
* HTML5
* CSS3
* JavaScript
* jQuery
* Python
* Flask
* MongoDB
* Bootstrap 5
* FontAwesome Icons
* Google Fonts
* Github & Git
* GitPod
* Heroku
* animate.css
* ui-avatars.com

# 6: Trials & Testing
* Website was run through the Mobile-Friendly Test by Google and was deemed Mobile Friendly. To further test this, I opened the website on my phone as well as friends and co-workers phones.
    * [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly?id=FR_v3_v6Gc652veMM-1JZg)
* Validated HTML, CSS and JS using validators.
* Checked that all links are working.
* Ran style.css through [Autoprefixer](https://autoprefixer.github.io/) to add vendor prefixes.
* Tested the register and log in function to ensure it's working correctly on desktop, mobile and the Heroku deployment version.
* Tested and ensured that a user cannot pin more than 5 entries at a time.
* Tested the navigation bar to ensure no bugs are present and that it behaves accordingly.
* Tested that all non-public pages return a 404 error if accessed by a user not signed in.
* Tested that you cannot edit another users entries, even if you have the ObjectId of the entry.

# 7: Problem Areas & Solutions
* You could pin more than 5 entries if you pinned it upon creation with 5 pins already present.
    * __Solution:__ I added a check in the backend to prevent this from happening, even if you get rid of the disabled attribute on the checkbox using inspect element.
* Heroku deployed version of the app wouldn't connect to the database even with the same vars.
    * __Solution:__ I noticed that they were in a different order when compared to my env file, so rearranging them solved the issue.
* Mobile only search box remains open if page is resized to desktop size.
    * __Solution:__ I wrote a function that listens for window size changes and hides the search box if it is open.
* Kept getting 404 errors I couldn't find in the code.
    * __Solution__ I noticed in the terminal log that the favicon was returning a 404. Turn out web browsers like to check for one even if it's not declared in the html. Added a favicon to prevent it happening again.
* Heroku app crashed because I imported __requests__ and pip freeze didn't add it to requirements.txt
    * __Solution__ I used the python terminal's help() function to find the requests version number and add it to requirements.txt manually.

# 8: Code Validation
HTML was Validated using the [W3 Validator](https://validator.w3.org/) and returned 12 errors to be ignored.
I'm ignoring these errors because they come from modals, which are hidden by default.

![errors](https://i.imgur.com/yQ6S13B.png)

CSS was Validated using [Jigsaw W3 Validator](https://jigsaw.w3.org/css-validator/) and returned no errors.

JavaScript was Validated using [JSHint](https://jshint.com/) with no major errors.

# 9: Website Deployment
This project is deployed to the public by using Heroku. This is how I did it.

1. Create a new app using the dashboard on Heroku.
2. Deployment method: GitHub for automatic deployment.
3. Go to your app settings tab and configure variables to match __env.py__ file.
4. Ensure that your repository contains the requirements.txt and Procfile files.
5. You can now enable automatic deployment on Heroku.
6. Scrolling down the page, you can click deploy branch.

[View On Heroku](http://health-diary-tracker.herokuapp.com/)

# 10: Credits & Acknowledgments
* [Raeesh Alam](https://stackoverflow.com/a/66288369) for their snippet for initialising Bootstrap Tooltips.

# 11: Repository Support
For support please email at [xdshiftblue@gmail.com](mailto:xdshiftblue@gmail.com)