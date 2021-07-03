# Health Tracker - Track Your Health

![AmIResponsive]()

[View Project on Heroku](https://jakubmrowicki.github.io/memory-keypad/)


The goal of this project is to create an __easy to use health and well-being tracker__. Add entries to keep track of your prescriptions, doctor's advice and more.

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

This project aims to create a diary style app that allow you to keep a health diary.

The website will allow the user to keep track of what they notice about their health, keep history of what medications they've been prescribed, record allergic reactions they have experienced and more.

# 2: User Stories

Below are some user stories which reveal how this website is useful for the end user.
+ 'A user: I want to __keep track of my health and well-being__'
+ 'A user: I want to be able to search for a medication name and see if I have previously had an adverse reaction to it'
+ 'A user: I want to write down and save my doctor's advice so that I don't forget it'
+ 'A user: I want to be able to pin important entries to the top of my timeline, such as important things to mention to my doctor upon my next visit'
+ 'A user: I want to be able to keep a well-being diary where I can write about how I'm feeling at that time'
+ 'A user: I want my profile to diplay my current medications and allergies'

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
* Provide a log timeline of the users entries sorted by new to old.
* Allow the user to search for keywords. For example the user might have a diary entry where they have an adverse reaction to particular medication and may choose to find an alternative.
* Allow the user to pin, edit and delete diary entries.
* Allow the user to make their profile public if they choose to share their profile link.
### Content Requirements
* Home page where new users are introduced to the web app and it's features.
* Private profile where you can see your current medications, any allergies etc.
* A timeline of diary entries, sorted by new with pinned messages highlighted at the top.
* Account settings page where you can edit your profile details.
---
## Structure Plane
### Information Architecture
* The website will be lean in terms of written content, however there needs to be a home page that will introduce new users to the web app and it's features.
* There should be annotations on inputs to best describe what they mean.
### Interaction Design
* 

---
## Skeleton Plane
Wireframes can be found [here](https://github.com/JakubMrowicki/memory-keypad/blob/master/assets/docs/wireframes.pdf)

The website will be laid out over a single page where you can play the game as well as find more information about it.

The footer will contain copyright information and some social media links.

---
## Surface Plane
### Colours
__Primary Colours:__
Colour | Colour Code | Preview
--- | --- | :---:
Light-Blue | #336AFF | ![#F26432](https://via.placeholder.com/15/336AFF/000000?text=+)
Green | #2B9348 | ![!2B9348](https://via.placeholder.com/15/2B9348/000000?text=+)
Red | #D90429 | ![#D90429](https://via.placeholder.com/15/D90429/000000?text=+)
Dark-Grey | #191C24 | ![#191C24](https://via.placeholder.com/15/191C24/000000?text=+)


__Text Body Colours:__
Colour | Colour Code | Preview
--- | --- | :---:
Off-White | #FAFAFA | ![#FAFAFA](https://via.placeholder.com/15/FAFAFA/000000?text=+)


### Typography
"[Zilla Slab Highlight](https://fonts.google.com/specimen/Zilla+Slab+Highlight)" will be used at the top of the page to display the title of the game.

"[Roboto](https://fonts.google.com/specimen/Roboto)" will be used for any headings.

"[Open Sans](https://fonts.google.com/specimen/Open+Sans)" will be used for the body.
# 4: Features
* 
### Future Features
* 


# 5: Technologies Used
This project uses the following technologies:
* HTML5
* CSS3
* JavaScript
* jQuery
* Bootstrap 4.6
* FontAwesome Icons
* Google Fonts
* Github & Git
* GitPod
* Heroku
* Photoshop

# 6: Trials & Testing
* Website was run through the Mobile-Friendly Test by Google and was deemed Mobile Friendly. To further test this, I opened the website on my phone as well as friends and co-workers phones.
    * [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly?id=YtC6Iv3b3o0T8zjpbLbqcw)
* Validated HTML, CSS and JS using validators.
* Checked that all links are working using [deadlinkchecker.com](https://www.deadlinkchecker.com/website-dead-link-checker.asp)
* Ran style.css through [Autoprefixer](https://autoprefixer.github.io/) to add vendor prefixes.
* Used [Color Contrast Accessibility Validator](https://color.a11y.com/Contrast/) to check for Colour Contrast issues.
* Checked and fixed any typos and grammar issues that I could find by using a [Chrome Extension called Webpage Spell-Check](https://chrome.google.com/webstore/detail/webpage-spell-check/mgdhaoimpabdhmacaclbbjddhngchjik).

# 7: Problem Areas & Solutions
* My friends were not sure if the game was active or not when I showed them.
    * __Solution:__ I added a glow to the keypad keys to let users know the game is started.

# 8: Code Validation
HTML was Validated using the [W3 Validator](https://validator.w3.org/) and returned no errors and 1 warning to be ignored.
![warning](https://i.imgur.com/msqbuIj.png)

The reason why I have prevented users from resizing the page is because on mobiles, double tapping on the screen will zoom into the game. This is undesireable and bad UX.

CSS was Validated using [Jigsaw W3 Validator](https://jigsaw.w3.org/css-validator/) and returned no errors.

JavaScript was Validated using [JSHint](https://jshint.com/)

Alicia Ramirez' [Closing Tag Checker for HTML5](https://www.aliciaramirez.com/closing-tags-checker/) was used to further validate the code.

# 9: Website Deployment
This project is deployed to the public by using Heroku

[View On Heroku](https://jakubmrowicki.github.io/memory-keypad/)

# 10: Credits & Acknowledgments
* 

### Content
* All written content is written by myself.
# 11: Repository Support
For support please email at [xdshiftblue@gmail.com](mailto:xdshiftblue@gmail.com)