import {request} from "@/network/request";

export function sendQuesionNaire(userName, questionnaireData, token, questionnaireFlag) {
  return request({
    method: 'post',
    url: '/questionnaire/data',
    data: {
      userName: userName,
      questionnaireData: questionnaireData,
      token: token,
      //确保问卷唯一性
      questionnaireFlag: questionnaireFlag
    }
  })
}