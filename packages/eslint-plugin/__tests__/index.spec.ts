import { ESLint } from 'eslint';
import * as path from 'path';

describe('test eslint instance', () => {
  test('eslint instance that should running successfully', () => {
    const eslint = new ESLint({
      baseConfig: require('../src'),
      cwd: path.resolve(__dirname, '../'),
    });
    console.log(eslint);
    expect(eslint).toBeTruthy();
  });
});
