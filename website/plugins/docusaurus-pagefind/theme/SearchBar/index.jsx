// Docusaurus integration glue for pagefind. Docusaurus exposes a `SearchBar`
// theme slot in the navbar — placing a component with this exact name here causes
// Docusaurus to swap it in automatically. Pagefind assets (index + UI widget) are
// generated post-build and don't exist in dev mode, so they are lazy-loaded at
// runtime only in production. In dev the component renders an empty div silently.
import React, { useEffect, useRef } from 'react';

export default function SearchBar() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || process.env.NODE_ENV !== 'production') return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/pagefind/pagefind-ui.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = '/pagefind/pagefind-ui.js';
    script.onload = () => {
      if (window.PagefindUI && containerRef.current) {
        new window.PagefindUI({
          element: containerRef.current,
          showSubResults: true,
          resetStyles: false,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  return <div ref={containerRef} className="pagefind-search-container" />;
}
