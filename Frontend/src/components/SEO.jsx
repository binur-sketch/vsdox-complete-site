import { useEffect } from 'react';

const SEO = ({ title, description, keywords, canonical }) => {
    useEffect(() => {
        // Update title
        if (title) {
            document.title = title;
        }

        const updateMetaTag = (selector, attr, content, isProperty = false) => {
            let tag = document.querySelector(selector);
            if (!tag && content) {
                tag = document.createElement('meta');
                if (isProperty) {
                    tag.setAttribute('property', attr);
                } else {
                    tag.name = attr;
                }
                document.head.appendChild(tag);
            }
            if (tag && content) {
                tag.setAttribute('content', content);
            }
        };

        updateMetaTag('meta[name="description"]', 'description', description);
        updateMetaTag('meta[name="keywords"]', 'keywords', keywords);

        // OG Tags
        updateMetaTag('meta[property="og:title"]', 'og:title', title, true);
        updateMetaTag('meta[property="og:description"]', 'og:description', description, true);
        updateMetaTag('meta[property="og:type"]', 'og:type', 'website', true);
        updateMetaTag('meta[property="og:url"]', 'og:url', window.location.href, true);
        updateMetaTag('meta[property="og:image"]', 'og:image', '/og-image.png', true); // Ensure this exists or use a prop

        // Twitter Tags
        updateMetaTag('meta[name="twitter:card"]', 'twitter:card', 'summary_large_image');
        updateMetaTag('meta[name="twitter:title"]', 'twitter:title', title);
        updateMetaTag('meta[name="twitter:description"]', 'twitter:description', description);
        updateMetaTag('meta[name="twitter:image"]', 'twitter:image', '/og-image.png');

        // Update canonical link
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        const canonicalUrl = canonical || window.location.href;
        if (linkCanonical) {
            linkCanonical.setAttribute('href', canonicalUrl);
        } else {
            linkCanonical = document.createElement('link');
            linkCanonical.rel = 'canonical';
            linkCanonical.href = canonicalUrl;
            document.head.appendChild(linkCanonical);
        }

    }, [title, description, keywords, canonical]);

    return null;
};

export default SEO;
