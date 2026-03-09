/**
 * Form Submission Handler
 * Sends form data to FormSubmit.co via AJAX
 * @param {Object} data - The form data to send
 * @param {string} recipientEmail - The destination email (default: corp@virsoftech.com)
 * @returns {Promise<boolean>} - Success or failure
 */
export const handleFormSubmission = async (data, recipientEmail = 'corp@virsoftech.com') => {
    try {
        const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
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
