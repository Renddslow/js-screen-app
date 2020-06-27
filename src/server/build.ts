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
    id?: string;
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

const SNARES = ['Abyssal', 'Colossum.js', 'Reflexive Design', 'Alseta', 'Neutron 2'];

const getSnare = () => {
  const idx = Math.floor(Math.random() * SNARES.length);
  return SNARES[idx];
};

const addSnare = (src, snare) => {
  const arr = src.slice();
  const idx = Math.floor(Math.random() * src.length);
  arr.splice(idx, 0, snare);
  return arr;
};

export default async (req: Record<string, any>, res: ServerResponse) => {
  const { data } = <Survey>req.body;

  const id = alder(data.attributes.email).toString(10);
  // TODO: check if ID already exists; bail if it does

  const doc = await render(path.join(__dirname, '..', 'src/templates', 'survey.ejs'), {
    questions: QUESTIONS,
    tools: addSnare(data.attributes.tools, getSnare()),
    company: data.attributes.company,
    longForms: data.attributes.questions.map((q) => ({ id: alder(q), question: snark(q) })) || [],
    preamble: data.attributes.preamble ? snark(data.attributes.preamble) : '',
    expectations: data.attributes.expectations ? snark(data.attributes.expectations) : '',
    id,
  });

  const prettified = prettier.format(doc, { parser: 'html' });

  // TODO: write directly to GitHub
  await write(path.join(__dirname, '..', 'public', `${id}.html`), prettified);
  await write(
    path.join(__dirname, '..', 'public', `${id}.json`),
    JSON.stringify(
      {
        data: {
          ...data,
          id: data.id || id,
        },
      },
      null,
      2,
    ),
  );

  return res.json({
    data: {
      id,
      type: 'survey',
    },
  });
};
