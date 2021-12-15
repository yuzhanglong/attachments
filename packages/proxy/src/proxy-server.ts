import { IncomingMessage, Server as HttpServer, ServerResponse } from 'http';
import { Server as HttpsServer } from 'https';
import { createSecureContext } from 'tls';
import compose from 'koa-compose';
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
import { divideConnectMethodReqUrl } from './utils';

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
    // 证书和 server 初始化
    const httpsServerCert = await this.certificationManager.createCertificationByDomain('localhost');

    this.proxyServer = new HttpServer();
    this.httpsServer = new HttpsServer({
      cert: httpsServerCert.cert,
      key: httpsServerCert.key,
      SNICallback: async (servername, callback) => {
        const { key, cert } = await this.certificationManager.createCertificationByDomain(servername);
        callback(
          null,
          createSecureContext({
            key: key,
            cert: cert,
          })
        );
      },
    });

    // compose 中间件
    const handlers = compose<ProxyServerContext>([
      createUrlMiddleWare(),
      createProxyRuleMiddleware(this.ruleManager),
      createUpgradeMiddleware(),
      createProxyPassMiddleware(),
    ]);

    // 在收到 XHR 的代理请求时做些什么
    this.proxyServer.on('request', async (req: IncomingMessage, res: ServerResponse) => {
      await handlers({
        incomingRequestData: req,
        proxyServerResponse: res,
        protocol: 'http',
      });
    });

    // 在收到通过 CONNECT 方法建立而来的隧道传来的数据后做些什么
    this.httpsServer.on('request', async (req: IncomingMessage, res: ServerResponse) => {
      await handlers({
        incomingRequestData: req,
        proxyServerResponse: res,
        protocol: 'https',
      });
    });

    // 在收到 HTTP CONNECT 请求时做些什么
    // 如果我们要代理的请求为 https 协议，如果将请求代理到本服务器，浏览器会发送一个 CONNECT 请求，建立双向隧道
    // 在 nodejs 的官方文档中提供了这样一个 DEMO：http://nodejs.cn/api/http.html#http_event_connect
    // 于是我们可以将这个请求转发到一个新的服务器上，然后让这个新的服务器去请求实际资源
    this.proxyServer.on('connect', (req: IncomingMessage, clientSocket: Duplex, head: Buffer) => {
      // 只有 https 请求走代理才会走到这一步，所以直接连接我们的 https 服务器就可以了
      const { domain, port } = divideConnectMethodReqUrl(req.url);

      // 是否匹配用户配置的域名, 如果不匹配我们不用走 proxy 服务器，这样一是可以优化性能
      // 二是防止某些服务器使用了 TLS Pinning 技术，会对证书的摘要进行验证
      const isProxyMatched = this.ruleManager.matchDomain(domain);

      const finalDomain = isProxyMatched ? LOCAL_HOST : domain;
      const finalPort = isProxyMatched ? PROXY_PASS_SERVICE_PORT : port;

      const proxyPassServiceSocket = net.connect(finalPort, finalDomain, () => {
        clientSocket.write(`HTTP/${req.httpVersion} 200 OK\r\n\r\n`, 'utf-8', () => {
          // 隧道流的第一个数据包（可能为空）
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
        incomingRequestData: req,
        socketBetweenClientAndProxyServer: socket,
        head: head,
        protocol: 'ws',
      });
    });

    // 在收到 https 升级请求时做些什么
    this.httpsServer.on('upgrade', async (req: IncomingMessage, socket: Socket, head: Buffer) => {
      await handlers({
        incomingRequestData: req,
        socketBetweenClientAndProxyServer: socket,
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
      throw new Error('[@attachments/proxy] please init server!');
    }

    this.proxyServer.listen(PROXY_SERVER_PORT, LOCAL_HOST, () => {
      console.log('[@attachments/proxy] proxy server is running...');
    });

    this.httpsServer.listen(PROXY_PASS_SERVICE_PORT, LOCAL_HOST, () => {
      console.log('[@attachments/proxy] https server is running...');
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

  /**
   * 清除所有的代理规则
   *
   * @author yuzhanglong
   * @date 2021-12-16 00:12:46
   */
  clearRules() {
    this.ruleManager.clear();
  }
}
