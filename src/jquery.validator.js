(function ($) {
    'use strict';
    var settings = {
        ERROR_CLASS: 'has-error',
        EMAIL_REGEX: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        options: {}
    };

    $.fn.validateText = function (options) {
        settings.options = this.extend({}, settings.options, options);

        return this.filter('input').each(function () {
            var $el = $(this);

            $el.change(validate);
        });
    };


    function validate() {
        var $el = $(this);
        var text = $el.val();

        if (settings.options.pattern) {
            validatePattern(text, $el);
        }
        if (settings.options.email) {
            validateEmail(text, $el);
        }
    }

    function validateEmail(text, $el) {
        validatePattern(text, $el, settings.EMAIL_REGEX);
    }

    function validatePattern(text, $el, pattern) {
        pattern = pattern || settings.options.pattern;

        $el.parent().toggleClass(
            settings.ERROR_CLASS, !pattern.test(text)
        );
    }
}(jQuery));

$('#email').validateText({
    pattern: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłóńśźż]*$/
});

$('#name').validateText({
    email: true
});
