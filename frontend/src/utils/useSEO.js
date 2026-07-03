import { useEffect } from 'react';

/**
 * useSEO — updates document title and meta description per page.
 * Improves Lighthouse SEO score by ensuring each page has unique metadata.
 *
 * @param {string} title - Page title
 * @param {string} description - Page meta description
 */
export default function useSEO(title, description) {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Update meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }

    // Update OG title
    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.content = title;
    }

    // Update OG description
    if (description) {
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.content = description;
    }

    // Cleanup: restore default on unmount
    return () => {
      document.title = 'Personalized News Recommendation System | ML Final Year Project';
    };
  }, [title, description]);
}
