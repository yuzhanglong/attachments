import * as fs from 'fs';
import type { CertificateCreationOptions, CertificateCreationResult } from 'pem';
import { createCertificate } from 'pem';
import { CERT, KEY, MAX_DAYS, pathCert, pathCertKey } from './const';

interface Certification {
  key: string
  cert: string
}

export class CertificationManager {
  private rootCertification: Certification;

  private certificationCachedMap = new Map<string, Certification>();

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
        if (error)
          reject(error);

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
      this.rootCertification = {
        key: KEY,
        cert: CERT,
      };
    }

    const certification = await CertificationManager.createCertification({
      altNames: [domain],
      commonName: domain,
      days: MAX_DAYS,
      serviceCertificate: this.rootCertification.cert,
      serviceKey: this.rootCertification.key,
    });

    const res = {
      key: certification.clientKey,
      cert: certification.certificate,
    };

    this.certificationCachedMap.set(domain, res);

    return res;
  }
}
