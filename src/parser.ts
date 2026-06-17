import { Token, TokenType } from './types';
import { AST, Series, ChartType, AxisSide, StackMode } from './ast';

export class Parser {
  private tokens: Token[];
  private pos: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.pos] || { type: TokenType.EOF, value: '', line: 0, column: 0 };
  }

  private advance(): Token {
    return this.tokens[this.pos++];
  }

  private expect(type: TokenType): Token {
    const token = this.peek();
    if (token.type !== type) {
      throw new Error(`Expected ${type}, got ${token.type} at line ${token.line}:${token.column}`);
    }
    return this.advance();
  }

  private skipNewlines(): void {
    while (this.peek().type === TokenType.NEWLINE) {
      this.advance();
    }
  }

  private parseMultiLineData(text: string): number[][] {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.split(/\s+/).map(Number));
  }

  private parseSingleLineData(text: string): number[] {
    return text
      .split(/\s+/)
      .filter(v => v.length > 0)
      .map(Number);
  }

  private parseSeries(): Series | null {
    const typeToken = this.peek();
    if (typeToken.type !== TokenType.IDENTIFIER) {
      return null;
    }

    const typeMap: Record<string, ChartType> = {
      'b': 'bar',
      'l': 'line',
      'p': 'pie',
      's': 'scatter',
      'r': 'radar',
      'h': 'heatmap',
      'a': 'area',
      'k': 'candlestick'
    };

    const type = typeMap[typeToken.value];
    if (!type) {
      return null;
    }

    this.advance();
    
    if (this.peek().type !== TokenType.SLASH) {
      throw new Error(`Expected / after type at line ${typeToken.line}:${typeToken.column}`);
    }
    this.advance();

    const nameToken = this.expect(TokenType.IDENTIFIER);
    let stack: string | undefined;
    let axis: AxisSide = 'left';

    if (this.peek().type === TokenType.HASH) {
      this.advance();
      const stackToken = this.expect(TokenType.IDENTIFIER);
      stack = stackToken.value;
    }

    if (this.peek().type === TokenType.AT) {
      this.advance();
      const axisToken = this.expect(TokenType.IDENTIFIER);
      if (axisToken.value === 'r' || axisToken.value === 'right') {
        axis = 'right';
      }
    }

    this.expect(TokenType.COLON);

    const valuesToken = this.expect(TokenType.TEXT);
    
    let data: number[] | number[][];
    
    if (type === 'candlestick') {
      data = this.parseMultiLineData(valuesToken.value);
    } else {
      data = this.parseSingleLineData(valuesToken.value);
    }

    return {
      type,
      name: nameToken.value,
      stack,
      axis,
      data
    };
  }

  parse(): AST {
    const ast: AST = {
      labels: [],
      series: []
    };

    while (this.peek().type !== TokenType.EOF) {
      const token = this.peek();

      if (token.type === TokenType.NEWLINE) {
        this.advance();
        continue;
      }

      if (token.type === TokenType.TITLE) {
        this.advance();
        const textToken = this.expect(TokenType.TEXT);
        ast.title = textToken.value;
      } else if (token.type === TokenType.CONFIG) {
        this.advance();
        const keyToken = this.expect(TokenType.IDENTIFIER);
        const valueToken = this.expect(TokenType.TEXT);
        
        const key = keyToken.value;
        const value = valueToken.value;

        switch (key) {
          case 'x':
            ast.xTitle = value;
            break;
          case 'y':
            ast.yTitle = value;
            break;
          case 'y2':
            ast.y2Title = value;
            break;
          case 'stack':
            if (value === 'percent' || value === '100') {
              ast.stack = 'percent';
            } else {
              ast.stack = 'normal';
            }
            break;
          case 'theme':
            ast.theme = value;
            break;
          case 'legend':
            ast.legend = value;
            break;
          case 'grid':
            ast.grid = value === 'true';
            break;
          case 'smooth':
            ast.smooth = value === 'true';
            break;
          case 'zoom':
            ast.zoom = value === 'true';
            break;
          case 'unit':
            ast.unit = value;
            break;
          case 'palette':
            ast.palette = value;
            break;
        }
      } else if (token.type === TokenType.LABELS) {
        this.advance();
        const textToken = this.expect(TokenType.TEXT);
        ast.labels = textToken.value.split(/\s+/).filter(v => v.length > 0);
      } else {
        const series = this.parseSeries();
        if (series) {
          ast.series.push(series);
        } else {
          this.advance();
        }
      }
    }

    return ast;
  }
}
