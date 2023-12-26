import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { zoho, apis } from './constants';


interface RequestOptions {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  baseURL: string;
  endpoint: string;
  params: any;
}

interface ItemDetails {
  code: string;
  name: string;
}

interface TokenParamsRefreshToken {
  grant_type: string;
  refresh_token: string;
  client_id: string;
  client_secret: string;
}

interface LineItem {
  item_id: string;
  name: string;
  description: string;
  rate: number;
  quantity: number;
  unit: string;
  tax_name: string;
  tax_type: string;
  tax_percentage: number;
  item_total: number;
}


export interface ZohoContact {
  contact_name?: string;
  company_name?: string;
  payment_terms?: number;
  currency_id?: string;
  website?: string;
  contact_type?: string;
  custom_fields?: Array<{ value: string; index: number }>;
  billing_address?: object;
  shipping_address?: object;
  contact_persons?: object;
  default_templates?: object;
  language_code?: string;
  notes?: string;
  vat_reg_no?: string;
  tax_reg_no?: string;
  country_code?: string;
  vat_treatment?: string;
  tax_treatment?: string;
  tax_regime?: string;
  is_tds_registered?: boolean;
  avatax_exempt_no?: string;
  avatax_use_code?: string;
  tax_exemption_id?: string;
  tax_authority_id?: string;
  tax_id?: boolean;
  is_taxable?: boolean;
  facebook?: string;
  twitter?: string;
  place_of_contact?: string;
  gst_no?: string;
  gst_treatment?: string;
  tax_authority_name?: string;
  tax_exemption_code?: string;
  fssai?: string;
}

export class ZohoHelper {
  constructor() { }
  generateAccessToken = async (options?: RequestOptions): Promise<AxiosResponse<any>> => {
    try {
      options = options || this.optionsRefresh;
      const response = await axios({
        method: options.method,
        url: options.baseURL + options.endpoint,
        params: options.params
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  };

  tokenParamsRefresh: TokenParamsRefreshToken = {
    grant_type: 'refresh_token',
    refresh_token: process.env.REFRESH_TOKEN,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  }

  optionsRefresh: RequestOptions = {
    method: 'POST',
    baseURL: zoho.BASE_URL,
    endpoint: zoho.TOKEN_ENDPOINT,
    params: this.tokenParamsRefresh
  };

  private async getAuthHeaders() {
    const tokenData = await this.generateAccessToken(this.optionsRefresh);
    return {
      'Authorization': `Zoho-oauthtoken ${tokenData.data.access_token}`,
      'content-type': 'application/json',
      Accept: "application/json",
    };
  }

  async getTaxes(): Promise<{ code: number, message: string, taxes: { tax_id: number, tax_percentage: number }[], page_context: any }> {
    try {
      const tokenData = await this.generateAccessToken(this.optionsRefresh);
      const config = {
        url: `${zoho.BASE_URL_API}/${zoho.TAXES_ENDPOINT}`,
        headers: {
          'Authorization': `Zoho-oauthtoken ${tokenData.data.access_token}`,
        },
      };
      const response: AxiosResponse = await axios.get(config.url, { headers: config.headers });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error occurred: ${error}`);
    }
  }

  async postInventoryItem(item: any): Promise<AxiosResponse> {
    const url = `${zoho.BASE_URL_API}/${zoho.PRODUCT_ENDPOINT}`;
    const tokenData = await this.generateAccessToken(this.optionsRefresh);
    console.log(">>>>>", tokenData);
    const headers = {
      'Authorization': `Zoho-oauthtoken ${tokenData.data.access_token}`,
      'content-type': 'application/json'
    }
    const response = await axios.post(url, JSON.stringify(item), { headers });
    return response;
  }

  async getItemDetailsAtWarehouseLevel(organizationID: string, itemIDs: string[]): Promise<ItemDetails[]> {
    try {
      const tokenData = await this.generateAccessToken(this.optionsRefresh);

      const url = `https://inventory.zoho.in/api/v1/itemdetails`; // This matches your Postman request

      const response: AxiosResponse<ItemDetails[]> = await axios.get(url, {
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

    } catch (error) {
      return [];
    }
  }

  async incrementSalesOrderNumber(salesOrderNumber) {
    const prefix = salesOrderNumber.match(/[^\d]+/)[0]; // Extracts non-numeric prefix (e.g., "SO-")
    const numberPart = salesOrderNumber.match(/\d+/)[0]; // Extracts numeric part

    // Convert to integer, increment, and convert back to string
    const incrementedNumber = (parseInt(numberPart, 10) + 1).toString();

    // Pad with leading zeros if necessary
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

  async createSalesOrder(lineItems: LineItem[], salesorder_number, outlet_id): Promise<any> {
    const url = 'https://www.zohoapis.in/inventory/v1/salesorders?organization_id=60020954918';
    const tokenData = await this.generateAccessToken(this.optionsRefresh);
    const newSalesOrderNumber = await this.incrementSalesOrderNumber(salesorder_number[0].zoho_salesorder_number);
    console.log(newSalesOrderNumber); // Outputs: SO-00005
    const headers = {
      'Authorization': `Zoho-oauthtoken ${tokenData.data.access_token}`,
      'content-type': 'application/json'
    }

    const data = {
      "customer_id": BigInt(outlet_id),
      "salesorder_number": `${newSalesOrderNumber}`,
      "date": new Date().toISOString().split('T')[0],
      "shipment_date": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      "line_items": lineItems,
      "notes": "Sample Note",
      "terms": "Terms and Conditions" // ankit
    };
    // Use this function for serialization
    const jsonData = await this.serializeBigInt(data);
    console.log("line 220", data, jsonData);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error making API request:', error);
    }
  }

  async getInvoice(invoiceId) {
    let result = await axios.get(apis.fetchInvoice(invoiceId), { headers: await this.getAuthHeaders() });
    return result.data.invoice;
  }

  async createZohoContact(contactData: ZohoContact): Promise<any> {
    const url = 'https://www.zohoapis.in/inventory/v1/contacts?organization_id=60020954918'
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
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  }
}


// NOTE: do not remove

// const generateToken = async (options: RequestOptions): Promise<AxiosResponse<any>> => {
//   try {
//     const response = await axios({
//       method: options.method,
//       url: options.baseURL + options.endpoint,
//       params: options.params
//     });
//     return response;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const tokenParams: TokenParams = {
//   grant_type: 'authorization_code',
//   code: '1000.85bcf08a1f629c9fef9dc0e71ff48290.fd361d21c46a368e15a24dc51f6af7a4',
//   client_id: '1000.N3PEMXU36I7YKQ60HOLCZS8H66RI5P',
//   client_secret: '2d6c6aa4463f6138f58540a57d2b2bf1cd4aa5eed3'
// }

// interface TokenParams {
//   grant_type: string;
//   code: string;
//   client_id: string;
//   client_secret: string;
// }

// const options: RequestOptions = {
//   method: 'POST',
//   baseURL: 'https://accounts.zoho.in',
//   endpoint: '/oauth/v2/token',
//   params: tokenParams
// };





