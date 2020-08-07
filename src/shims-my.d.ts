declare module 'vue-wechat-title'

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
  headers?: string;
  method?: string;
  validateStatus?: boolean;
}

declare namespace OSS {
  interface ActualQuery {
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
  }
  interface Query {
    accessKeyId: string;
    accessKeySecret: string;
    stsToken: string;
    secure: boolean;
    endpoint: string;
    bucket: string;
  }
  class Wrapper {
    constructor(data: Query);
    private multipartUpload(fileName: string, file: File): any;
  }
}

declare namespace Android {
  function goBack(): void;
  function OpenKeFu(): void;
  function shareShop(): void;
  function callPhone(phone: string): void;
  function orderRoute(): void;
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
