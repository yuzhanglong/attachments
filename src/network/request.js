import axios from 'axios'
import {hideLoading, showLoading} from "../utils/loading";
import {SERVER_BASE_URL} from "../config/baseConfig";

export function request(config) {
  const instance = axios.create({
    baseURL: SERVER_BASE_URL,
    timeout: 5000,
  });
  // 添加请求拦截器
  instance.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    if (config.headers.showLoading) {
      showLoading(config.headers.showLoadingType);
    }
    return config;
  }, error => {
    // 对请求错误做些什么
    //防止请求过快loading一闪而过或者根本没有 增加微小的延迟
    setTimeout(() => {
      hideLoading();
    }, 300);
    return error;
  });

  // 添加响应拦截器
  instance.interceptors.response.use(response => {
    // 对响应数据做点什么
    setTimeout(() => {
      hideLoading();
    }, 300);
    return response.data;
  }, error => {
    // 对响应错误做点什么
    setTimeout(() => {
      hideLoading();
    }, 300);
    return Promise.reject(error.response.data);
  });
  return instance(config);
}