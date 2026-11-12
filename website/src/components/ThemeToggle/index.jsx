// Front2026 ThemeToggle: a Dropdown at its medium size with three fixed
// choices — light, dark, follow the system. Docusaurus persists the choice
// (null = follow the system) and applies it before the first paint.
import React from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Dropdown from '@site/src/components/Dropdown';

const CURRENT_TEXT = {
  light: 'Theme: light',
  dark: 'Theme: dark',
  system: 'Theme: auto',
};

export default function ThemeToggle({className}) {
  const {colorModeChoice, setColorMode} = useColorMode();
  // The stored choice is only known in the browser: the server-rendered page
  // shows the default, and the real choice replaces it once hydrated.
  const isBrowser = useIsBrowser();
  const choice = (isBrowser && colorModeChoice) || 'system';
  const option = (key, text, value) => ({
    key,
    text,
    current: choice === key,
    onSelect: () => setColorMode(value),
  });
  return (
    <Dropdown
      className={className}
      label="Theme"
      size="medium"
      title={CURRENT_TEXT[choice]}
      options={[
        option('light', 'Light', 'light'),
        option('dark', 'Dark', 'dark'),
        option('system', 'Auto', null),
      ]}
    />
  );
}
