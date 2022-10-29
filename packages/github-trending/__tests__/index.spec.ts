/// <reference types="@types/jest" />
import { getGithubTrending } from '../src';
import { getTrendingByMoreLanguage } from '../src/get-trending-by-more-language';

describe('index test', () => {
  test('get trending', async () => {
    const res = await getGithubTrending({
      language: 'javascript',
      spokenLanguage: 'zh',
      period: 'daily',
    });
    expect(res.length).toBeTruthy();
  });

  test('get trending by more languages', async () => {
    const res = await getTrendingByMoreLanguage(['javascript', 'java'], {
      language: 'javascript',
      spokenLanguage: 'zh',
      period: 'daily',
    });
    expect(res.javascript.length).toBeTruthy();
    expect(res.java.length).toBeTruthy();
  }, 20000);
});
