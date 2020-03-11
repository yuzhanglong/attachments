import {request} from "../network/request";
import {Authentication} from "../models/response_model";


// 拉取分析数据
export function getAnalysisData(flag) {
  return request({
    method: 'get',
    url: '/analysis/' + flag,
    headers: {
      showLoading: true,
      showLoadingType: 0
    },
    auth: {username: Authentication.getToken()}
  })
}