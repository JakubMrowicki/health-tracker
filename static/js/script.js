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

if($('#alert').length) {
    loginFunc(0);
}

$('#log-in-button').bind('click', function() {
    loginFunc();
});

$('#back-button').bind('click', function() {
    backFunc();
});