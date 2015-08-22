
$(document).ready(function () {
    'use strict';
    $('input[value=Cancel]').click(function () {
        parent.history.back();
        return false;
    });
});

$(document).ready(function () {
    'use strict';
    $('#launch').click(function () {
        $('#light_bg').fadeIn('slow');
        $('#tehF0rm').fadeIn('slow');
        $('body').css('overflow', 'hidden');
    });

    $('#close').click(function () {
        $('#light_bg').fadeOut('slow');
        $('#tehF0rm').fadeOut('slow');
        $('body').css('overflow', 'visible');
    });
});
