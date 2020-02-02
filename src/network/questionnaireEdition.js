import {request} from "@/network/request";

//新建问卷
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


//编辑标题 副标题
export function editQuestionnaireBasicInfo(token, flag, basicInfo) {
  return request({
    method: 'post',
    url: '/questionnaire/edit/edit_questionniare_basic_info',
    data: {
      token: token,
      questionnaireFlag: flag,
      editConfig: {
        basicInfo: basicInfo,
      }
    }
  })
}

//添加一道题目
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

//删除一道题目
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

export function editProblemBasicInfo(token, flag, problemIndex, title, globalSetting) {
  return request({
    method: 'post',
    url: '/questionnaire/edit/edit_problem_basic_info',
    data: {
      token: token,
      questionnaireFlag: flag,
      editConfig: {
        problemIndex: problemIndex,
        title: title,
        globalSetting: globalSetting,
      }
    }
  })
}


//添加一个选项
export function appendOneOption(token, flag, problemIndex, optiondata) {
  return request({
    method: 'post',
    url: '/questionnaire/edit/append_one_option',
    data: {
      token: token,
      questionnaireFlag: flag,
      editConfig: {
        problemIndex: problemIndex,
        optionData: optiondata
      }
    }
  })
}

//删除一个选项
export function deleteOneOption(token, flag, problemIndex, optionIndex) {
  return request({
    method: 'post',
    url: '/questionnaire/edit/delete_one_option',
    data: {
      token: token,
      questionnaireFlag: flag,
      editConfig: {
        problemIndex: problemIndex,
        optionIndex: optionIndex
      }
    }
  })
}


export function editOptionValue(token, flag, problemIndex, optionIndex, value) {
  return request({
    method: 'post',
    url: '/questionnaire/edit/edit_option_value',
    data: {
      token: token,
      questionnaireFlag: flag,
      editConfig: {
        problemIndex: problemIndex,
        optionIndex: optionIndex,
        value: value
      }
    }
  })
}