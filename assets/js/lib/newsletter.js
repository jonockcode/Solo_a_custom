/* Advance only after Tally confirms a successful first-step submission. */
(function () {
    document.querySelectorAll('.cr-newsletter-form').forEach(function (form) {
        const firstStep = form.querySelector('[data-newsletter-step="1"]');
        const secondStep = form.querySelector('[data-newsletter-step="2"]');
        if (!firstStep || !secondStep) return;

        const firstFrame = firstStep.querySelector('iframe');
        const secondFrame = secondStep.querySelector('iframe');
        if (!firstFrame || !secondFrame) return;

        window.addEventListener('message', function (event) {
            if (event.origin !== 'https://tally.so' || event.source !== firstFrame.contentWindow || firstStep.hidden) return;

            let message;
            try {
                message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            } catch (error) {
                return;
            }

            if (!message || message.event !== 'Tally.FormSubmitted' || !message.payload || message.payload.formId !== 'Dq7ovp') return;

            firstStep.hidden = true;
            secondStep.hidden = false;
            secondFrame.src = secondFrame.dataset.tallySrc;
            if (window.Tally) window.Tally.loadEmbeds();
            secondFrame.focus();
        });
    });
})();
