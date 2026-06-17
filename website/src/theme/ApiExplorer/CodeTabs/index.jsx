/* ============================================================================
 * Swizzled from docusaurus-theme-openapi-docs.
 * Replaces the scrolling <ul> tab list with a <select> dropdown.
 * ========================================================================== */

import React, { cloneElement } from "react";

import {
  sanitizeTabsChildren,
  TabsProvider,
  useTabsContextValue,
} from "@docusaurus/theme-common/internal";
import useIsBrowser from "@docusaurus/useIsBrowser";
import clsx from "clsx";

function TabList({
  action,
  currentLanguage,
  languageSet,
  includeVariant,
  includeSample,
  className,
  selectedValue,
  selectValue,
  tabValues,
}) {
  const handleSelectChange = (event) => {
    const newTabValue = event.currentTarget.value;

    if (newTabValue !== selectedValue) {
      selectValue(newTabValue);
    }

    if (action) {
      let newLanguage;
      if (currentLanguage && includeVariant) {
        newLanguage = languageSet.filter(
          (lang) => lang.language === currentLanguage.language
        )[0];
        newLanguage.variant = newTabValue;
        action.setSelectedVariant(newTabValue.toLowerCase());
      } else if (currentLanguage && includeSample) {
        newLanguage = languageSet.filter(
          (lang) => lang.language === currentLanguage.language
        )[0];
        newLanguage.sample = newTabValue;
        action.setSelectedSample(newTabValue);
      } else {
        newLanguage = languageSet.filter(
          (lang) => lang.language === newTabValue
        )[0];
        action.setSelectedVariant(newLanguage.variants[0].toLowerCase());
        action.setSelectedSample(newLanguage.sample);
      }
      action.setLanguage(newLanguage);
    }
  };

  return (
    <select
      className={clsx("openapi-tabs__code-select", className)}
      value={selectedValue ?? ""}
      onChange={handleSelectChange}
    >
      {tabValues.map(({ value, label }) => (
        <option key={value} value={value}>
          {label ?? value}
        </option>
      ))}
    </select>
  );
}

function TabContent({ lazy, children, selectedValue }) {
  const childTabs = (Array.isArray(children) ? children : [children]).filter(
    Boolean
  );
  if (lazy) {
    const selectedTabItem = childTabs.find(
      (tabItem) => tabItem.props.value === selectedValue
    );
    if (!selectedTabItem) {
      return null;
    }
    return cloneElement(selectedTabItem, { className: "margin-top--md" });
  }
  return (
    <div className="margin-top--md openapi-tabs__code-content">{childTabs}</div>
  );
}

function TabsComponent(props) {
  const tabs = useTabsContextValue(props);
  const { className } = props;

  return (
    <TabsProvider value={tabs}>
      <div
        className={clsx(
          "tabs-container openapi-tabs__code-container",
          className
        )}
      >
        <TabList {...props} {...tabs} />
        <TabContent {...props} {...tabs} />
      </div>
    </TabsProvider>
  );
}

export default function CodeTabs(props) {
  const isBrowser = useIsBrowser();
  return (
    <TabsComponent key={String(isBrowser)} {...props}>
      {sanitizeTabsChildren(props.children)}
    </TabsComponent>
  );
}
