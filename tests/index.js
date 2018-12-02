/* eslint no-console: 1 */

import test from 'zora';

import createScatterplot, { createRegl, createTextureFromUrl } from '../src';
import {
  DEFAULT_COLORS,
  DEFAULT_HEIGHT,
  DEFAULT_POINT_OUTLINE_WIDTH,
  DEFAULT_POINT_SIZE,
  DEFAULT_POINT_SIZE_SELECTED,
  DEFAULT_WIDTH
} from '../src/constants';

const createCanvas = (width = 200, height = 200) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

/* ------------------------------ constructors ------------------------------ */

test('createRegl()', t => {
  const dim = 200;
  const canvas = createCanvas(dim, dim);
  const gl = canvas.getContext('webgl');

  t.equal(gl.drawingBufferWidth, dim, `width should be ${dim}px`);
  t.equal(gl.drawingBufferHeight, dim, `height should be ${dim}px`);

  const regl = createRegl(canvas);

  t.ok(!!regl, 'regl should be instanciated');
});

test('createScatterplot()', t => {
  const canvas = createCanvas();
  const scatterplot = createScatterplot({ canvas });

  t.equal(scatterplot.canvas, canvas, 'canvas object should equal');
  t.equal(
    scatterplot.style('colors'),
    DEFAULT_COLORS,
    'scatterplot should have default colors'
  );
  t.equal(
    scatterplot.style('pointSize'),
    DEFAULT_POINT_SIZE,
    'scatterplot should have default point size'
  );
  t.equal(
    scatterplot.style('pointSizeSelected'),
    DEFAULT_POINT_SIZE_SELECTED,
    'scatterplot should have default selected point size'
  );
  t.equal(
    scatterplot.style('pointOutlineWidth'),
    DEFAULT_POINT_OUTLINE_WIDTH,
    'scatterplot should have default point outline width'
  );
  t.equal(
    scatterplot.attr('width'),
    DEFAULT_WIDTH,
    'scatterplot should have default width'
  );
  t.equal(
    scatterplot.attr('height'),
    DEFAULT_HEIGHT,
    'scatterplot should have default height'
  );
});

test('createTextureFromUrl()', async t => {
  const regl = createRegl(createCanvas());

  const texture = await createTextureFromUrl(
    regl,
    'https://picsum.photos/300/200/',
    true
  );

  t.equal(
    texture._reglType, // eslint-disable-line no-underscore-dangle
    'texture2d',
    'texture should be a Regl texture object'
  );
});

/* ------------------------------- properties ------------------------------- */

test('scatterplot.canvas, scatterplot.regl, and scatterplot.version', async t => {
  const canvas = createCanvas();
  const regl = createRegl(canvas);
  const scatterplot = createScatterplot({ canvas, regl });

  t.equal(scatterplot.canvas, canvas, 'canvas should be a canvas element');

  t.equal(scatterplot.regl, regl, 'regl should be a regl instance');

  t.equal(scatterplot.version, VERSION, `version should be set to ${VERSION}`);
});

/* --------------------------------- attr() --------------------------------- */

test('attr({ width, height })', t => {
  const w1 = 200;
  const h1 = 200;

  const canvas = createCanvas(w1, h1);
  const gl = canvas.getContext('webgl');
  const scatterplot = createScatterplot({ canvas, width: w1, height: h1 });

  t.equal(gl.drawingBufferWidth, w1, `width should be ${w1}px`);
  t.equal(gl.drawingBufferHeight, h1, `height should be ${h1}px`);

  const w2 = 400;
  const h2 = 300;

  scatterplot.attr({ width: w2, height: h2 });

  t.equal(gl.drawingBufferWidth, w2, `width should be set to ${w2}px`);
  t.equal(gl.drawingBufferHeight, h2, `height should be set to ${h2}px`);
});

test('attr({ aspectRatio })', t => {
  const canvas = createCanvas(400, 200);
  const scatterplot = createScatterplot({ canvas, width: 400, height: 200 });

  const aspectRatio = 2;
  scatterplot.attr({ aspectRatio });

  t.equal(
    scatterplot.attr('aspectRatio'),
    aspectRatio,
    `aspectRatio should be set to ${aspectRatio}`
  );
});

/* --------------------------------- style() -------------------------------- */

test('style({ background })', t => {
  const scatterplot = createScatterplot({ canvas: createCanvas() });

  const backgroundHex = '#ff0000';
  const backgroundNrgba = [1, 0, 0, 1];
  scatterplot.style({ background: backgroundHex });

  t.ok(
    scatterplot.style('background').every((v, i) => v === backgroundNrgba[i]),
    'background should be red and and converted to normalized RGBA'
  );
});

test('style({ backgroundImage })', async t => {
  const canvas = createCanvas();
  const regl = createRegl(canvas);
  const scatterplot = createScatterplot({ canvas, regl });

  const backgroundImage = await createTextureFromUrl(
    regl,
    'https://picsum.photos/300/200/',
    true
  );

  scatterplot.style({ backgroundImage });

  t.equal(
    scatterplot.style('backgroundImage'),
    backgroundImage,
    'background image should be a Regl texture'
  );

  scatterplot.style({ backgroundImage: null });

  t.equal(
    scatterplot.style('backgroundImage'),
    null,
    'background image should be nullifyable'
  );
});

