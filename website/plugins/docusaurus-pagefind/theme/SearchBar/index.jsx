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
