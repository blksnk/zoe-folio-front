import { Vector2 } from '@/utils/gestures';
import { defineStore } from 'pinia';

export interface MouseProps {
  [k: string]: any;
  mousePos: Vector2;
  targetMousePos: Vector2;
  lastMousePos: Vector2;
  mouseDown: boolean;
}

export const useMouseData = defineStore('mouseData', {
  state: (): MouseProps => ({
    mousePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    targetMousePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    lastMousePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    mouseDown: false,
  }),
  getters: {
    normalizedMousePos: (state): Vector2 => ({
      x: (state.mousePos.x / window.innerWidth - 0.5) * 2,
      y: (state.mousePos.y / window.innerHeight - 0.5) * 2,
    }),
    mouseDelta: (state): Vector2 => ({
      x: state.targetMousePos.x - state.mousePos.x,
      y: state.targetMousePos.y - state.mousePos.y,
    }),
  },
  actions: {
    setMousePos(newVec: Vector2) {
      this.mousePos = newVec;
    },
    updateStore(key: string, v: unknown) {
      this[key] = v;
    },
  },
});
