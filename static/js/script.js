function backFunc(duration = 150){
    $('#login').slideUp( duration, function() {
        // Animation complete.
    });
    $('#default').slideDown( duration, function() {
        // Animation complete.
    });
}

function loginFunc(duration = 150){
    $('#default').slideUp( duration, function() {
        // Animation complete.
    });
    $('#login').slideDown( duration, function() {
        // Animation complete.
    });
}

function profile(){
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

function confirm(elem){
    $(elem).toggleClass("d-none").next().toggleClass("d-none");
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

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    this.addEventListener('hide.bs.tooltip', function () {
        new bootstrap.Tooltip(tooltipTriggerEl)
    })
    return new bootstrap.Tooltip(tooltipTriggerEl)
});




// Get references to the dom elements
var scroller = document.querySelector("#scroller");
var template = document.querySelector('#post_template');
var loaded = document.querySelector("#loaded");
var sentinel = document.querySelector('#sentinel');

// Set a counter to count the items loaded
var counter = 0;

// Function to request new items and render to the dom
function loadItems() {

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

        host = window.location.hostname;
        deleteUrl = host + "/delete/" + data[i]['_id'];
        pinUrl = host + "/pin/" + data[i]['_id'];

        // Query & update the template content
        template_clone.querySelector("#title").innerHTML = `${data[i]['title']}`;
        template_clone.querySelector("#body").innerHTML = data[i]['body'];
        template_clone.querySelector("#date").innerHTML = data[i]['date'];
        template_clone.querySelector("#confirm-btn").setAttribute = ("href", deleteUrl);
        template_clone.querySelector("#pin-btn").setAttribute = ("href", pinUrl);

        // Append template to dom
        scroller.appendChild(template_clone);

        // Increment the counter
        counter += 1;

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