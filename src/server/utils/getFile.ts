import got from 'got';

import { REPO_BASE_URL, STORAGE_BASE_URL } from './baseUrl';

const TOKEN = process.env.GITHUB_TOKEN;

const getFile = (fp: string, storage: boolean = true): Record<string, any> => {
  console.log(`${storage ? STORAGE_BASE_URL : REPO_BASE_URL}/${fp}`);
  return got(`${storage ? STORAGE_BASE_URL : REPO_BASE_URL}/${fp}`, {
    headers: {
      Authorization: `token ${TOKEN}`,
    },
  })
    .json()
    .then((body) => body);
};

export default getFile;
