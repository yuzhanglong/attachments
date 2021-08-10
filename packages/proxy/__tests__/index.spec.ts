import { pathCert, pathCertKey } from '../src/const';
import * as path from 'path';

describe('test utils', () => {
  test('test cert path', () => {
    const p = path.resolve(process.cwd(), 'packages', 'proxy', 'certificate');
    expect(pathCert).toStrictEqual(path.resolve(p, 'yuzhanglong.pem'));
    expect(pathCertKey).toStrictEqual(path.resolve(p, 'yuzhanglong-key.pem'));
  });
});
