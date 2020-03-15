class ErrorResponse {

  constructor(json) {
    this.information = json['information'];
    this.status = json['status'];
  }
}


class Authentication {
  constructor(json) {
    this.information = json['information'];
    this.token = json['token'];
  }


  saveToken() {
    window.localStorage.setItem("token", this.token);
  }

  static removeToken() {
    window.localStorage.removeItem("token");
  }

  static getToken() {
    return window.localStorage.getItem("token");
  }
}


export {
  ErrorResponse,
  Authentication
}
