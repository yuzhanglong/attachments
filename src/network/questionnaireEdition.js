import {request} from '../network/request';
import {Authentication} from "../models/response_model";

//新建问卷
export function createQuestionnaire() {
  return request({
    method: 'get',
    url: '/questionnaires/create',
    headers: {
      showLoading: true,
      showLoadingType: 0
    },
    auth: {username: Authentication.getToken()}
  })
}


//编辑标题 副标题
export function editQuestionnaireBasicInfo(infoForm) {
  return request({
    method: 'post',
    url: '/questionnaires/edit',
    data: infoForm,
    headers: {
      showLoading: true,
      showLoadingType: 1
    },
    auth: {username: Authentication.getToken()}
  })
}

//添加一道题目
export function appendOneProblem(problemData) {
  return request({
    method: 'post',
    url: '/questionnaires/append_one_problem',
    data: problemData,
    headers: {
      showLoading: true,
      showLoadingType: 1
    },
    auth: {username: Authentication.getToken()}
  })
}

export function editOneProblem(problemInfo) {
  return request({
    method: 'post',
    url: '/questionnaires/edit_one_problem',
    data: problemInfo,
    headers: {
      showLoading: true,
      showLoadingType: 1
    },
    auth: {username: Authentication.getToken()}
  })
}


//删除一道题目
export function deleteOneProblem(problemId) {
  return request({
    method: 'post',
    url: '/questionnaires/delete_one_problem',
    data: {
      problemId: problemId
    },
    headers: {
      showLoading: true,
      showLoadingType: 1
    },
    auth: {username: Authentication.getToken()}
  })
}