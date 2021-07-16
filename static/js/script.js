let host = location.protocol + "//" + window.location.hostname;

function backFunc(duration = 150) {
    $('#login').slideUp( duration, function() {
        // Animation complete.
    });
    $('#default').slideDown( duration, function() {
        // Animation complete.
    });
}

function loginFunc(duration = 150) {
    $('#default').slideUp( duration, function() {
        // Animation complete.
    });
    $('#login').slideDown( duration, function() {
        // Animation complete.
    });
}

function profile() {
    
}

function confirm(id) {
    $('#deleteModal').modal('show');
    $('#confirmFinal').attr('href', host + "/delete/" + id)
}

function newEntry() {
    fetch('check_pins').then((response) => {
        response.json().then((data) => {
            $(".tooltip").tooltip("hide");
            $('#addModal').modal('show');
            if(parseInt(data) >= 5) {
                $('#add-pinned').prop('disabled', true);
                $('#add-pinAllow').attr('data-bs-toggle', 'tooltip');
                $('#add-pinAllow').attr('data-bs-placement', 'bottom');
                $('#add-pinAllow').attr('title', 'Maximum pins limit reached.');
                initTooltips();
            }
        })
    })
}

if($('#alert').length) {
    loginFunc(0);
}

//Functions related to the search functionality.

//This bind enables an alternative search box for mobile users.
$('#search-btn').bind('click', function(e) {
    if ($(window).width() <=  768) {
        e.preventDefault();
        $(".tooltip").tooltip("hide");
        $('#search-box2').slideToggle( 150, function() {
            if ($('#search-box2').css('display') == 'block') {
                $('#mquery').focus();
            }
        });
    }
});

//This function hides the mobile search box if it is left open and the window
//is resized to 768px+ width as the inline nav search box is now active.
window.onresize = searchHider;
function searchHider() {
    if (window.innerWidth >= 768 && $('#search-box2').css('display') == 'block') {
        $('#search-box2').slideUp( 150, function() {
            // Animation complete.
        });
    }
}

$('#log-in-button').bind('click', function() {
    loginFunc();
});

$('#back-button').bind('click', function() {
    backFunc();
});

$('#alert').each(function() {
    $(this).bind('click', function() {
        $(this).slideUp(150);
    });
});

function initTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        this.addEventListener('hide.bs.tooltip', function () {
            new bootstrap.Tooltip(tooltipTriggerEl)
        })
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
}
initTooltips();

/*
Edit Modal
*/

function edit(id) {
    let title = $('#edit-title');
    let body = $('#edit-body');
    let type = $('#edit-type');
    let pinned = $('#edit-pinned');
    let form = $('#editForm');

    fetch(`/edit/${id}`).then((response) => {
        response.json().then((data) => {

            title.val(data['title']);
            body.val(data['body']);
            type.val(data['type']);
            if(data['pinned'] == true) {
                pinned.prop('checked', true);
            } else {
                pinned.prop('checked', false);
            }
            form.prop('action', "/edit/" + data['_id'])

            if(!data['pin_allowed']) {
                pinned.prop('disabled', true);
                $('#pinAllow').attr('data-bs-toggle', 'tooltip');
                $('#pinAllow').attr('data-bs-placement', 'bottom');
                $('#pinAllow').attr('title', 'Maximum pins limit reached.');
                initTooltips();
            }

            $('#editModal').modal('show');
        })
    })
}

/*
Lazy loading for diary entries.
This is an adapted script from the link below.
Credit: https://pythonise.com/categories/javascript/infinite-lazy-loading
*/

if ($('#feed-header').length) {
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
                for (var i = 0; i < data.length; i++) {

                    // Clone the HTML template
                    let template_clone = template.content.cloneNode(true);

                    let pinUrl = host + "/pin/" + data[i]['_id'];

                    // Query & update the template content
                    template_clone.querySelector("#title").innerHTML = data[i]['title'];
                    if (!data[i]['body']) {
                        template_clone.querySelector("#body").remove();
                    } else {
                        template_clone.querySelector("#body").innerHTML = data[i]['body'];
                    }
                    template_clone.querySelector("#date").innerHTML = data[i]['date'];
                    template_clone.querySelector("#delete-btn").setAttribute("onclick", "confirm('" + data[i]['_id'] + "')");
                    if (data[i]['pinned']) {
                        template_clone.querySelector("#pin-btn").innerHTML = `<i class="fas fa-star"></i>`;
                        template_clone.querySelector("#pin-btn").setAttribute("title", "Unpin");
                        template_clone.querySelector("#title").innerHTML = `<i class="fas fa-star"></i> ${data[i]['title']}`;
                    }
                    template_clone.querySelector("#pin-btn").setAttribute("href", pinUrl);
                    template_clone.querySelector("#edit-btn").setAttribute("onclick", "edit('" + data[i]['_id'] + "')");

                    // Append template to dom
                    scroller.appendChild(template_clone);

                    // Increment the counter
                    counter++;
                    initTooltips();
                    working = false;
                    sentinel.innerHTML = "No more posts";
                }
            })
        })
    }

    // Create a new IntersectionObserver instance
    var intersectionObserver = new IntersectionObserver(entries => {

        // If intersectionRatio is 0, the sentinel is out of view
        // and we don't need to do anything. Exit the function
        if (entries[0].intersectionRatio <= 0) {
            return;
        }

        // Call the loadItems function
        loadItems();
    });

    // Instruct the IntersectionObserver to watch the sentinel
    intersectionObserver.observe(sentinel);

    
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

    // If on mobile, enable swipe up to load more.

    if ($(window).width() <=  768) {
        var pStart = {x: 0, y:0};
        var pStop = {x:0, y:0};
        
        function swipeStart(e) {
            if (typeof e['targetTouches'] !== "undefined"){
                var touch = e.targetTouches[0];
                pStart.x = touch.screenX;
                pStart.y = touch.screenY;
            } else {
                pStart.x = e.screenX;
                pStart.y = e.screenY;
            }
        }
        
        function swipeEnd(e){
            if (typeof e['changedTouches'] !== "undefined"){
                var touch = e.changedTouches[0];
                pStop.x = touch.screenX;
                pStop.y = touch.screenY;
            } else {
                pStop.x = e.screenX;
                pStop.y = e.screenY;
            }
        
            swipeCheck();
        }
        
        function swipeCheck(){
            var changeY = pStart.y - pStop.y;
            var changeX = pStart.x - pStop.x;
            if (isPullUp(changeY, changeX) && !working) {
                loadItems();
            }
        }
        
        function isPullUp(dY, dX) {
            // methods of checking slope, length, direction of line created by swipe action 
            return dY > 0 && (
                (Math.abs(dX) <= 100 && Math.abs(dY) >= 200)
                || (Math.abs(dX)/Math.abs(dY) <= 0.3 && dY >= 60)
            );
        }
        
        document.addEventListener('touchstart', function(e){ swipeStart(e); }, false);
        document.addEventListener('touchend', function(e){ swipeEnd(e); }, false);
    }
}