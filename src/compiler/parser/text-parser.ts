const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function parseText(text, delimiters?) {
  const tagRE = delimiters ? delimiters : defaultTagRE;
  if (!tagRE.test(text)) {
    return;
  }

  const tokens:any[] = [];
  const rwaTokens:any[] = [];

  let lastIndex = (tagRE.lastIndex = 0);
  let match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    if (index > lastIndex) {
      rwaTokens.push((tokenValue = text.slice(lastIndex, index)));
      tokens.push(JSON.stringify(tokenValue));
    }
    const exp = match[1].trim();
    tokens.push(`_s(${exp})`);
    rwaTokens.push({'@binding': exp});
    lastIndex = index + match[0].length;
  }
  if(lastIndex < text.length){
    rwaTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }

  return {
    tokens: rwaTokens,
    expression: tokens.join("+"),
  }
}
