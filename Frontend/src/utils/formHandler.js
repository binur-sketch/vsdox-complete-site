import { DEFAULTS, FORM_SUBMIT_BASE_URL } from '../config/appConstants';

/**
 * Form Submission Handler
 * Sends form data to FormSubmit.co via AJAX
 * @param {Object} data - The form data to send
 * @param {string} recipientEmail - The destination email (defaults to VITE_CONTACT_EMAIL)
 * @returns {Promise<boolean>} - Success or failure
 */
export const handleFormSubmission = async (data, recipientEmail = DEFAULTS.recipientEmail) => {
    try {
        const response = await fetch(`${FORM_SUBMIT_BASE_URL}/${recipientEmail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                _subject: `New Request from VSDOX Website - ${data.subject || 'Demo Request'}`,
                _template: 'table'
            })
        });

        const result = await response.json();
        return result.success === 'true';
    } catch (error) {
        console.error('Form submission error:', error);
        return false;
    }
};
