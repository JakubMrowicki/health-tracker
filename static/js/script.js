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