/// <reference types="vite/client" />

declare module 'three' {
  export const SRGBColorSpace: any

  export class Clock {
    getDelta(): number
  }

  export class Scene {
    add(...objects: any[]): void
  }

  export class Camera {
    position: any
  }

  export class PerspectiveCamera extends Camera {
    constructor(...args: any[])
  }

  export class WebGLRenderer {
    domElement: HTMLElement
    shadowMap: { enabled: boolean }
    outputColorSpace: any
    constructor(...args: any[])
    render(...args: any[]): void
    setClearAlpha(alpha: number): void
    setSize(width: number, height: number): void
  }

  export class AmbientLight {
    constructor(...args: any[])
  }

  export class DirectionalLight {
    position: any
    castShadow: boolean
    shadow: { mapSize: any }
    constructor(...args: any[])
  }

  export class Vector2 {
    constructor(...args: any[])
  }

  export class Mesh {
    material: any
    currentHex?: number
  }
}

declare module 'three/examples/jsm/controls/OrbitControls' {
  export class OrbitControls {
    target: any
    minPolarAngle: number
    maxPolarAngle: number
    enableDamping: boolean
    dampingFactor: number
    minDistance: number
    maxDistance: number
    constructor(...args: any[])
    update(): void
  }
}

declare module 'three/examples/jsm/loaders/DRACOLoader' {
  export class DRACOLoader {
    setDecoderConfig(config: any): void
    setDecoderPath(path: string): void
  }
}

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  export interface GLTF {
    scene: any
  }

  export class GLTFLoader {
    setDRACOLoader(loader: any): void
    load(url: string, onLoad: (gltf: GLTF) => void): void
  }
}

declare module 'three/examples/jsm/renderers/CSS2DRenderer' {
  export class CSS2DObject {
    position: any
    constructor(element: any)
  }

  export class CSS2DRenderer {
    domElement: HTMLElement
    render(...args: any[]): void
    setSize(width: number, height: number): void
  }
}

declare module 'three/examples/jsm/libs/tween.module.js' {
  const TWEEN: any
  export default TWEEN
}
