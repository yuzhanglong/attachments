import type { GetGithubTrendingOptions, Repository } from './types';
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
      res[language] = await getGithubTrending({
        ...options,
        language,
      });
    }),
  );
  return res;
};
