import { GetGithubTrendingOptions, Repository } from './types';
import { getGithubTrending } from './get-github-trending';

/**
 * 获取多个语言的 GitHub 趋势
 *
 * @author yuzhanglong
 * @date 2022-01-06 21:17:53
 */
export const getTrendingByMoreLanguage = async (languages: string[], options: GetGithubTrendingOptions) => {
  const res: Record<string, Repository[]> = {};
  await Promise.all(
    languages.map(async (language) => {
      const repos = await getGithubTrending({
        ...options,
        language: language,
      });
      res[language] = repos;
    })
  );
  return res;
};
