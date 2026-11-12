// The search of the top bar (shared/Front2026/components/custom/app-bar-with-search.md,
// part "search"), placed through the Docusaurus `SearchBar` theme slot. It renders the
// three forms of the trigger and CSS shows exactly one per viewport mode:
//   - big screen: a SearchField used as a trigger;
//   - desktop: an IconButton, secondary, medium;
//   - below desktop: an IconButton, secondary, small.
// Activating any of them opens the SearchDialog, rendered only while open.
import React, {useCallback, useRef, useState} from 'react';
import clsx from 'clsx';
import Icon from '@site/src/components/Icon';
import SearchDialog from '../SearchDialog';
import styles from '../SearchDialog/styles.module.css';

const SEARCH_LABEL = 'Search';

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  const openDialog = useCallback((event) => {
    triggerRef.current = event.currentTarget;
    setOpen(true);
  }, []);

  const closeDialog = useCallback(({returnFocus}) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus({preventScroll: true});
  }, []);

  return (
    <div className={styles.trigger}>
      <button
        type="button"
        className={clsx('f-search-field', styles.triggerField)}
        aria-haspopup="dialog"
        onClick={openDialog}>
        <Icon name="search-01" className="f-search-field__icon" />
        <span className="f-search-field__placeholder">{SEARCH_LABEL}</span>
      </button>
      <button
        type="button"
        className={clsx('f-icon-button f-icon-button--secondary f-icon-button--medium', styles.triggerMedium)}
        aria-label={SEARCH_LABEL}
        aria-haspopup="dialog"
        onClick={openDialog}>
        <Icon name="search-01" />
      </button>
      <button
        type="button"
        className={clsx('f-icon-button f-icon-button--secondary f-icon-button--small', styles.triggerSmall)}
        aria-label={SEARCH_LABEL}
        aria-haspopup="dialog"
        onClick={openDialog}>
        <Icon name="search-01" />
      </button>
      {open && <SearchDialog onClose={closeDialog} />}
    </div>
  );
}
