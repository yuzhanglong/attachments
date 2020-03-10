class Questionnaire {
  constructor(json) {
    this.basicInfo = new QuestionnaireCondition(json['basicInfo']);
    this.problems = json['problems'];
  }
}


class QuestionnaireCondition {
  constructor(json) {
    this.condition = json['condition'];
    this.deadlineControl = json['deadlineControl'];
    this.equipmentControl = json['equipmentControl'];
    this.ipControl = json['ipControl'];
    this.isSecret = json['isSecret'];
    this.questionnireId = json['questionnireId'];
    this.renewTime = json['renewTime'];
    this.secretKey = json['secretKey'];
    this.subTitle = json['subTitle'];
    this.title = json['title'];
    this.wechatControl = json['wechatControl'];
    this.deadline = json['deadline'];
  }
}

export {
  QuestionnaireCondition,
  Questionnaire
}

/*
*   "condition": false,
    "deadline": "Mon, 27 Jan 2020 11:29:18 GMT",
    "deadlineControl": true,
    "equipmentControl": true,
    "information": "获取问卷状态成功",
    "ipControl": true,
    "isSecret": true,
    "questionnireId": 15837693799595368,
    "renewTime": "Mon, 09 Mar 2020 15:56:19 GMT",
    "secretKey": "333333",
    "status": "success",
    "subTitle": "副标题",
    "title": "个标题",
    "wechatControl": true
*
* */