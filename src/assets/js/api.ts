import axios from 'axios'
import Vue from 'vue'
const bigao: any = axios.create({
  baseURL: '/api',
  timeout: 90000,
  headers: {
    'Authorization' : localStorage.getItem('token') || ''
  }
});

// 接口定义 axios二次封装
async function api({url, data, form = true, method = 'post',  headers, validateStatus = true}: ApiQuery): Promise<any> {
  try {
    const {data: result, status}: Response = await bigao({
      url,
      data,
      method,
      headers: headers ? headers : form ? {'Content-Type': 'application/x-www-form-urlencoded'} : {'Content-Type': 'application/json'},
      transformRequest: form ? [() => {
        let str = '';
        for (let key in data) {
          str += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
        }
        str = str.substring(0, str.length - 1);
        return str;
      }] : [],
      validateStatus(status: number): boolean {
        return status >= 200 && status <= 400;
      }
    });
    if ((validateStatus && !result.status) || !validateStatus || (result.status < 400)) {
      return Promise.resolve(result);
    } else {
      return Promise.reject(result.message || '网络开小差了，请重试~');
    }
  } catch (error) {
    return Promise.reject('网络开小差了，请重试~');
  }
}

function mountApi() {
  Vue.prototype.$api = api;
}

export {
  api,
  mountApi
}