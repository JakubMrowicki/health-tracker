/*
Lazy loading for diary entries.
This is an adapted script from the link below.
Credit: https://pythonise.com/categories/javascript/infinite-lazy-loading
*/

// Get references to the dom elements
let scroller = document.querySelector("#scroller");
let template = document.querySelector('#post_template');
let sentinel = document.querySelector('#sentinel');

// Set a counter to count the items loaded
let counter = 0;

// Check if function is already in progress
let working = false;

// Function to request new items and render to the dom
function loadItems() {
    working = true;
    sentinel.innerHTML = `<div class="spinner-border" role="status"></div>`;
    // Use fetch to request data and pass the counter value in the QS
    fetch(`/load?c=${counter}`).then((response) => {

        // Convert the response data to JSON
        response.json().then((data) => {

            // If empty JSON, exit the function
            if (!data.length) {

                // Replace the spinner with "No more posts"
                sentinel.innerHTML = "No more posts";
                working = false;
                return;
            }

            // Iterate over the items in the response
            for (let i = 0; i < data.length; i++) {

                // Clone the HTML template
                let template_clone = template.content.cloneNode(true);

                let pinUrl = "/pin/" + data[i]._id;

                // Query & update the template content
                template_clone.querySelector("#title").innerHTML = data[i].title;
                if (!data[i].body) {
                    template_clone.querySelector("#body").remove();
                } else {
                    template_clone.querySelector("#body").innerHTML = data[i].body;
                }
                let type;
                if (data[i].type == 1) {
                    type = "Diary Entry";
                } else if (data[i].type == 2) {
                    type = "Appointment";
                } else if (data[i].type == 3) {
                    type = "Prescription";
                } else if (data[i].type == 4) {
                    type = "Doctor's Advice";
                } else if (data[i].type == 5) {
                    type = "Allergic Reaction";
                }
                template_clone.querySelector("#date").innerHTML = data[i].date;
                template_clone.querySelector("#type").innerHTML = type;
                template_clone.querySelector("#delete-btn").setAttribute("onclick", "confirm('" + data[i]._id + "')");
                if (data[i].pinned) {
                    template_clone.querySelector("#pin-btn").innerHTML = `<i class="fas fa-star"></i>`;
                    template_clone.querySelector("#pin-btn").setAttribute("title", "Unpin");
                    template_clone.querySelector("#title").innerHTML = `<i style="color: #FFD700" class="fas fa-star"></i> ${data[i].title}`;
                }
                template_clone.querySelector("#pin-btn").setAttribute("href", pinUrl);
                template_clone.querySelector("#edit-btn").setAttribute("onclick", "edit('" + data[i]._id + "')");

                // Append template to dom
                scroller.appendChild(template_clone);

                counter++;
                initTooltips();
                working = false;
                sentinel.innerHTML = "No more posts";
            }
        });
    });
}

// Create a new IntersectionObserver instance
let intersectionObserver = new IntersectionObserver(entries => {

    // If intersectionRatio is 0, the sentinel is out of view
    // and we don't need to do anything. Exit the function
    if (entries[0].intersectionRatio <= 0) {
        return;
    }

    // Call the loadItems function
    loadItems();
});

// Instruct the IntersectionObserver to watch the sentinel
// if sentinel exists
if ($(sentinel).length) {
    intersectionObserver.observe(sentinel);
}


// Check if a user is trying to scroll past the end of the page.
// This is a combination of the three below scripts.
// Credit: https://stackoverflow.com/a/3898152 https://stackoverflow.com/a/10545584 https://stackoverflow.com/a/46248086

$(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta < 0) {
        if($(window).scrollTop() + $(window).height() == $(document).height() && !working) {
            loadItems();
        }
    }
});

let pStart = {x: 0, y:0};
let pStop = {x:0, y:0};

//Start position of swipe
function swipeStart(e) {
    if (typeof e.targetTouches !== "undefined"){
        let touch = e.targetTouches[0];
        pStart.x = touch.screenX;
        pStart.y = touch.screenY;
    } else {
        pStart.x = e.screenX;
        pStart.y = e.screenY;
    }
}

//End position of swipe
function swipeEnd(e){
    if (typeof e.changedTouches !== "undefined"){
        let touch = e.changedTouches[0];
        pStop.x = touch.screenX;
        pStop.y = touch.screenY;
    } else {
        pStop.x = e.screenX;
        pStop.y = e.screenY;
    }
    swipeCheck();
}

function swipeCheck(){
    let changeY = pStart.y - pStop.y;
    let changeX = pStart.x - pStop.x;
    if (isPullUp(changeY, changeX) && !working) {
        loadItems();
    }
}

function isPullUp(dY, dX) {
    // methods of checking slope, length, direction of line created by swipe action 
    return dY > 0 && (
        (Math.abs(dX) <= 100 && Math.abs(dY) >= 200) || (Math.abs(dX)/Math.abs(dY) <= 0.3 && dY >= 60)
    );
}

//Only enable swipe listeners on mobiles
if ($(window).width() <=  768) {
    document.addEventListener('touchstart', function(e){ swipeStart(e); }, false);
    document.addEventListener('touchend', function(e){ swipeEnd(e); }, false);
}