import {request} from "../network/request";

export function getCondition(flag) {
  return request({
    method: 'get',
    url: '/completes/get_condition/' + flag,
  })
}

export function checkSecretKey(flag, key) {
  return request({
    method: 'post',
    url: '/completes/check_key/' + flag,
    data: {
      secretKey: key !== null ? key : "key"
    }
  })
}

export function submitComplete(data, flag) {
  let myDate = new Date();
  return request({
    method: 'post',
    url: '/completes/submit_data/' + flag,
    data: {
      completeData: data,
      submitTime: myDate.getTime()
    }
  })
}


