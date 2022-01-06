export interface Repository {
  author: string;
  name: string;
  href: string;
  description: string | null;
  language: string;
  stars: number;
  forks: number;
  starsInPeriod: number | null;
}

export interface GetGithubTrendingOptions {
  period?: string;
  language?: string;
  spokenLanguage: string;
}
