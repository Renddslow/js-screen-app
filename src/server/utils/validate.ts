import { APIError, Response } from './jsonApiTypes';

export default (
  data: Response['data'],
  type: string,
  required: Array<string>,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
): Array<APIError> => {
  const errors = [];

  if (!data.id && method === 'PUT') {
    errors.push({
      status: 400,
      code: 'MissingIDError',
      title: 'ID is missing in input',
    });
  }

  if (!data.type || data.type !== type) {
    errors.push({
      status: 400,
      code: 'MismatchingTypeError',
      title: 'Type did not match input',
      detail: `Expected type of "${type}" but received "${data.type}"`,
    });
  }

  const attrKeys = Object.keys(data.attributes);
  return required.reduce((acc, field) => {
    if (
      !attrKeys.includes(field) ||
      data.attributes[field] === null ||
      typeof data.attributes[field] === 'undefined'
    ) {
      acc.push({
        status: 400,
        code: 'MissingRequiredFieldError',
        title: 'Expected input field was not provided',
        detail: `Expected "attributes" to include "${field}", but none was provided.`,
      });
    }
    return acc;
  }, errors);
};
