import * as path from 'path';
import { pathCert, pathCertKey } from '../src/const';

describe('test utils', () => {
  test('cert path', () => {
    const p = path.resolve(process.cwd(), 'packages', 'proxy', 'certificate');
    expect(pathCert).toStrictEqual(path.resolve(p, 'rootCA.pem'));
    expect(pathCertKey).toStrictEqual(path.resolve(p, 'rootCA-key.pem'));
  });
});
