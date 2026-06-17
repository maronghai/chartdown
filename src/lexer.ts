import { Token, TokenType } from './types';

export class Lexer {
  private input: string;
  private pos: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(input: string) {
    this.input = input;
  }

  private peek(): string {
    return this.pos < this.input.length ? this.input[this.pos] : '\0';
  }

  private advance(): string {
    const char = this.input[this.pos++];
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  private skipWhitespace(): void {
    while (this.pos < this.input.length && (this.input[this.pos] === ' ' || this.input[this.pos] === '\t')) {
      this.advance();
    }
  }

  private readWord(): string {
    let word = '';
    while (this.pos < this.input.length && /[a-zA-Z0-9_\-]/.test(this.input[this.pos])) {
      word += this.advance();
    }
    return word;
  }

  private readLine(): string {
    let line = '';
    while (this.pos < this.input.length && this.input[this.pos] !== '\n' && this.input[this.pos] !== '\0') {
      line += this.advance();
    }
    return line.trim();
  }

  private isDataLine(line: string): boolean {
    return /^\s*[\d\.\-\s]+$/.test(line) && line.trim().length > 0;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.pos < this.input.length) {
      this.skipWhitespace();
      
      if (this.pos >= this.input.length) break;

      const char = this.peek();
      const startLine = this.line;
      const startCol = this.column;

      if (char === '\n') {
        this.advance();
        tokens.push({ type: TokenType.NEWLINE, value: '\n', line: startLine, column: startCol });
      } else if (char === '=') {
        this.advance();
        tokens.push({ type: TokenType.TITLE, value: '=', line: startLine, column: startCol });
        this.skipWhitespace();
        const text = this.readLine();
        if (text) {
          tokens.push({ type: TokenType.TEXT, value: text, line: startLine, column: startCol + 1 });
        }
      } else if (char === '!') {
        this.advance();
        tokens.push({ type: TokenType.CONFIG, value: '!', line: startLine, column: startCol });
        this.skipWhitespace();
        const key = this.readWord();
        if (key) {
          tokens.push({ type: TokenType.IDENTIFIER, value: key, line: startLine, column: startCol + 1 });
        }
        this.skipWhitespace();
        const value = this.readLine();
        if (value) {
          tokens.push({ type: TokenType.TEXT, value: value, line: startLine, column: startCol + 1 });
        }
      } else if (char === '@') {
        this.advance();
        if (this.peek() === ' ' || this.peek() === '\t' || this.peek() === '\n' || this.peek() === '\0') {
          tokens.push({ type: TokenType.LABELS, value: '@', line: startLine, column: startCol });
          this.skipWhitespace();
          const labels = this.readLine();
          if (labels) {
            tokens.push({ type: TokenType.TEXT, value: labels, line: startLine, column: startCol + 1 });
          }
        } else {
          tokens.push({ type: TokenType.AT, value: '@', line: startLine, column: startCol });
        }
      } else if (char === ':') {
        this.advance();
        tokens.push({ type: TokenType.COLON, value: ':', line: startLine, column: startCol });
        this.skipWhitespace();
        
        const dataLines: string[] = [];
        const firstLine = this.readLine();
        if (firstLine) {
          dataLines.push(firstLine);
        }
        
        while (this.pos < this.input.length) {
          this.skipWhitespace();
          if (this.peek() === '\n') {
            this.advance();
            this.skipWhitespace();
          }
          
          if (this.pos >= this.input.length || this.peek() === '\0') break;
          
          const savedLine = this.line;
          const savedCol = this.column;
          const nextLine = this.readLine();
          
          if (nextLine && this.isDataLine(nextLine)) {
            dataLines.push(nextLine);
          } else {
            this.pos -= nextLine.length;
            this.line = savedLine;
            this.column = savedCol;
            break;
          }
        }
        
        if (dataLines.length > 0) {
          tokens.push({ type: TokenType.TEXT, value: dataLines.join('\n'), line: startLine, column: startCol + 1 });
        }
      } else if (char === '/') {
        this.advance();
        tokens.push({ type: TokenType.SLASH, value: '/', line: startLine, column: startCol });
      } else if (char === '#') {
        this.advance();
        tokens.push({ type: TokenType.HASH, value: '#', line: startLine, column: startCol });
      } else if (/[a-zA-Z]/.test(char)) {
        const word = this.readWord();
        tokens.push({ type: TokenType.IDENTIFIER, value: word, line: startLine, column: startCol });
      } else if (/[0-9\-]/.test(char)) {
        let num = '';
        while (this.pos < this.input.length && /[0-9\-\.]/.test(this.input[this.pos])) {
          num += this.advance();
        }
        tokens.push({ type: TokenType.NUMBER, value: num, line: startLine, column: startCol });
      } else {
        this.advance();
      }
    }

    tokens.push({ type: TokenType.EOF, value: '', line: this.line, column: this.column });
    return tokens;
  }
}
