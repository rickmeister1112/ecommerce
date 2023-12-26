export const zoho = {
  BASE_URL: 'https://accounts.zoho.in',
  BASE_URL_API: 'https://www.zohoapis.in',
  BASE_URL_API_2: 'https://inventory.zoho.com',
  INVENTORY_ENDPOINT: 'api/v1/itemdetails',
  TOKEN_ENDPOINT: '/oauth/v2/token',
  TAXES_ENDPOINT: 'inventory/v1/settings/taxes',
  PRODUCT_ENDPOINT: `inventory/v1/items`
}

let zohoInventoryUrl = "https://www.zohoapis.in/inventory/v1";
let zohoBooksUrl = "https://www.zohoapis.com/books/v3";
let cashfreeUrl = "https://api.cashfree.com/pg";
let bnplServerUrl = process.env.rupify_api_url + "/v1";
let zohoServer = "https://accounts.zoho.in";
let zohoAnalyticsServer = "https://analyticsapi.zoho.in/api";
let vyapStorefront = "https://www.vyap.in/storefront/api/v1";
let selfServer = "http://localhost:" + process.env.PORT || '2222';
let zohoOrgSuffix = "?organization_id=60017418631";

export const apis = {
  newPayment: (...params) => `${zohoInventoryUrl}/customerpayments${zohoOrgSuffix}`,
  salesOrder: (...params) => `${zohoInventoryUrl}/salesorders/${params[0].salesorderId}${zohoOrgSuffix}`,
  createPaymentLink: (...params) => `${cashfreeUrl}/links`,
  fetchPaymentLink: (...params) => `${cashfreeUrl}/links/${params[0]}`,
  zohoOauthToken: (...params) => `${zohoServer}/oauth/v2/token?refresh_token=${process.env.zoho_refreshtoken}&client_id=${process.env.zoho_client_id}&client_secret=${process.env.zoho_client_secret}&grant_type=refresh_token`,
  zohoAnalyticsExport: (...params) => `${zohoAnalyticsServer}/${params[0]}/${params[1]}/${params[2]}`,
  bnplCustomerInfo: (...params) => `${bnplServerUrl}/payment-methods/rupifi-bnpl/customers/eligibility`,
  bnplShareGMV: (...params) => `${bnplServerUrl}/payment-methods/rupifi-bnpl/customers/gmv`,
  bnplPaymentOrder: (...params) => `${bnplServerUrl}/orders`,
  bnplGetPaymentOrder: (...params) => `${bnplServerUrl}/orders/${params[0]}`,
  bnplCompletePayment: (...params) => `${bnplServerUrl}/orders/${params[0]}/capture`,
  fetchInvoice: (...params) => `${zohoInventoryUrl}/invoices/${params[0]}${zohoOrgSuffix}`,
  bnplRefundOrder: (...params) => `${bnplServerUrl}/orders/${params[0]}/refund`,
  bnplRefundPayment: (...params) => `${bnplServerUrl}/refunds`,
  bnplFetchPayment: (...params) => `${bnplServerUrl}/orders/${params[0]}/payments`,
  recordPayment: (...params) => `${selfServer}/recordPayment`,
  bnplAccountStatement: (...params) => `${bnplServerUrl}/payment-methods/rupifi-bnpl/customers/accounts/statement`,
  getCustomer: (...params) => `${zohoInventoryUrl}/contacts/${params[0]}${zohoOrgSuffix}`,
  createZohoOrder: (...params) => `${vyapStorefront}/checkout/process-offline-payment`,
  getZohoPaymentStatus: (...params) => `${vyapStorefront}/paymentstatus/${params[0]}`,
  getCategoriesList: (...params) => `${vyapStorefront}/categories`,
  getColsOrCats: (...params) => `${vyapStorefront}/${params[1] == 'collection' ? 'collections' : 'categories'}/${params[0]}`,
  getItem: (...params) => `${zohoInventoryUrl}/items/${params[0]}${zohoOrgSuffix}`,
  getItemCustomPrices: (...params) => `${zohoBooksUrl}/items/pricebookrate`,
};


export const defaults = {
  bnplQualifyDuration: 3 * 31 * 24 * 60 * 60 * 1000 // 3 months
};

export const genHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const cashfree = {
  authHeaders: {
    "x-api-version": "2022-09-01",
    "x-client-id": process.env.cashfree_client_id,
    "x-client-secret": process.env.cashfree_client_secret,
    ...genHeaders,
  },
};

export const rupify = {
  authHeaders: {
    "x-rpf-key": process.env.rupify_api_key,
    ...genHeaders,
  }
};

export const messages = {
  noFirstOrder: "TnC: Minimum transaction period should be more than 3 months. Credit limit will be dependent on total order value.",
  beforeQualify: (...params) => `You will be qualified on ${params[0]}`,
  approvedCredit: (...params) => `You have a pre-approved limit of ${params[0]}.\nActual limit may differ upon final approval.`,
  creditValue: (...params) => `Credit limit: ${params[0]}`,
  notOnboarded: "Customer not onboarded. Please complete KYC",
  rupifyRejected: "No worries! You can reapply for credit again after 90 days.",
  rupifyStatus: (statusText) => {
    try {
      let txt = statusText;
      let foo = txt.split("(");
      txt = foo[1];
      txt = txt.split(", ")[1];
      txt = txt.split("=")[1];
      return messages.approvedCredit(txt);
    } catch (error) {
      console.error(error);
      return statusText;
    }
  },
};