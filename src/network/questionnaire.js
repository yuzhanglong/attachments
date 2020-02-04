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

export function getQuestionnaireTemplates(page) {
  return request({
    method: 'get',
    url: '/questionnaire/get_templates',
    params: {
      page: page
    }
  })
}


export function copyTemplates(userName, token, targetFlag) {
  return request({
    method: 'post',
    url: '/questionnaire/copy_templates',
    data: {
      user: userName,
      token: token,
      flag: targetFlag,
    },
    headers: {
      showLoading: true,
      showLoadingType: 0
    }
  })
}

