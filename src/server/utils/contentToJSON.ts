export default (value: string): Record<string, any> | Array<any> =>
  JSON.parse(Buffer.from(value, 'base64').toString());
