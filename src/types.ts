export enum TokenType {
  // 特殊符号
  TITLE = 'TITLE',           // = 
  CONFIG = 'CONFIG',         // !
  LABELS = 'LABELS',         // @
  COLON = 'COLON',           // :
  SLASH = 'SLASH',           // /
  HASH = 'HASH',             // #
  AT = 'AT',                 // @ (用于axis)
  
  // 值
  IDENTIFIER = 'IDENTIFIER', // 标识符（类型、名称、key）
  NUMBER = 'NUMBER',         // 数字
  STRING = 'STRING',         // 字符串（带引号）
  TEXT = 'TEXT',              // 文本（空格分隔的值）
  
  // 结构
  NEWLINE = 'NEWLINE',       // 换行
  EOF = 'EOF',               // 文件结束
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}
