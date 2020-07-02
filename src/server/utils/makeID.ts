import alder from './alder';

export default (
  method: string,
  data: Record<string, any>,
  meta: Record<string, string>,
): string => {
  if (method === 'PUT' && data.id) return data.id;

  const date = data.attributes.created || new Date().toISOString();
  const value = `${data.attributes.email}:${data.attributes.company}:${date}`;
  return alder(value).toString(10);
};
