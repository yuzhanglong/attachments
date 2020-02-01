import {request} from "@/network/request";

export function newQuestionnaire(userName, token, flag, basicData) {
  return request({
    method: 'post',
    url: '/questionnaire/new',
    data: {
      userName: userName,
      token: token,
      //确保问卷唯一性
      questionnaireFlag: flag,
      questionnaireBasicData: basicData
    }
  })
}

export function appendOneProblem(token, flag, common, id) {
  return request({
    method: 'post',
    url: '/questionnaire/edit/append_one_problem',
    data: {
      token: token,
      questionnaireFlag: flag,
      editConfig: {
        common: common,
        problemId: id
      }
    }
  })
}

export function deleteOneProblem(token, flag, problemIndex) {
  return request({
    method: 'post',
    url: '/questionnaire/edit/delete_one_problem',
    data: {
      token: token,
      questionnaireFlag: flag,
      editConfig: {
        problemIndex: problemIndex
      }
    }
  })
}
