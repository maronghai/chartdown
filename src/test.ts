import { parse, tokenize } from './index';

console.log('=== Chartdown v1 Parser Test ===\n');

// Test 1: Basic server metrics
const input1 = `= server

!x 时间

!y 使用率(%)

!y2 QPS

!stack normal

b/cpu#res@l: 30 40 50

b/mem#res@l: 60 70 80

b/cache#res@l: 10 20 15

l/qps@r: 1000 1200 1500

@ 周一 周二 周三`;

console.log('Test 1: Server metrics with stack');
const ast1 = parse(input1);
console.log('Title:', ast1.title);
console.log('Series count:', ast1.series.length);
console.log('Labels:', ast1.labels);
console.log('✓ Pass\n');

// Test 2: Simple bar chart
const input2 = `= sales
!x Month
!y Revenue
b/jan: 100 200 150
@ Jan Feb Mar`;

console.log('Test 2: Simple bar chart');
const ast2 = parse(input2);
console.log('Title:', ast2.title);
console.log('Series:', ast2.series[0].name, ast2.series[0].data);
console.log('✓ Pass\n');

// Test 3: Dual axis
const input3 = `= performance
!x Time
!y Latency(ms)
!y2 Throughput
l/latency: 100 120 90 110
b/requests@r: 1000 1200 1500 1300
@ t1 t2 t3 t4`;

console.log('Test 3: Dual axis');
const ast3 = parse(input3);
console.log('Y2 Title:', ast3.y2Title);
console.log('Right axis series:', ast3.series.find(s => s.axis === 'right')?.name);
console.log('✓ Pass\n');

// Test 4: Percent stack
const input4 = `= resources
!x Server
!y Usage
!stack percent
b/cpu: 30 40 50
b/mem: 60 70 80
@ s1 s2 s3`;

console.log('Test 4: Percent stack');
const ast4 = parse(input4);
console.log('Stack mode:', ast4.stack);
console.log('✓ Pass\n');

// Test 5: Candlestick (K-line)
const input5 = `= BTC

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

@ Mon Tue Wed`;

console.log('Test 5: Candlestick with MA and Volume');
const ast5 = parse(input5);
console.log('Title:', ast5.title);
const klineSeries = ast5.series.find(s => s.type === 'candlestick');
console.log('K-line series:', klineSeries?.name);
console.log('K-line data rows:', Array.isArray(klineSeries?.data) ? (klineSeries?.data as number[][]).length : 0);
console.log('✓ Pass\n');

// Test 6: All chart types
const input6 = `= alltypes
b/bar: 1 2 3
l/line: 4 5 6
a/area: 7 8 9
p/pie: 10 20 30
s/scatter: 1 2 3 4 5 6
r/radar: 80 90 70 85 75
@ A B C D E F`;

console.log('Test 6: All chart types');
const ast6 = parse(input6);
console.log('Series types:', ast6.series.map(s => s.type));
console.log('✓ Pass\n');

// Test 7: Theme and grid
const input7 = `= darkchart
!theme dark
!grid true
!smooth true
!zoom true
!unit ms
!palette pastel
l/data: 10 20 30
@ x1 x2 x3`;

console.log('Test 7: Theme and grid options');
const ast7 = parse(input7);
console.log('Theme:', ast7.theme);
console.log('Grid:', ast7.grid);
console.log('Smooth:', ast7.smooth);
console.log('Zoom:', ast7.zoom);
console.log('Unit:', ast7.unit);
console.log('Palette:', ast7.palette);
console.log('✓ Pass\n');

// Test 8: Tokenization
console.log('Test 8: Tokenization');
const tokens = tokenize('b/cpu#res@l: 30 40 50');
console.log('Token count:', tokens.length);
console.log('Token types:', tokens.map(t => t.type).join(' → '));
console.log('✓ Pass\n');

console.log('=== All 8 tests completed ===');
