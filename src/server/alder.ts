const alder = (value: string): number => {
  let a = 1;
  let b = 0;
  let i = 0;
  let lastB = 0;

  while (i < value.length) {
    a += value.charCodeAt(i);
    b += !lastB ? value.charCodeAt(i) : value.charCodeAt(i) + lastB;
    lastB = b; // this may not be necessary, double check
    i++;
  }
  a = a % 65521;
  b = b % 65521;

  return b * 65536 + a;
};

export default alder;
