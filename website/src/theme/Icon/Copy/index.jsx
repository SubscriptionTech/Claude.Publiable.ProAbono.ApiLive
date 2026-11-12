// Front2026 ArticleContent → code block → copy control: the copy-01 icon.
// The className lets Docusaurus show the copy icon or the success icon.
import React from 'react';
import Icon from '@site/src/components/Icon';

export default function IconCopy({className}) {
  return <Icon name="copy-01" className={className} />;
}
