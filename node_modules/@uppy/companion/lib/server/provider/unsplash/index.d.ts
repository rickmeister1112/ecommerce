export = Unsplash;
/**
 * Adapter for API https://api.unsplash.com
 */
declare class Unsplash extends Provider {
    list({ token, query }: {
        token: any;
        query?: {
            cursor: any;
            q: any;
        };
    }): Promise<any>;
    download({ id, token }: {
        id: any;
        token: any;
    }): Promise<any>;
    size({ id, token }: {
        id: any;
        token: any;
    }): Promise<any>;
    #private;
}
import Provider = require("../Provider");
