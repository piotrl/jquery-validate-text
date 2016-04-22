(function ($) {
    'use strict';
    $(function () {
        $('#name').validateText({
            pattern: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłóńśźż]*$/
        });

        $('#email').validateText({
            email: true
        });

        $('#zipcode').validateText({
            zipcode: true,
            city: '#city',
            refresh: 'keyup'
        });

        $('#password').validateText({
            password: true,
            errors: '.error-list',
            refresh: 'keyup'
        });

        $('#passwordEntropy').validateText({
            passwordEntropy: true,
            errors: '.error-list',
            entropy: 35,
            refresh: 'keyup'
        });
    });
})(jQuery);