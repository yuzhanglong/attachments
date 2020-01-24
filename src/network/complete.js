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