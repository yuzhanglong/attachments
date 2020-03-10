class Questionnaire{
  constructor(json) {
    this.basicInfo = json['basicInfo'];
    this.problems = json['problems'];
  }
}

export {
  Questionnaire
}