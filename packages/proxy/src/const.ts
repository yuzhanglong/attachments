/**
 * File: const.ts
 * Description: 实用常量
 * Created: 2021-08-10 23:40:48
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import * as path from 'path';

export const LOCAL_HOST = '127.0.0.1';

// 代理服务的端口
export const PROXY_SERVER_PORT = 8087;

// 负责转发服务的端口
export const PROXY_PASS_SERVICE_PORT = 8089;

export const pathCert = path.resolve(__dirname, '../certificate', 'yuzhanglong.pem');

export const pathCertKey = path.resolve(__dirname, '../certificate', 'yuzhanglong-key.pem');
