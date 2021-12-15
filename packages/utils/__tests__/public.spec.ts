/// <reference types="@types/jest" />

import { removeWhiteSpace } from '../src/public';

describe('public tools tests', function () {
  test('remove white space', () => {
    expect(removeWhiteSpace('hello world \n\n yuzhanglong!')).toStrictEqual('helloworldyuzhanglong!');
  });
});
