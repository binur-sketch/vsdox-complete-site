import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty = '') => {
  if (typeof window === 'undefined') {
    return dirty || '';
  }
  return DOMPurify.sanitize(dirty || '', { USE_PROFILES: { html: true } });
};

export default sanitizeHtml;

