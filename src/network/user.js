import {request} from "@/network/request";

export function userLogin(userName, userPassword) {
  return request({
    method: 'post',
    url: '/users/login',
    data: {
      userName: userName,
      userPassword: userPassword,
    }
  })
}

export function userRegister(userName, userEmail, userPassword) {
  return request({
    method: 'post',
    url: '/users/register',
    data: {
      userName: userName,
      userEmail: userEmail,
      userPassword: userPassword,
    }
  })
}