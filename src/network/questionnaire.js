import {request} from "../network/request";
import {Authentication} from "../models/response_model";

export function getQuesionnaire(qid) {
  return request({
    method: 'get',
    url: '/questionnaires/get_questionnaire/' + qid,
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

export function getAllQuestionnaire() {
  return request({
    method: 'get',
    url: 'questionnaires/get_all_questionnaire',
    headers: {
      showLoading: true,
      showLoadingType: 0,
    },
    auth: {username: Authentication.getToken()}
  })
}


export function deleteQuestionnaire(qid) {
  return request({
    method: 'post',
    url: 'questionnaires/delete',
    headers: {
      showLoading: true,
      showLoadingType: 0,
    },
    data: {
      "questionnaireId": qid
    },
    auth: {username: Authentication.getToken()}
  })
}


export function getTemplates(page) {
  return request({
    method: 'get',
    url: 'questionnaires/get_templates',
    headers: {
      showLoading: true,
      showLoadingType: 0,
    },
    params: {
      page: page
    },
    auth: {username: Authentication.getToken()}
  })
}


export function copyTemplates(tid) {
  return request({
    method: 'post',
    url: 'questionnaires/copy_templates',
    headers: {
      showLoading: true,
      showLoadingType: 0,
    },
    data: {
      templateId: tid
    },
    auth: {username: Authentication.getToken()}
  })
}