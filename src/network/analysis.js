import {request} from "@/network/request";

export function getAnalysisData(flag, token) {
  return request({
    method: 'post',
    url: '/analysis/get_result/' + flag,
    data: {
      token: token
    },
    headers: {
      showLoading: true,
      showLoadingType: 0
    }
  })
}