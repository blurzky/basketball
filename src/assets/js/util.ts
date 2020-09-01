import Vue from 'vue'
import store from '@/store'
import {api} from './api'
import wx from 'weixin-js-sdk'

interface Ck {
  (bridge: any): void;
}
declare let window: Window & {
  WebViewJavascriptBridge: any;
  WVJBCallbacks: any;
}

// 设置文件名称
function setFileName(type: string): string {
  let fileName: string = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}/`;
  // 拼接年月日
  function setRS(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  fileName += `${setRS()}${setRS()}-${setRS()}-${setRS()}-${setRS()}-${setRS()}${setRS()}${setRS()}.${type.substring(6)}`;
  return fileName;
}

// WebViewJavascriptBridge
function setupWebViewJavascriptBridge(ck: Ck): void {
  if (window.WebViewJavascriptBridge) {
    return ck(window.WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(ck);
  }
  window.WVJBCallbacks = [ck];
  let iframe: any = document.createElement('iframe');
  iframe.style.display ='none';
  iframe.src ='wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(iframe);
  setTimeout(() => {
    document.documentElement.removeChild(iframe);
  }, 0);
}

// js调用app
function callHandler(name: string, data: any, ck: (e?: any, ...rest: any[]) => void): void {
  setupWebViewJavascriptBridge(bridge => {
    bridge.callHandler(name, data, ck);
  })
}

// APP调用js
function registerHandler(name: string, ck: (e?: any, ...rest: any[]) => void): void {
  setupWebViewJavascriptBridge(bridge => {
    bridge.registerHandler(name, ck);
  })
}
// 微信检测Api
function wxCheck() {
  return new Promise((resolve, reject) => {
    const data = { url : window.location.href};
    api({ url: '/beeagleUsers/wjcode', data }).then(res => {
      const [{
        timestamp,
        nonceStr,
        signature
      }, jsApiList]: any[] = [res, [
        'checkJsApi',
        'updateTimelineShareData',
        'updateAppMessageShareData'
      ]];
      wx.config({
        debug: false,
        appId: 'wx0e734c0a8f759921',
        timestamp,
        nonceStr,
        signature,
        jsApiList
      });
      wx.ready(() => {
        jsApiList.shift();
        wx.checkJsApi({
          jsApiList,
          success: () => {
            resolve();
          },
          fail: () => {
            reject();
          }
        });
      });
      wx.error(() => {
        reject();
      });
    }).catch(() => {
      reject();
    })
  })
}
// 微信分享接口
function wxShare({title, desc, link, imgUrl}: any) {
  wxCheck().then(() => {
    wx.updateTimelineShareData({
      title,
      link,
      imgUrl
    });
    wx.updateAppMessageShareData({
      title,
      desc,
      link,
      imgUrl
    });
  }).catch(() => {
    console.log('网络错误');
  });
}

export default function() {
  Vue.prototype.$wxShare = wxShare;
  Vue.prototype.$callHandler = callHandler;
  Vue.prototype.$registerHandler = registerHandler;
}
