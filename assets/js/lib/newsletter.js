/* Enhance the complete, usable HTML form with two compact views. */
(function () {
    document.querySelectorAll('.cr-newsletter-form').forEach(function (form) {
        const firstStep = form.querySelector('[data-newsletter-step="1"]');
        const secondStep = form.querySelector('[data-newsletter-step="2"]');
        const nextActions = form.querySelector('[data-newsletter-next-actions]');
        const nextButton = form.querySelector('[data-newsletter-next]');
        const backButton = form.querySelector('[data-newsletter-back]');

        if (!firstStep || !secondStep || !nextActions || !nextButton || !backButton) return;

        function showStep(step, focus) {
            firstStep.hidden = step !== firstStep;
            secondStep.hidden = step !== secondStep;
            if (focus) step.querySelector('input').focus();
        }

        function firstInvalidField(container) {
            return Array.from(container.querySelectorAll('input')).find(function (input) {
                return !input.validity.valid;
            });
        }

        function advance() {
            const invalid = firstInvalidField(firstStep);
            if (invalid) {
                invalid.reportValidity();
                return;
            }
            showStep(secondStep, true);
        }

        nextButton.addEventListener('click', advance);
        backButton.addEventListener('click', function () {
            showStep(firstStep, true);
        });

        form.addEventListener('submit', function (event) {
            if (!firstStep.hidden) {
                event.preventDefault();
                advance();
                return;
            }

            const invalid = firstInvalidField(form);
            if (invalid) {
                event.preventDefault();
                showStep(firstStep.contains(invalid) ? firstStep : secondStep, false);
                invalid.reportValidity();
            }
        });

        // Hidden fields remain enabled so the final native POST includes both views.
        // Validate explicitly to reveal any invalid field before the browser focuses it.
        form.noValidate = true;
        nextActions.hidden = false;
        backButton.hidden = false;
        showStep(firstStep, false);
    });
})();
