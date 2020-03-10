import {request} from "../network/request";
import {Authentication} from "../models/response_model";

export function getQuesionnaire(qid) {
  return request({
    method: 'get',
    url: '/questionnaires/get_questionnire/' + qid,
    headers: {
      showLoading: true,
      showLoadingType: 0,
    },
    auth: {username: Authentication.getToken()}
  })
}

export function getQuesionnaireCondition(qid) {
  return request({
    method: 'get',
    url: 'questionnaires/get_condition/' + qid,
    headers: {
      showLoading: true,
      showLoadingType: 0,
    },
    auth: {username: Authentication.getToken()}
  })
}

export function editQuesitonnaire(data) {
  return request({
    method: 'post',
    url: 'questionnaires/edit',
    headers: {
      showLoading: true,
      showLoadingType: 0,
    },
    data: data,
    auth: {username: Authentication.getToken()}
  })
}

export function getAllQuestionnire() {
  return request({
    method: 'get',
    url: 'questionnaires/get_all_questionnire',
    headers: {
      showLoading: true,
      showLoadingType: 0,
    },
    auth: {username: Authentication.getToken()}
  })
}