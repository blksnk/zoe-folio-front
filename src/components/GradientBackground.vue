<script setup lang="ts">
import { Application } from '@pixi/app';
import { Sprite } from '@pixi/sprite';
import { Filter, Texture } from '@pixi/core';
import { BLEND_MODES } from '@pixi/constants';
import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';
import { OldFilmFilter } from '@pixi/filter-old-film';
import { TwistFilter } from '@pixi/filter-twist';

import { onMounted, onBeforeUnmount, ref } from 'vue';
import { Point } from '@pixi/math';
import { useMouseData } from '@/store/mouseData';
import { useGradientData } from '@/store/gradientData';

import fragmentShader from '../shaders/gradient.frag';
import { useResponsiveData } from '@/store/responsiveData';

const responsiveData = useResponsiveData();
const mouseData = useMouseData();
const gradientData = useGradientData();

let app: Application;
const MaxCanvasWidth = responsiveData.getValue({
  default: window.innerWidth / 2,
  tablet: window.innerWidth / 2,
  mobile: window.innerWidth,
});
let tick = 0;

const generateDimensions = (): { width: number; height: number } => {
  const ratio = window.innerWidth / window.innerHeight;
  const width = Math.min(window.innerWidth, MaxCanvasWidth);
  const height = Math.min(window.innerHeight, MaxCanvasWidth / ratio);
  return { width, height };
};

const dimensions = ref<{ width: number; height: number }>(generateDimensions());

const gradientFilter = new Filter(undefined, fragmentShader, {
  iResolution: {
    x: dimensions.value.width,
    y: dimensions.value.height,
  },
  u_colors: gradientData.uniforms,
  u_colorsCount: gradientData.colors.length,
});

const twistFilter = new TwistFilter({
  radius: Math.max(window.innerWidth / 2, window.innerHeight / 2),
  angle: 2,
  offset: new Point(window.innerWidth / 2, window.innerHeight / 2),
});

const noiseSize = 0.2;

console.log(noiseSize);

const noiseFilter = new OldFilmFilter({
  sepia: 0,
  scratch: 0,
  scratchDensity: 0,
  noise: 0.05,
  noiseSize,
  vignetting: 0,
});
noiseFilter.blendMode = BLEND_MODES.DARKEN;
// noiseFilter.resolution = 0.2

const gradientSprite = new Sprite(Texture.WHITE);
gradientSprite.width = dimensions.value.width;
gradientSprite.height = dimensions.value.height;

gradientSprite.filters = [gradientFilter];

const initPixi = () => {
  const canvas = document.getElementById('blur-gradient');

  // initPixiPlugins()
  // const { width, height } = generateDimensions();

  if (canvas) {
    app = new Application({
      width: dimensions.value.width,
      height: dimensions.value.height,
      // antialias: true,
      backgroundAlpha: 0,
      view: canvas as HTMLCanvasElement,
      //resizeTo: window,
      // autoStart: false
    });

    app.stage.addChild(gradientSprite);
    // app.stage.addChild(cursorShape);

    app.stage.filters = [
      // gradientFilter,
      new KawaseBlurFilter(10, 3, true),
      twistFilter,
      noiseFilter,
    ];
    // app.render()
    // noiseFilter.seed = Math.random() * 0.01;

    app.ticker.add(onFrame);
  }
};

const onResize = () => {
  // const { width, height } = generateDimensions();
  dimensions.value = generateDimensions();
  app.renderer.resize(dimensions.value.width, dimensions.value.height);
  gradientSprite.width = dimensions.value.width;
  gradientSprite.height = dimensions.value.height;
  gradientFilter.uniforms.iResolution.x = dimensions.value.width;
  gradientFilter.uniforms.iResolution.y = dimensions.value.height;
  app.renderer.render(app.stage);
};

const onFrame = () => {
  // cursorShape.clear();
  // gradientFilter.uniforms.iResolution.x = window.innerWidth;
  // gradientFilter.uniforms.iResolution.y = window.innerHeight;
  gradientFilter.uniforms.u_colors = gradientData.uniforms;

  const sin = Math.sin(tick / 60);
  twistFilter.angle = 4 * mouseData.normalizedMousePos.x + sin / 2;

  if (tick % 8 === 0) {
    noiseFilter.seed = Math.random() * 0.01;
  }
  twistFilter.uniforms.offset.x =
    dimensions.value.width / 2 +
    sin * 100 +
    (mouseData.normalizedMousePos.x * dimensions.value.width) / 4;
  twistFilter.uniforms.offset.y =
    dimensions.value.height / 2 +
    sin * 100 +
    (mouseData.normalizedMousePos.y * dimensions.value.height) / 4;

  tick++;
};

onMounted(() => {
  initPixi();

  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  app.ticker.remove(onFrame);
  window.removeEventListener('resize', onResize);
  app.destroy();
});
</script>

<template>
  <canvas id="blur-gradient"></canvas>
</template>

<style scoped lang="sass">
#blur-gradient
  width: 100%
  height: 100%
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 0
  backface-visibility: visible
  transform: translate3d(0, 0, 0)
</style>
