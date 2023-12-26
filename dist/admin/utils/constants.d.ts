export declare const zoho: {
    BASE_URL: string;
    BASE_URL_API: string;
    BASE_URL_API_2: string;
    INVENTORY_ENDPOINT: string;
    TOKEN_ENDPOINT: string;
    TAXES_ENDPOINT: string;
    PRODUCT_ENDPOINT: string;
};
export declare const apis: {
    newPayment: (...params: any[]) => string;
    salesOrder: (...params: any[]) => string;
    createPaymentLink: (...params: any[]) => string;
    fetchPaymentLink: (...params: any[]) => string;
    zohoOauthToken: (...params: any[]) => string;
    zohoAnalyticsExport: (...params: any[]) => string;
    bnplCustomerInfo: (...params: any[]) => string;
    bnplShareGMV: (...params: any[]) => string;
    bnplPaymentOrder: (...params: any[]) => string;
    bnplGetPaymentOrder: (...params: any[]) => string;
    bnplCompletePayment: (...params: any[]) => string;
    fetchInvoice: (...params: any[]) => string;
    bnplRefundOrder: (...params: any[]) => string;
    bnplRefundPayment: (...params: any[]) => string;
    bnplFetchPayment: (...params: any[]) => string;
    recordPayment: (...params: any[]) => string;
    bnplAccountStatement: (...params: any[]) => string;
    getCustomer: (...params: any[]) => string;
    createZohoOrder: (...params: any[]) => string;
    getZohoPaymentStatus: (...params: any[]) => string;
    getCategoriesList: (...params: any[]) => string;
    getColsOrCats: (...params: any[]) => string;
    getItem: (...params: any[]) => string;
    getItemCustomPrices: (...params: any[]) => string;
};
export declare const defaults: {
    bnplQualifyDuration: number;
};
export declare const genHeaders: {
    "Content-Type": string;
    Accept: string;
};
export declare const cashfree: {
    authHeaders: {
        "Content-Type": string;
        Accept: string;
        "x-api-version": string;
        "x-client-id": string;
        "x-client-secret": string;
    };
};
export declare const rupify: {
    authHeaders: {
        "Content-Type": string;
        Accept: string;
        "x-rpf-key": string;
    };
};
export declare const messages: {
    noFirstOrder: string;
    beforeQualify: (...params: any[]) => string;
    approvedCredit: (...params: any[]) => string;
    creditValue: (...params: any[]) => string;
    notOnboarded: string;
    rupifyRejected: string;
    rupifyStatus: (statusText: any) => any;
};
