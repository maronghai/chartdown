export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'radar' | 'heatmap' | 'area' | 'candlestick';
export type AxisSide = 'left' | 'right';
export type StackMode = 'normal' | 'percent' | '100';

export interface Series {
  type: ChartType;
  name: string;
  stack?: string;
  axis: AxisSide;
  data: number[] | number[][];
}

export interface AST {
  title?: string;
  xTitle?: string;
  yTitle?: string;
  y2Title?: string;
  stack?: StackMode;
  theme?: string;
  legend?: string;
  grid?: boolean;
  smooth?: boolean;
  zoom?: boolean;
  unit?: string;
  palette?: string;
  labels: string[];
  series: Series[];
}
