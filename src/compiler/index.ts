import { parse } from './parser';
import { generate } from './codegen';
import { optimize } from './optimizer';
import { createCompilerCreator } from './create-compiler';

export const createCompiler = createCompilerCreator(function baseCompile(
  template,
  options
) {
  const ast = parse(template.trim(), options);

  if (options.optimize !== false) {
    optimize(ast, options);
  }

  const code = generate(ast, options);

  return {
    render: code.render,
    staticRenderFns: code.staticRenderFns
  };
});
