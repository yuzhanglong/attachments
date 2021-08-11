import { CertificateCreationOptions, CertificateCreationResult, createCertificate } from 'pem';
import * as fs from 'fs';
import { pathCert, pathCertKey } from './const';


interface Certification {
  key: string;
  cert: string;
}

export class CertificationManager {
  private rootCertification: Certification;

  /**
   * 创建 CA 证书
   *
   * @author yuzhanglong
   * @date 2021-08-11 00:28:42
   * @param option pem 库关于 ca 的配置
   */
  static createCertification(option: CertificateCreationOptions): Promise<CertificateCreationResult> {
    return new Promise((resolve, reject) => {
      createCertificate(option, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }


  /**
   * 基于域名创建一个 CA 证书
   *
   * @author yuzhanglong
   * @date 2021-08-11 00:43:52
   * @param domain 域名
   */
  async createCertificationByDomain(domain: string): Promise<Certification> {
    if (!this.rootCertification) {
      const cert = fs.readFileSync(pathCert).toString();
      const key = fs.readFileSync(pathCertKey).toString();

      this.rootCertification = {
        key: key,
        cert: cert,
      };
    }

    const certification = await CertificationManager.createCertification({
      altNames: [domain],
      commonName: domain,
      days: 365,
      serviceCertificate: this.rootCertification.cert,
      serviceKey: this.rootCertification.key,
    });

    return {
      key: certification.clientKey,
      cert: certification.certificate,
    };
  }
}



