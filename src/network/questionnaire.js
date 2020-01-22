import {request} from "@/network/request";

export function sendQuesionNaire(userName, questionnaireData, token, questionnaireFlag) {
  return request({
    method: 'post',
    url: '/questionnaire/send_data',
    data: {
      userName: userName,
      questionnaireData: questionnaireData,
      token: token,
      //确保问卷唯一性
      questionnaireFlag: questionnaireFlag
    }
  })
}

export function getQuesionNaire(userName, token) {
  return request({
    method: 'post',
    url: '/questionnaire/get_data',
    data: {
      userName: userName,
      token: token,
    }
  })
}

export function getQuesionNaireByFlag(userName, token, flag) {
  return request({
    method: 'post',
    url: '/questionnaire/get_data_by_flag',
    data: {
      userName: userName,
      token: token,
      flag: flag
    }
  })
}

export function deleteQuesionNaire(userName, token, flag) {
  return request({
    method: 'post',
    url: '/questionnaire/delete',
    data: {
      userName: userName,
      token: token,
      flag: flag
    }
  })
}