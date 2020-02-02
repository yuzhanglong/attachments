import {request} from "@/network/request";


export function getQuesionNaire(userName, token) {
  return request({
    method: 'post',
    url: '/questionnaire/get_data',
    data: {
      userName: userName,
      token: token,
    },
    headers: {
      showLoading: true,
      showLoadingType: 0
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

export function submitQuestionnaireSpreadData(userName, token, flag, dataDict) {
  return request({
    method: 'post',
    url: '/questionnaire/spread',
    data: {
      userName: userName,
      token: token,
      flag: flag,
      dataDict: dataDict,
    }
  })
}

