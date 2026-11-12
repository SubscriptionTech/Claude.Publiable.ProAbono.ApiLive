// A Front2026 icon, drawn as a mask so that its colour is the text colour of
// its element: the colour always comes from a token set by the placing rule.
// The SVG files are copied to static/img/design/ by `npm run gen-design`.
import React from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Icon({name, className, style}) {
  const url = useBaseUrl(`/img/design/icon-${name}.svg`);
  return (
    <span
      aria-hidden="true"
      className={clsx('f-icon', className)}
      style={{'--f-icon-url': `url("${url}")`, ...style}}
    />
  );
}
