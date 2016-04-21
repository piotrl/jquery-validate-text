(function ($) {
    'use strict';
    var defaults = {
        ERROR_CLASS: 'has-error',
        EMAIL_REGEX: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        ZIP_CODE_REGEX: /[0-9]{2}-[0-9]{3}/,
        options: {
            city: '#city',
            refresh: 'change'
        }
    };

    $.fn.validateText = function (options) {
        var settings = this.extend({}, defaults);
        settings.options = this.extend({}, defaults.options, options);

        return this.filter('input').each(function () {
            var $el = $(this);

            if (settings.options.refresh === 'keyup') {
                $el.keyup(validate);
            } else {
                $el.change(validate);
            }
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
            var errors;

            if (!text) {
                return;
            }
            if (isValid && settings.options.pattern) {
                isValid = validatePattern(text);
            }
            if (isValid && settings.options.email) {
                isValid = validateEmail(text);
            }
            if (isValid && settings.options.password) {
                var valid = validatePassword(text);
                isValid = valid.isValid;
                errors = valid.errors;
            }
            errorHanding($input, isValid, errors);
        }

        function validatePassword(text) {
            var errors = [];
            if (!/[\d]+/.test(text)) {
                errors.push("Password must contain number");
            }
            if (text.length < 5) {
                errors.push("Password must have more characters than 5");
            }
            if (/^[a-zA-Z\d\-_.,\s]+$/.test(text)) {
                errors.push("Password must contain special characters");
            }
            if (/[A-Z]+$/.test(text)) {
                errors.push("Password must contain upper case letter");
            }

            return {
                errors: errors,
                isValid: errors.length === 0
            };
        }

        function errorHanding($input, isValid, errors) {
            $input.parent().toggleClass(
                settings.ERROR_CLASS, !isValid
            );
            if (errors && errors.length) {
                console.log(errors);
            }

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