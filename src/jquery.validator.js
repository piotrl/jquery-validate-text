(function ($) {
    'use strict';
    var defaults = {
        ERROR_CLASS: 'has-error',
        EMAIL_REGEX: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        options: {}
    };

    $.fn.validateText = function (options) {
        var settings = this.extend({}, defaults);
        settings.options = this.extend({}, defaults.options, options);

        return this.filter('input').each(function () {
            var $el = $(this);

            $el.change(validate);
        });

        function validate() {
            var $input = $(this);
            var text = $input.val();
            var isValid = true;

            if (isValid && settings.options.pattern) {
                isValid = validatePattern(text);
            }
            if (isValid && settings.options.email) {
                isValid = validateEmail(text);
            }
            errorHanding($input, isValid);
        }

        function errorHanding($input, isValid) {
            $input.parent().toggleClass(
                settings.ERROR_CLASS, !isValid
            );

            $input.closest("form")
                .find('button[type="submit"]')
                .prop("disabled", !isValid);
        }

        function validateEmail(text) {
            return validatePattern(text, settings.EMAIL_REGEX);
        }

        function validatePattern(text, pattern) {
            pattern = pattern || settings.options.pattern;
            return pattern.test(text);
        }
    };
}(jQuery));

$('#name').validateText({
    pattern: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłóńśźż]*$/
});

$('#email').validateText({
    email: true
});
