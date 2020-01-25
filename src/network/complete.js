import {request} from "@/network/request";

export function getCondition(flag) {
  return request({
    method: 'get',
    url: '/complete/get_condition/' + flag,
  })
}

export function getProblems(flag) {
  return request({
    method: 'get',
    url: '/complete/get_problems/' + flag,
  })
}

export function checkSecretKey(flag, key) {
  return request({
    method: 'post',
    url: '/complete/check_key/' + flag,
    data: {
      key: key
    }
  })
}

export function submitComplete(data, flag) {
  return request({
    method: 'post',
    url: '/complete/submit_data',
    data: {
      flag:flag,
      completeData: data
    }
  })
}
