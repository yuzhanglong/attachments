import axios from 'axios';
import * as cheerio from 'cheerio';
import { GetGithubTrendingOptions, Repository } from './types';

/**
 * 获取 GitHub 趋势
 *
 * @author https://github.com/ecrmnn/trending-github/blob/master/src/index.ts
 * @date 2022-01-06 21:17:24
 */
export const getGithubTrending = async (options: GetGithubTrendingOptions) => {
  const { period = 'daily', language, spokenLanguage = 'zh' } = options;
  const response = await axios.get(
    `https://github.com/trending/${encodeURIComponent(
      language
    )}?since=${period}&spoken_language_code=${spokenLanguage}`,
    {
      headers: {
        Accept: 'text/html',
      },
    }
  );
  const $ = cheerio.load(response.data);
  const repositories: Repository[] = [];

  $('article').each((index, repo) => {
    const title = $(repo).find('h1.h3 a').text().replace(/\s/g, '');

    const author = title.split('/')[0];
    const name = title.split('/')[1];

    const starLink = `/${title.replace(/ /g, '')}/stargazers`;
    const forkLink = `/${title.replace(/ /g, '')}/network/members.${name}`;

    let text: string;
    if (period === 'daily') {
      text = 'stars today';
    } else if (period === 'weekly') {
      text = 'stars this week';
    } else {
      text = 'stars this month';
    }

    const indexRepo: Repository = {
      author,
      name,
      href: `https://github.com/${author}/${name}`,
      description: $(repo).find('p').text().trim() || null,
      language: $(repo).find('[itemprop=programmingLanguage]').text().trim(),
      stars: parseInt($(repo).find(`[href="${starLink}"]`).text().trim().replace(',', '') || '0', 0),
      forks: parseInt($(repo).find(`[href="${forkLink}"]`).text().trim().replace(',', '') || '0', 0),
      starsInPeriod: parseInt(
        $(repo).find(`span.float-sm-right:contains('${text}')`).text().trim().replace(text, '').replace(',', '') || '0',
        0
      ),
    };

    repositories.push(indexRepo);
  });
  return repositories;
};
