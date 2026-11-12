// Front2026 ArticleContent → Callout. The authored kinds map onto the four
// kinds of the design system; without a title of the author's, the callout
// takes the default title of its kind.
import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames, processAdmonitionProps} from '@docusaurus/theme-common';
import Icon from '@site/src/components/Icon';

const KIND_OF_TYPE = {
  note: 'note',
  info: 'note',
  tip: 'tip',
  caution: 'caution',
  warning: 'caution',
  danger: 'danger',
};

const KINDS = {
  note: {title: 'Note', icon: 'information-circle'},
  tip: {title: 'Tip', icon: 'bulb'},
  caution: {title: 'Caution', icon: 'alert-02'},
  danger: {title: 'Danger', icon: 'alert-diamond'},
};

export default function Admonition(unprocessedProps) {
  const {type, title, children, className} = processAdmonitionProps(unprocessedProps);
  const kind = KIND_OF_TYPE[type] ?? 'note';
  const {title: defaultTitle, icon} = KINDS[kind];
  return (
    <div
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(type),
        'callout',
        `callout--${kind}`,
        className,
      )}>
      <div className="callout__title-line">
        <Icon name={icon} className="callout__icon" />
        <span className="callout__title">{title ?? defaultTitle}</span>
      </div>
      <div className="callout__text">{children}</div>
    </div>
  );
}
