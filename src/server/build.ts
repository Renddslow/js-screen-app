import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import prettier from 'prettier';
import snark from 'snarkdown';

import alder from './alder';
import { ServerResponse } from './jsonApiTypes';

const write = promisify(fs.writeFile);
const render = promisify(ejs.renderFile);

interface Survey {
  data: {
    type: 'survey';
    attributes: {
      email: string;
      company: string;
      tools: Array<string>;
      questions: Array<string>;
      preamble: string;
      expectations: string;
    };
  };
}

const QUESTIONS = [
  { id: 0, label: 'Never heard of it' },
  { id: 1, label: 'Heard of it, never used it' },
  { id: 2, label: 'Used it for personal projects' },
  { id: 3, label: 'Used it at work' },
];

export default async (req: Record<string, any>, res: ServerResponse) => {
  const { data } = <Survey>req.body;

  const id = alder(data.attributes.email).toString(10);
  // TODO: check if ID already exists; bail if it does

  const doc = await render(path.join(__dirname, '..', 'src/templates', 'survey.ejs'), {
    questions: QUESTIONS,
    tools: data.attributes.tools,
    company: data.attributes.company,
    longForms: data.attributes.questions.map((q) => ({ id: alder(q), question: snark(q) })) || [],
    preamble: data.attributes.preamble ? snark(data.attributes.preamble) : '',
    expectations: data.attributes.expectations ? snark(data.attributes.expectations) : '',
    id,
  });

  const prettified = prettier.format(doc, { parser: 'html' });

  // TODO: write directly to GitHub
  await write(path.join(__dirname, '..', 'public', `${id}.html`), prettified);

  return res.json({
    data: {
      id,
      type: 'survey',
    },
  });
};