test('style({ colorBy })', async t => {
  const scatterplot = createScatterplot({ canvas: createCanvas() });

  const colorBy = 'category';

  scatterplot.style({ colorBy });

  t.equal(
    scatterplot.style('colorBy'),
    colorBy,
    `colorBy should be set to ${colorBy}`
  );

  scatterplot.style({ colorBy: null });

  t.equal(scatterplot.style('colorBy'), null, 'colorBy should be nullifyable');
});

test('style({ colors })', t => {
  const canvas = createCanvas();
  const scatterplot = createScatterplot({ canvas });

  const rgba6 = [
    [0.22745098039215686, 0.47058823529411764, 0.6666666666666666, 1],
    [0, 0.5529411764705883, 1, 1],
    [0, 0.5529411764705883, 1, 1],
    [0, 0, 0, 1],
    [0.6666666666666666, 0.22745098039215686, 0.6, 1],
    [1, 0, 0.8549019607843137, 1],
    [1, 0, 0.8549019607843137, 1],
    [0, 0, 0, 1]
  ];

  const rgba2 = [
    [0, 0.5529411764705883, 1, 1],
    [0, 0.5529411764705883, 1, 1],
    [0, 0.5529411764705883, 1, 1],
    [0, 0, 0, 1],
    [1, 0, 0.8549019607843137, 1],
    [1, 0, 0.8549019607843137, 1],
    [1, 0, 0.8549019607843137, 1],
    [0, 0, 0, 1]
  ];

  const rgba2a = [
    [0, 0.5529411764705883, 1, 0.4980392156862745],
    [0, 0.5529411764705883, 1, 1],
    [0, 0.5529411764705883, 1, 1],
    [0, 0, 0, 1],
    [1, 0, 0.8549019607843137, 0.4980392156862745],
    [1, 0, 0.8549019607843137, 1],
    [1, 0, 0.8549019607843137, 1],
    [0, 0, 0, 1]
  ];

  scatterplot.style({
    colors: [
      ['#3a78aa', '#008dff', '#008dff'],
      ['#aa3a99', '#ff00da', '#ff00da']
    ]
  });

  t.ok(
    scatterplot
      .style('colors')
      .every((color, i) => color.every((c, j) => c === rgba6[i][j])),
    'should create 8 normalized RGBAs from 6 HEX'
  );

  scatterplot.style({ colors: ['#008dff', '#ff00da'] });

  t.ok(
    scatterplot
      .style('colors')
      .every((color, i) => color.every((c, j) => c === rgba2[i][j])),
    'should create 8 normalized RGBAs from 2 HEX'
  );

  scatterplot.style({ colors: [[0, 141, 255], [255, 0, 218]] });
  t.ok(
    scatterplot
      .style('colors')
      .every((color, i) => color.every((c, j) => c === rgba2[i][j])),
    'should create 8 normalized RGBAs from 2 non-normalized RGB'
  );

  scatterplot.style({ colors: [[0, 141, 255, 127], [255, 0, 218, 127]] });
  t.ok(
    scatterplot
      .style('colors')
      .every((color, i) => color.every((c, j) => c === rgba2a[i][j])),
    'should create 8 normalized RGBAs from 2 non-normalized RGBAs'
  );
});

test('style({ opacity })', async t => {
  const scatterplot = createScatterplot({ canvas: createCanvas() });

  const opacity = 0.5;

  scatterplot.style({ opacity });

  t.equal(
    scatterplot.style('opacity'),
    opacity,
    `opacity should be set to ${opacity}`
  );

  scatterplot.style({ opacity: 0 });

  t.equal(
    scatterplot.style('opacity'),
    opacity,
    'opacity should not be nullifyable'
  );
});

test('style({ pointOutlineWidth })', async t => {
  const scatterplot = createScatterplot({ canvas: createCanvas() });

  const pointOutlineWidth = 42;

  scatterplot.style({ pointOutlineWidth });

  t.equal(
    scatterplot.style('pointOutlineWidth'),
    pointOutlineWidth,
    `pointOutlineWidth should be set to ${pointOutlineWidth}`
  );

  scatterplot.style({ pointOutlineWidth: 0 });

  t.equal(
    scatterplot.style('pointOutlineWidth'),
    pointOutlineWidth,
    'pointOutlineWidth should not be nullifyable'
  );
});

test('style({ pointSize })', async t => {
  const scatterplot = createScatterplot({ canvas: createCanvas() });

  const pointSize = 42;

  scatterplot.style({ pointSize });

  t.equal(
    scatterplot.style('pointSize'),
    pointSize,
    `pointSize should be set to ${pointSize}`
  );

  scatterplot.style({ pointSize: 0 });

  t.equal(
    scatterplot.style('pointSize'),
    pointSize,
    'pointSize should not be nullifyable'
  );
});

test('style({ pointSizeSelected })', async t => {
  const scatterplot = createScatterplot({ canvas: createCanvas() });

  const pointSizeSelected = 42;

  scatterplot.style({ pointSizeSelected });

  t.equal(
    scatterplot.style('pointSizeSelected'),
    pointSizeSelected,
    `pointSizeSelected should be set to ${pointSizeSelected}`
  );

  scatterplot.style({ pointSizeSelected: 0 });

  t.equal(
    scatterplot.style('pointSizeSelected'),
    pointSizeSelected,
    'pointSizeSelected should not be nullifyable'
  );
});
