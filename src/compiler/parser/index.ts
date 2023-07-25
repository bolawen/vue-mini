import { parseHTML } from './html-parser';
import { parseText } from './text-parser';

export function createASTElement(tag, attrs, parent) {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: {},
    rawAttrsMap: {},
    parent,
    children: []
  };
}

export function parse(template, options) {
  parseHTML(template, {
    chars(){
      parseText(template);
    }
  });
}
