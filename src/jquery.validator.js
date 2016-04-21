(function ($) {
    'use strict';
    var defaults = {
        ERROR_CLASS: 'has-error',
        EMAIL_REGEX: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        ZIP_CODE_REGEX: /[0-9]{2}-[0-9]{3}/,
        options: {}
    };

    $.fn.validateText = function (options) {
        var settings = this.extend({}, defaults);
        settings.options = this.extend({}, defaults.options, options);

        return this.filter('input').each(function () {
            var $el = $(this);

            $el.change(validate);
            if (settings.options.zipcode) {
                zipCodePlugin($el);
            }
        });

        function zipCodePlugin($el) {
            var database;

            $el.keyup(zipCodeValidator);

            function zipCodeValidator() {
                var $input = $(this);
                var zipCode = $input.val();
                if (!validateZipCode(zipCode)) {
                    return;
                }
                if (database) {
                    fillCityInput(zipCode);
                } else {
                    loadDatabase(zipCode);
                }
            }

            function loadDatabase(zipCode) {
                $.ajax({
                    url: 'assets/kody.csv'
                }).done(function (csv) {
                    parseCsv(csv, function () {
                        fillCityInput(zipCode);
                    });
                });
            }

            function parseCsv(csv, callback) {
                Papa.parse(csv, {
                    worker: true,
                    delimiter: ';',
                    header: true,
                    complete: function (data) {
                        database = data.data;
                        callback();
                    }
                });
            }

            function fillCityInput(text) {
                var city = database.find(function (record) {
                    return record['KOD POCZTOWY'] === text;
                });
                if (!city) {
                    return;
                }
                $(settings.options.city)
                    .val(city['MIEJSCOWOŚĆ']);
            }

            function validateZipCode(text) {
                return validatePattern(text, settings.ZIP_CODE_REGEX);
            }
        }

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