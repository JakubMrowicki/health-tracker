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
    if($('#details-box').css('display') == 'none'){
        $('#details-box').slideDown( 150, function() {
            // Animation complete.
        });
        $('.rotate').toggleClass("down"); 
    } else {
        $('#details-box').slideUp( 150, function() {
            // Animation complete.
        });
        $('.rotate').toggleClass("down"); 
    }
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

$('#log-in-button').bind('click', function() {
    loginFunc();
});

$('#back-button').bind('click', function() {
    backFunc();
});

$('#details').bind('click', function() {
    profile();
});

$('#alert').bind('click', function() {
    $(this).slideUp(150);
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
    var scroller = document.querySelector("#scroller");
    var template = document.querySelector('#post_template');
    var sentinel = document.querySelector('#sentinel');

    // Set a counter to count the items loaded
    var counter = 0;

    // Function to request new items and render to the dom
    function loadItems() {
        sentinel.innerHTML = `<div class="spinner-border" role="status"></div>`;
        // Use fetch to request data and pass the counter value in the QS
        fetch(`/load?c=${counter}`).then((response) => {

            // Convert the response data to JSON
            response.json().then((data) => {

                // If empty JSON, exit the function
                if (!data.length) {

                    // Replace the spinner with "No more posts"
                    sentinel.innerHTML = "No more posts";
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
                    template_clone.querySelector("#pin-btn").setAttribute("href", pinUrl);
                    template_clone.querySelector("#edit-btn").setAttribute("onclick", "edit('" + data[i]['_id'] + "')");

                    // Append template to dom
                    scroller.appendChild(template_clone);

                    // Increment the counter
                    counter += 1;
                    sentinel.innerHTML = "No more posts";
                }
            })
        })
    }

    // Create a new IntersectionObserver instance
    var intersectionObserver = new IntersectionObserver(entries => {

        // Uncomment below to see the entry.intersectionRatio when
        // the sentinel comes into view

        // entries.forEach(entry => {
        //   console.log(entry.intersectionRatio);
        // })

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
}