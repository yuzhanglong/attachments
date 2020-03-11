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
    this.questionnaireId = json['questionnaireId'];
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