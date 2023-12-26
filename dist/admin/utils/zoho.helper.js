"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZohoHelper = void 0;
const axios_1 = require("axios");
const constants_1 = require("./constants");
class ZohoHelper {
    constructor() {
        this.generateAccessToken = async (options) => {
            try {
                options = options || this.optionsRefresh;
                const response = await (0, axios_1.default)({
                    method: options.method,
                    url: options.baseURL + options.endpoint,
                    params: options.params
                });
                return response;
            }
            catch (error) {
                throw new Error(error);
            }
        };
        this.tokenParamsRefresh = {
            grant_type: 'refresh_token',
            refresh_token: process.env.REFRESH_TOKEN,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        };
        this.optionsRefresh = {
            method: 'POST',
            baseURL: constants_1.zoho.BASE_URL,
            endpoint: constants_1.zoho.TOKEN_ENDPOINT,
            params: this.tokenParamsRefresh
        };
    }
    async getAuthHeaders() {
        const tokenData = await this.generateAccessToken(this.optionsRefresh);
        return {
            'Authorization': `Zoho-oauthtoken ${tokenData.data.access_token}`,
            'content-type': 'application/json',
            Accept: "application/json",
        };
    }
    async getTaxes() {
        try {
            const tokenData = await this.generateAccessToken(this.optionsRefresh);
            const config = {
                url: `${constants_1.zoho.BASE_URL_API}/${constants_1.zoho.TAXES_ENDPOINT}`,
                headers: {
                    'Authorization': `Zoho-oauthtoken ${tokenData.data.access_token}`,
                },
            };
            const response = await axios_1.default.get(config.url, { headers: config.headers });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(`Error occurred: ${error}`);
        }
    }
    async postInventoryItem(item) {
        const url = `${constants_1.zoho.BASE_URL_API}/${constants_1.zoho.PRODUCT_ENDPOINT}`;
        const tokenData = await this.generateAccessToken(this.optionsRefresh);
        console.log(">>>>>", tokenData);
        const headers = {
            'Authorization': `Zoho-oauthtoken ${tokenData.data.access_token}`,
            'content-type': 'application/json'
        };
        const response = await axios_1.default.post(url, JSON.stringify(item), { headers });
        return response;
    }
    async getItemDetailsAtWarehouseLevel(organizationID, itemIDs) {
        try {
            const tokenData = await this.generateAccessToken(this.optionsRefresh);
            const url = `https://inventory.zoho.in/api/v1/itemdetails`;
            const response = await axios_1.default.get(url, {
                params: {
                    item_ids: itemIDs.join(','),
                    organization_id: organizationID
                },
                headers: {
                    'Authorization': `Zoho-oauthtoken ${tokenData.data.access_token}`,
                    'content-type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            return [];
        }
    }
    async incrementSalesOrderNumber(salesOrderNumber) {
        const prefix = salesOrderNumber.match(/[^\d]+/)[0];
        const numberPart = salesOrderNumber.match(/\d+/)[0];
        const incrementedNumber = (parseInt(numberPart, 10) + 1).toString();
        const paddedNumber = incrementedNumber.padStart(numberPart.length, '0');
        return prefix + paddedNumber;
    }
    async serializeBigInt(data) {
        for (let key in data) {
            if (typeof data[key] === 'bigint') {
                data[key] = data[key].toString();
            }
        }
        return JSON.stringify(data);
    }
    async createSalesOrder(lineItems, salesorder_number, outlet_id) {
        const url = 'https://www.zohoapis.in/inventory/v1/salesorders?organization_id=60020954918';
        const tokenData = await this.generateAccessToken(this.optionsRefresh);
        const newSalesOrderNumber = await this.incrementSalesOrderNumber(salesorder_number[0].zoho_salesorder_number);
        console.log(newSalesOrderNumber);
        const headers = {
            'Authorization': `Zoho-oauthtoken ${tokenData.data.access_token}`,
            'content-type': 'application/json'
        };
        const data = {
            "customer_id": BigInt(outlet_id),
            "salesorder_number": `${newSalesOrderNumber}`,
            "date": new Date().toISOString().split('T')[0],
            "shipment_date": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
            "line_items": lineItems,
            "notes": "Sample Note",
            "terms": "Terms and Conditions"
        };
        const jsonData = await this.serializeBigInt(data);
        console.log("line 220", data, jsonData);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            return await response.json();
        }
        catch (error) {
            console.error('Error making API request:', error);
        }
    }
    async getInvoice(invoiceId) {
        let result = await axios_1.default.get(constants_1.apis.fetchInvoice(invoiceId), { headers: await this.getAuthHeaders() });
        return result.data.invoice;
    }
    async createZohoContact(contactData) {
        const url = 'https://www.zohoapis.in/inventory/v1/contacts?organization_id=60020954918';
        const tokenData = await this.generateAccessToken(this.optionsRefresh);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${tokenData.data.access_token}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify(contactData)
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const responseData = await response.json();
            return responseData;
        }
        catch (error) {
            console.error('Error creating contact:', error);
        }
    }
}
exports.ZohoHelper = ZohoHelper;
//# sourceMappingURL=zoho.helper.js.map