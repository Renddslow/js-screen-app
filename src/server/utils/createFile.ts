import got from 'got';

import { STORAGE_BASE_URL, REPO_BASE_URL } from './baseUrl';
import getFile from './getFile';

const TOKEN = process.env.GITHUB_TOKEN;

export default async (filePath: string, content: string, storage: boolean = true) => {
  const file = await getFile(filePath, storage);
  console.log(file);

  console.debug(`Updating or creating "${filePath}" in ${storage ? 'STORE' : 'SITE'}`);
  console.debug(content);
  return got(`${storage ? STORAGE_BASE_URL : REPO_BASE_URL}/${filePath}`, {
    searchParams: { access_token: TOKEN },
    method: 'PUT',
    headers: {
      Authorization: `token ${TOKEN}`,
    },
    body: JSON.stringify({
      message: `Modified ${filePath} from API`,
      content: Buffer.from(content).toString('base64'),
      sha: file && file['sha'],
    }),
  })
    .json()
    .catch((e) => console.log(e));
};
