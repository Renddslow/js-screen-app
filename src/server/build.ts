import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import prettier from 'prettier';
import snark from 'snarkdown';

import alder from './utils/alder';
import { ServerResponse } from './utils/jsonApiTypes';
import validate from './utils/validate';
import makeID from './utils/makeID';
import getFile from './utils/getFile';
import createFile from './utils/createFile';
import contentToJSON from './utils/contentToJSON';

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
  meta?: {
    creationTime: string;
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
  const { data, meta } = <Survey>req.body;
  const ownedSurveys = <Array<any>>(
    contentToJSON((await getFile(`${alder(data.attributes.email)}.json`)).content)
  );

  const errors = validate(data, 'survey', ['email', 'company', 'tools'], req.method);

  if (errors.length) {
    return res.json({ errors }, 400);
  }

  const id = makeID(req.method, data, meta);

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
  const ownedSurveysJson = JSON.stringify(ownedSurveys ? [...ownedSurveys, id] : [id]);
  await Promise.all([
    createFile(`${alder(data.attributes.email)}.json`, ownedSurveysJson),
    createFile(
      `${id}/settings.json`,
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
    ),
  ]);
  // await createFile(`public/${id}.html`, prettified, false);

  return res.json({
    data: {
      id,
      type: 'survey',
    },
  });
};
