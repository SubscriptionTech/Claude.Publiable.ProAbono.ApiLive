// Front2026 Dropdown: a trigger showing the current choice (or a fixed title),
// which discloses a panel of the choices. Choosing an option, activating the
// trigger again, pressing Escape or activating anything outside closes it.
//
// An option is either a link (`href`) or an action on the page (`onSelect`).
import React, {useEffect, useId, useRef, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Icon from '@site/src/components/Icon';

export default function Dropdown({label, size = 'medium', title, options, className}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();
  const current = options.find((option) => option.current);
  const triggerText = title ?? current?.text;

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const choose = (option) => {
    setOpen(false);
    option.onSelect?.();
  };

  return (
    <div
      ref={rootRef}
      className={clsx('f-dropdown', `f-dropdown--${size}`, open && 'f-dropdown--open', className)}>
      <button
        ref={triggerRef}
        type="button"
        className="f-dropdown__trigger"
        aria-label={`${label}: ${triggerText}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}>
        <span className="f-dropdown__label">{triggerText}</span>
        <Icon name="arrow-down-01-round" className="f-dropdown__chevron" />
      </button>
      <ul id={panelId} className="f-dropdown__panel" hidden={!open} aria-label={label}>
        {options.map((option) => {
          const content = (
            <>
              <span className="f-dropdown__option-text">{option.text}</span>
              {option.current && <Icon name="tick-02" className="f-dropdown__tick" />}
            </>
          );
          const optionClass = clsx(
            'f-dropdown__option',
            option.current && 'f-dropdown__option--current',
          );
          return (
            <li key={option.key ?? option.text}>
              {option.href && isInternalUrl(option.href) ? (
                <Link
                  className={optionClass}
                  to={option.href}
                  aria-current={option.current ? 'true' : undefined}
                  onClick={() => choose(option)}>
                  {content}
                </Link>
              ) : option.href ? (
                // Another site: an ordinary link, in the same tab
                <a
                  className={optionClass}
                  href={option.href}
                  aria-current={option.current ? 'true' : undefined}
                  onClick={() => choose(option)}>
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  className={optionClass}
                  aria-pressed={option.current ? 'true' : 'false'}
                  onClick={() => choose(option)}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
