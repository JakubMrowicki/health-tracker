//This function opens a modal to enable the user to edit their profile details
function profile() {
    fetch('/edit_profile').then((response) => {
        response.json().then((data) => {
            $('#profile-firstname').val(data.firstname);
            $('#profile-image').val(data.profile_image);
            $('#profile-bio').val(data.bio);
            $('#profile-allergens').val(data.allergies);
            $('#profileModal').modal('show');
        });
    });
}

//This function opens a modal to enable the user to edit their username/password
function account() {
    fetch('/account_settings').then((response) => {
        response.json().then((data) => {
            $('#new-username').val(data);
            $(".tooltip").tooltip("hide");
            $('#accountModal').modal('show');
        });
    });
}

//This function opens a modal so the user can confirm deletion of entry
function confirm(id) {
    $(".tooltip").tooltip("hide");
    $('#deleteModal').modal('show');
    $('#confirmFinal').attr('href', "/delete/" + id);
}

//This function opens a modal to enable the user to create a new entry
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
        });
    });
}

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

//This function seeks out all elements with ID="alert"
//and assigns a bind function so the user can click it away
//Credit for selector: https://stackoverflow.com/a/16191756
$('div[id^="alert"]').each(function() {
    $(this).bind('click', function() {
        $(this).slideUp(150);
    });
});

//Initialise Bootstrap Tooltips MD+ Only
//Tooltips need to be re-initialised when a new tooltip is added to the page.
function initTooltips() {
    if ($(window).width() >  768) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            this.addEventListener('hide.bs.tooltip', function () {
                bootstrap.Tooltip(tooltipTriggerEl);
            });
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}
initTooltips();

/*
Edit Modal
Fetch field values from database and render in the form
*/

function edit(id) {
    let title = $('#edit-title');
    let body = $('#edit-body');
    let type = $('#edit-type');
    let pinned = $('#edit-pinned');
    let form = $('#editForm');

    fetch(`/edit/${id}`).then((response) => {
        response.json().then((data) => {
            title.val(data.title);
            body.val(data.body);
            type.val(data.type);
            if(data.pinned == true) {
                pinned.prop('checked', true);
            } else {
                pinned.prop('checked', false);
            }
            form.prop('action', "/edit/" + data._id);

            if(!data.pin_allowed) {
                pinned.prop('disabled', true);
                $('#pinAllow').attr('data-bs-toggle', 'tooltip');
                $('#pinAllow').attr('data-bs-placement', 'bottom');
                $('#pinAllow').attr('title', 'Maximum pins limit reached.');
                initTooltips();
            }
            $(".tooltip").tooltip("hide");
            $('#editModal').modal('show');
        });
    });
}