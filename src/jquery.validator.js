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
                let valid = validatePassword(text);
                isValid = valid.isValid;
                errors = valid.errors;
            }
            if (isValid && settings.options.passwordEntropy) {
                let valid = validatePasswordEntropy(text);
                isValid = valid.isValid;
                errors = valid.errors;
            }

            errorHanding($input, isValid, errors);
        }
        
        function validatePasswordEntropy(text) {
            var n = 0;
            if (containsNumber(text)) {
                n += 10;
            }
            if (containsSpecialCharacters(text)) {
                n += 15;
            }
            if (containsUpperCharacters(text)) {
                n += 26;
            }
            if (containsLowerCharacters(text)) {
                n += 26;
            }

            var entropy_character = Math.log2(n);
            var entropy = text.length * entropy_character;
            return {
                isValid: entropy > settings.options.entropy,
                errors: ["Entropy: " + entropy.toFixed(2)]
            };
        }

        function validatePassword(text) {
            var errors = [];
            if (!containsNumber(text)) {
                errors.push("Password must contain number");
            }
            if (text.length < 5) {
                errors.push("Password must have more characters than 5");
            }
            if (!containsSpecialCharacters(text)) {
                errors.push("Password must contain special characters");
            }
            if (!containsUpperCharacters(text)) {
                errors.push("Password must contain upper case letter");
            }
            if (!containsLowerCharacters(text)) {
                errors.push("Password must contain lower case letter");
            }

            return {
                errors: errors,
                isValid: errors.length === 0
            };
        }

        function containsNumber(text) {
            return /[\d]+/.test(text);
        }

        function containsSpecialCharacters(text) {
            return !/^[a-zA-Z\d\-_.,\s]+$/.test(text);
        }

        function containsUpperCharacters(text) {
            return /[A-Z]+$/.test(text);
        }

        function containsLowerCharacters(text) {
            return /[a-z]+$/.test(text);
        }

        function validateEmail(text) {
            return validatePattern(text, settings.EMAIL_REGEX);
        }

        function validatePattern(text, pattern) {
            pattern = pattern || settings.options.pattern;
            return pattern.test(text);
        }

        function errorHanding($input, isValid, errors) {
            $input.parent().toggleClass(
                settings.ERROR_CLASS, !isValid
            );

            var $errorList = $(settings.options.errors);
            $errorList.find('ul').remove();
            if (errors && errors.length) {
                var $errors = buildErrorsDOM(errors);

                $errorList.append($errors);
            }

            $input.closest("form")
                .find('button[type="submit"]')
                .prop("disabled", !isValid);
        }

        function buildErrorsDOM(errors) {
            var $errors = '<ul>';
            errors.forEach(function (error) {
                $errors += '<li>' + error + '</li>';
            });
            $errors += '</ul>';
            return $errors;
        }
    };
}(jQuery));