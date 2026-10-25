import { useEffect } from 'react';

/**
 * Custom hook to dynamically synchronize document title, meta description,
 * and canonical URL with current application state (selected basin, horizon).
 */
export function useSeo({ title, description, canonical }) {
  useEffect(() => {
    // 1. Update Document Title
    if (title && document.title !== title) {
      document.title = title;
    }

    // 2. Update Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      }
    }

    // 3. Update Canonical Link
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (linkCanonical) {
        linkCanonical.setAttribute('href', canonical);
      }
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', canonical);
      }
    }
  }, [title, description, canonical]);
}
