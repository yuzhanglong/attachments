import { IncomingMessage, Server as HttpServer, ServerResponse } from 'http';
import { Server as HttpsServer } from 'https';
import { createSecureContext } from 'tls';
import * as compose from 'koa-compose';
import { Duplex } from 'stream';
import * as Buffer from 'buffer';
import * as net from 'net';
import { Socket } from 'net';
import { createProxyPassMiddleware } from './middlewares/proxy-pass-middleware';
import { CertificationManager } from './certification-manager';
import { LOCAL_HOST, PROXY_PASS_SERVICE_PORT, PROXY_SERVER_PORT } from './const';
import { createUrlMiddleWare } from './middlewares/url-middleware';
import { ProxyServerContext, RuleConfig } from './types';
import { createProxyRuleMiddleware } from './middlewares/proxy-rule-middleware';
import { RuleManager } from './rule-manager';
import { createUpgradeMiddleware } from './middlewares/upgrade-middleware';

export class ProxyServer {
  private proxyServer: HttpServer = new HttpServer();

  private httpsServer: HttpsServer = new HttpsServer();

  private ruleManager: RuleManager = new RuleManager();

  private certificationManager = new CertificationManager();

  /**
   * 初始化必要的服务
   *
   * @author yuzhanglong
   * @date 2021-08-11 00:48:00
   */
  async initServers() {
    const httpsServerCert = await this.certificationManager.createCertificationByDomain('localhost');

    this.proxyServer = new HttpServer();
    this.httpsServer = new HttpsServer({
      cert: httpsServerCert.cert,
      key: httpsServerCert.key,
      SNICallback: async (servername, callback) => {
        const { key, cert } = await this.certificationManager.createCertificationByDomain(servername);
        callback(null, createSecureContext({
          key: key,
          cert: cert,
        }));
      },
    });

    const handlers = compose<ProxyServerContext>([
      createUrlMiddleWare(),
      createProxyRuleMiddleware(this.ruleManager),
      createUpgradeMiddleware(),
      createProxyPassMiddleware(),
    ]);

    // 在收到 XHR 的代理请求时做些什么
    this.proxyServer.on('request', async (req: IncomingMessage, res: ServerResponse) => {
      await handlers({
        req: req,
        res: res,
        protocol: 'http',
      });
    });

    // 在收到通过 CONNECT 方法建立而来的隧道传来的数据后做些什么
    this.httpsServer.on('request', async (req: IncomingMessage, res: ServerResponse) => {
      await handlers({
        req: req,
        res: res,
        protocol: 'https',
      });
    });

    // 在收到 XHR CONNECT 请求时做些什么
    // 如果我们要代理的请求为 https 协议，如果将请求代理到本服务器，浏览器会发送一个 CONNECT 请求
    // 在 nodejs 的官方文档中提供了这样一个 DEMO：http://nodejs.cn/api/http.html#http_event_connect
    // 但是，这个 DEMO 中我们无法获取到相关的传输信息，并对信息作出定制化的修改，node 好像也没有给出相关的 API
    // 于是我们可以将这个请求转发到一个新的服务器上，然后让这个新的服务器去请求实际资源
    this.proxyServer.on('connect', (req: IncomingMessage, clientSocket: Duplex, head: Buffer) => {
      // 只有 https 请求走代理才会走到这一步，所以直接连接我们的 https 服务器就可以了
      const proxyPassServiceSocket = net.connect(PROXY_PASS_SERVICE_PORT, LOCAL_HOST, () => {

        clientSocket.write(`HTTP/${req.httpVersion} 200 OK\r\n\r\n`, 'utf-8', () => {
          proxyPassServiceSocket.write(head);
          proxyPassServiceSocket.pipe(clientSocket);
          clientSocket.pipe(proxyPassServiceSocket);
        });

        proxyPassServiceSocket.on('error', (e) => {
          console.log('error!');
          console.log(e);
        });
      });

      clientSocket.on('error', (e) => {
        console.log(e);
      });
    });

    // 在收到 http 升级请求时做些什么
    this.proxyServer.on('upgrade', async (req: IncomingMessage, socket: Socket, head: Buffer) => {
      await handlers({
        req: req,
        socket: socket,
        head: head,
        protocol: 'ws',
      });
    });

    // 在收到 https 升级请求时做些什么
    this.httpsServer.on('upgrade', async (req: IncomingMessage, socket: Socket, head: Buffer) => {
      await handlers({
        req: req,
        socket: socket,
        head: head,
        protocol: 'wss',
      });
    });
  }

  /**
   * 监听端口
   *
   * @author yuzhanglong
   * @date 2021-08-11 13:07:59
   */
  async listen() {
    if (!this.httpsServer || !this.proxyServer) {
      throw new Error('please init server!');
    }

    this.proxyServer.listen(PROXY_SERVER_PORT, LOCAL_HOST, () => {
      console.log('proxy server is running ...');
    });

    this.httpsServer.listen(PROXY_PASS_SERVICE_PORT, LOCAL_HOST, () => {
      console.log('https server is running...');
    });
  }

  /**
   * 增加代理规则
   *
   * @author yuzhanglong
   * @date 2021-08-09 00:11:39
   * @param domain
   * @param ruleConfig
   */
  addRule(domain: string, ...ruleConfig: RuleConfig[]) {
    this.ruleManager.addRule(domain, ...ruleConfig);
  }
}
