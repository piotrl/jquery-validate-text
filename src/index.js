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
            city: '#city'
        });

        $('#password').validateText({
            password: true
        });

        $('#passwordEntropy').validateText({
            passwordEntropy: true
        });
    });
})(jQuery);