# Chartdown

**Tiny chart DSL for Markdown, humans, and AI agents.**

A simple DSL for describing charts using CSV-like syntax instead of configuration languages.

## Design Principles

- **Data First, Config Last** - Write data naturally, not JSON
- **Minimal Syntax** - Just 6 special characters: `= ! @ : / #`
- **AI Friendly** - Easy for LLMs to generate
- **Markdown Compatible** - Works in any Markdown renderer
- **Tiny Parser** - ~400 lines total

## Features

| Feature | Support |
|---------|---------|
| Bar | ✅ |
| Line | ✅ |
| Area | ✅ |
| Pie | ✅ |
| Scatter | ✅ |
| Radar | ✅ |
| Heatmap | ✅ |
| Candlestick (K-line) | ✅ |
| Mixed Chart | ✅ |
| Dual Y Axis | ✅ |
| Stack | ✅ |
| Percent Stack | ✅ |
| Theme | ✅ |
| Legend | ✅ (reserved) |
| Zoom | ✅ (reserved) |
| Smooth Line | ✅ (reserved) |
| Time Series | ✅ |

## Installation

```bash
npm install chartdown
```

## Quick Start

```typescript
import { parse } from 'chartdown';

const input = `= server

!x Time

!y Usage(%)

!y2 QPS

b/cpu: 30 40 50

b/mem: 60 70 80

l/qps@r: 1000 1200 1500

@ Mon Tue Wed`;

const ast = parse(input);
console.log(ast);
```

## Syntax

### Title

```
= chart title
```

### Configuration

```
!key value
```

Options:
- `!x` - X axis title
- `!y` - Y axis title  
- `!y2` - Secondary Y axis title
- `!stack` - Stack mode (`normal` or `percent`/`100`)
- `!theme` - Theme (`dark`/`light`)
- `!legend` - Legend position (`right`/`left`/`top`/`bottom`)
- `!grid` - Show grid (`true`/`false`)
- `!smooth` - Smooth curves (`true`/`false`)
- `!zoom` - Enable zoom (`true`/`false`)
- `!unit` - Unit suffix
- `!palette` - Color palette

### Series

```
<type>/<name>#<stack>@<axis>: values
```

- **Type**: `b` (bar), `l` (line), `a` (area), `p` (pie), `s` (scatter), `r` (radar), `h` (heatmap), `k` (candlestick)
- **Name**: Series name
- **Stack** (optional): Stack group name
- **Axis** (optional): `l`/`left` or `r`/`right`
- **Values**: Space-separated numbers

### Labels

```
@ label1 label2 label3
```

## Examples

### Simple Bar Chart

```
= Sales
!x Month
!y Revenue
b/jan: 100 200 150
@ Jan Feb Mar
```

### Dual Axis

```
= Performance
!x Time
!y Latency(ms)
!y2 Throughput
l/latency: 100 120 90 110
b/requests@r: 1000 1200 1500 1300
@ t1 t2 t3 t4
```

### Stacked Bars

```
= Resources
!x Server
!y Usage
!stack normal
b/cpu#web: 30 40 50
b/cpu#api: 20 25 30
b/mem#web: 60 70 80
b/mem#api: 40 45 50
@ s1 s2 s3
```

### Percent Stack

```
= Market Share
!x Product
!y Share
!stack percent
b/appA: 30 40 50
b/appB: 70 60 50
@ Q1 Q2 Q3
```

### Candlestick (K-line)

```
= BTC

!x Date
!y Price
!y2 Volume

k/price@l:
100 120 90 110
110 130 100 125
125 140 120 130

l/ma5@l:
108 115 122

b/volume@r:
1000 1500 1800

@ Mon Tue Wed
```

## AST Structure

```typescript
type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'radar' | 'heatmap' | 'area' | 'candlestick';
type AxisSide = 'left' | 'right';
type StackMode = 'normal' | 'percent' | '100';

interface Series {
  type: ChartType;
  name: string;
  stack?: string;
  axis: AxisSide;
  data: number[] | number[][];  // number[][] for candlestick (OHLC)
}

interface AST {
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
```

## Comparison with Mermaid

**Mermaid:**
```
xychart-beta
  title "server"
  x-axis [...]
  bar [...]
  line [...]
```

**Chartdown:**
```
= server
b/cpu: 30 40 50
l/qps: 1000 1200 1500
```

## License

MIT
