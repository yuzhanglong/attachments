import { IncomingMessage, Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { Duplex } from 'stream';
import * as Buffer from 'buffer';
import { URL } from 'url';
import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';

const crt = fs.readFileSync(path.resolve(process.cwd(), 'certificate', 'localhost.pem')).toString();
const key = fs.readFileSync(path.resolve(process.cwd(), 'certificate', 'localhost-key.pem')).toString();

export class ProxyServer {
  private httpServer: HttpServer = new HttpServer();
  private httpsServer: HttpsServer = new HttpsServer({
    cert: crt,
    key: key,
  });

  private mapRules = new Map<string, string>();

  listen() {
    this.httpServer.on('request', (req, res) => {
      console.log(req);
      res.end('hello http!')
    });

    this.httpsServer.on('request', (req, res) => {
      console.log(req);
      res.end('hello https!')
    });

    // 代理的核心是中间人攻击
    this.httpServer.on('connect', (req: IncomingMessage, clientSocket: Duplex, head: Buffer) => {
      const { port, hostname } = new URL(`http://${req.url}`);
      const intPort = parseInt(port, 10) === 443 ? 8089 : 8088;

      clientSocket.on('error', (e) => {
        console.log(e);
      });


      const serverSocket = net.connect(intPort, '127.0.0.1', () => {
        clientSocket.write(`HTTP/${req.httpVersion} 200 OK\r\n\r\n`, 'utf-8', () => {
          serverSocket.write(head);
          serverSocket.pipe(clientSocket);
          clientSocket.pipe(serverSocket);
        });

        serverSocket.on('error', (e) => {
          console.log('error!');
          console.log(e);
        });
      });
    });

    this.httpServer.listen(8088, '0.0.0.0', () => {
      console.log('http server is running on port 8088...');
    });

    this.httpsServer.listen(8089, '0.0.0.0', () => {
      console.log('http server is running on port 8089...');
    });
  }

  /**
   * 增加代理规则
   *
   * @author yuzhanglong
   * @date 2021-08-09 00:11:39
   * @param from 源地址
   * @param target 目标规则
   */
  addRule(from: string, target: string) {
    if (!this.mapRules.has(from)) {
      this.mapRules.set(from, target);
    }
  }
}

const server = new ProxyServer();

server.listen();
