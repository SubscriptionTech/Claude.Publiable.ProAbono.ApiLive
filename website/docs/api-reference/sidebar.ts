import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api-reference/proabono-api-live",
    },
    {
      type: "category",
      label: "Customers",
      link: {
        type: "doc",
        id: "api-reference/customers",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/retrieve-a-customer",
          label: "Retrieve a customer",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-or-update-a-customer",
          label: "Create or update a customer",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/list-customers",
          label: "List customers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/anonymize-a-customer",
          label: "Anonymize a customer",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/revoke-encrypted-portal-links",
          label: "Revoke encrypted portal links",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/invalidate-a-customer",
          label: "Invalidate a customer",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/suspend-a-customer",
          label: "Suspend a customer",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-the-billing-address-of-a-customer",
          label: "Retrieve the billing address of a customer",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-the-billing-address-of-a-customer",
          label: "Update the billing address of a customer",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-the-payment-settings-of-a-customer",
          label: "Retrieve the payment settings of a customer",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-the-payment-settings-of-a-customer",
          label: "Update the payment settings of a customer",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Usage",
      link: {
        type: "doc",
        id: "api-reference/usage",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/retrieve-all-usages-for-a-customer-or-feature",
          label: "Retrieve all usages for a customer or feature",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-multiple-usages",
          label: "Update multiple usages",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-a-single-usage",
          label: "Retrieve a single usage",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-a-single-usage",
          label: "Update a single usage",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Offers",
      link: {
        type: "doc",
        id: "api-reference/offers",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/list-offers",
          label: "List offers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-a-single-offer-by-reference",
          label: "Retrieve a single offer by reference",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Features",
      link: {
        type: "doc",
        id: "api-reference/features",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/list-all-features",
          label: "List all features",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-a-single-feature-by-reference",
          label: "Retrieve a single feature by reference",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-a-single-feature-by-internal-identifier",
          label: "Retrieve a single feature by internal identifier",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Subscriptions",
      link: {
        type: "doc",
        id: "api-reference/subscriptions",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/retrieve-a-subscription",
          label: "Retrieve a subscription",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-a-subscription",
          label: "Create a subscription",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/update-the-term-date-of-a-subscription",
          label: "Update the term date of a subscription",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/suspend-a-subscription",
          label: "Suspend a subscription",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/start-a-subscription",
          label: "Start a subscription",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/upgrade-a-subscription",
          label: "Upgrade a subscription",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/terminate-a-subscription",
          label: "Terminate a subscription",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/list-subscriptions",
          label: "List subscriptions",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Invoices",
      link: {
        type: "doc",
        id: "api-reference/invoices",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/retrieve-a-single-invoice-by-internal-identifier",
          label: "Retrieve a single invoice by internal identifier",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/retrieve-a-single-invoice-by-full-number",
          label: "Retrieve a single invoice by full number",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/list-invoices",
          label: "List invoices",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/bill-a-customer",
          label: "Bill a customer",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Quoting",
      link: {
        type: "doc",
        id: "api-reference/quoting",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/quote-a-subscription-creation-or-override",
          label: "Quote a subscription creation or override",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/quote-a-subscription-start",
          label: "Quote a subscription start",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/quote-a-subscription-upgrade",
          label: "Quote a subscription upgrade",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/quote-a-usage-update",
          label: "Quote a usage update",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/quote-a-balance-line-creation",
          label: "Quote a balance line creation",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "BalanceLines",
      link: {
        type: "doc",
        id: "api-reference/balance-lines",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/create-a-balance-line",
          label: "Create a balance line",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/list-balance-lines",
          label: "List balance lines",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
