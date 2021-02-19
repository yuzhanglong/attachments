/*
 * File: decorators.ts
 * Description: 装饰器模块
 * Created: 2021-2-19 20:55:04
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import 'reflect-metadata'

export const Command = (command: string) => {
  console.log(command)
  return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
    console.log(target)
    console.log(key)
    console.log(descriptor)
  }
}

export const SerendipityPlugin = <T>(name: string) => {
  console.log(name)
  return (target: T) => {
    const paramtypes = Reflect.getMetadata('design:paramtypes', target)
    console.log('传递给类A的构造函数的参数类型数组', paramtypes)
  }
}