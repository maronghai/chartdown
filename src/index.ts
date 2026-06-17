import { Lexer } from './lexer';
import { Parser } from './parser';
import { AST } from './ast';

export { Lexer } from './lexer';
export { Parser } from './parser';
export { AST, Series, ChartType, AxisSide } from './ast';
export { Token, TokenType } from './types';

export function parse(input: string): AST {
  const lexer = new Lexer(input);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  return parser.parse();
}

export function tokenize(input: string) {
  const lexer = new Lexer(input);
  return lexer.tokenize();
}
