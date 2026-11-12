// Front2026 ArticleContent → code block → copy control: the tick-02 icon.
// The className lets Docusaurus show the copy icon or the success icon.
import React from 'react';
import Icon from '@site/src/components/Icon';

export default function IconSuccess({className}) {
  return <Icon name="tick-02" className={className} />;
}
