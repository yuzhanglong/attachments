class Analysis {
  constructor(json) {
    this.resolution = [];
    this.type = json['type'];
    this.title = json['title'];
    if (this.type !== "BLANK_FILL") {
      for (let i = 0; i < json['resolution'].length; i++) {
        this.resolution.push(new Resolution(json['resolution'][i]));
      }

    } else {
      this.resolution = json['resolution'];
    }

    // 目标问题标题
    this.problemTitle = json['title'];
  }
}


class Resolution {
  constructor(json) {
    this.optionTitle = json['optionId'];
    this.resolution = json['resolution'] ? json['resolution'] : 0;
    this.title = json['title'];
  }
}


class BasicInfo {
  constructor(json) {
    this.title = json['title'];
    this.renewTime = json['renewTime'];
    this.totalComplete = json['totalComplete'];
  }
}


export {
  Resolution,
  Analysis,
  BasicInfo
}