declare module 'vue-wechat-title'
declare module 'weixin-js-sdk'
interface Response {
  obj?: any;
  readonly status: number;
  readonly message: string;
  [propName: string]: any;
}

interface ApiQuery {
  url: string;
  data?: any;
  form?: boolean;
  headers?: any;
  method?: string;
  validateStatus?: boolean;
}

declare namespace Android {
}

declare namespace AMap {
  interface Query {
    city: string;
    outPutDirAuto: boolean;
    citylimit: boolean;
    [propName: string]: any;
  }
  function plugin(a: string, b: () => void): void;
  class Autocomplete {
    constructor(data: Query);
  }
  class Geocoder {
    constructor();
  }
}
