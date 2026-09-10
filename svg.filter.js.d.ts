import { Element, List } from '@svgdotjs/svg.js'

declare module '@svgdotjs/svg.js' {
  type EffectOrString = Effect | string
  type componentsOrFn =
    | {
        r: number
        g: number
        b: number
        a: number
      }
    | number
    | ((componentTransfer: ComponentTransferEffect) => void)

  export class Filter extends Element {
    constructor(node?: SVGFilterElement)
    constructor(attr: object)

    targets(): List<Element>

    node: SVGFilterElement
    $source: 'SourceGraphic'
    $sourceAlpha: 'SourceAlpha'
    $background: 'BackgroundImage'
    $backgroundAlpha: 'BackgroundAlpha'
    $fill: 'FillPaint'
    $stroke: 'StrokePaint'
    $autoSetIn: boolean

    blend(in1: EffectOrString, in2: EffectOrString, mode: string): BlendEffect
    colorMatrix(type: string, values: Array<number> | string): ColorMatrixEffect
    componentTransfer(components: componentsOrFn): ComponentTransferEffect
    composite(
      in1: EffectOrString,
      in2: EffectOrString,
      operator: string
    ): CompositeEffect
    convolveMatrix(matrix: Array<number> | string): ConvolveMatrixEffect
    diffuseLighting(
      surfaceScale: number,
      lightingColor: string,
      diffuseConstant: number,
      kernelUnitLength: number
    ): DiffuseLightingEffect
    displacementMap(
      in1: EffectOrString,
      in2: EffectOrString,
      scale: number,
      xChannelSelector: string,
      yChannelSelector: string
    ): DisplacementMapEffect
    dropShadow(
      in1: EffectOrString,
      dx: number,
      dy: number,
      stdDeviation: number
    ): DropShadowEffect
    flood(color: string, opacity: number): FloodEffect
    gaussianBlur(x?: number, y?: number): GaussianBlurEffect
    image(src: string): ImageEffect
    merge(
      input: Array<Effect> | ((mergeEffect: MergeEffect) => void)
    ): MergeEffect
    morphology(operator: string, radius: number): MorphologyEffect
    offset(x: number, y: number): OffsetEffect
    specularLighting(
      surfaceScale: number,
      lightingColor: string,
      diffuseConstant: number,
      specularExponent: number,
      kernelUnitLength: number
    ): SpecularLightingEffect
    tile(): TileEffect
    turbulence(
      baseFrequency: number,
      numOctaves: number,
      seed: number,
      stitchTiles: string,
      type: string
    ): TurbulenceEffect
  }

  interface SVGFEDropShadowElement
    extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    readonly in1: SVGAnimatedString
    readonly dx: SVGAnimatedNumber
    readonly dy: SVGAnimatedNumber
    readonly stdDeviationX: SVGAnimatedNumber
    readonly stdDeviationY: SVGAnimatedNumber
    setStdDeviation(stdDeviationX: number, stdDeviationY: number): void
    addEventListener<K extends keyof SVGElementEventMap>(
      type: K,
      listener: (
        this: SVGFEDisplacementMapElement,
        ev: SVGElementEventMap[K]
      ) => any,
      options?: boolean | AddEventListenerOptions
    ): void
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void
    removeEventListener<K extends keyof SVGElementEventMap>(
      type: K,
      listener: (
        this: SVGFEDisplacementMapElement,
        ev: SVGElementEventMap[K]
      ) => any,
      options?: boolean | EventListenerOptions
    ): void
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void
  }

  type SVGEffectElement =
    | SVGFEBlendElement
    | SVGFEBlendElement
    | SVGFEColorMatrixElement
    | SVGFEComponentTransferElement
    | SVGFECompositeElement
    | SVGFEConvolveMatrixElement
    | SVGFEDiffuseLightingElement
    | SVGFEDisplacementMapElement
    | SVGFEDropShadowElement
    | SVGFEFloodElement
    | SVGFEGaussianBlurElement
    | SVGFEImageElement
    | SVGFEMergeElement
    | SVGFEMorphologyElement
    | SVGFEOffsetElement
    | SVGFESpecularLightingElement
    | SVGFETileElement
    | SVGFETurbulenceElement

  // Base class for all effects
  class Effect extends Element {
    constructor(node?: SVGEffectElement)
    constructor(attr: object)
    in(): Effect | string
    in(effect: Effect | string): this
    result(): string
    result(result: string): this

    blend(in2: EffectOrString, mode: string): BlendEffect
    colorMatrix(type: string, values: Array<number> | string): ColorMatrixEffect
    componentTransfer(components: componentsOrFn): ComponentTransferEffect
    composite(in2: EffectOrString, operator: string): CompositeEffect
    convolveMatrix(matrix: Array<number> | string): ConvolveMatrixEffect
    diffuseLighting(
      surfaceScale: number,
      lightingColor: string,
      diffuseConstant: number,
      kernelUnitLength: number
    ): DiffuseLightingEffect
    displacementMap(
      in2: EffectOrString,
      scale: number,
      xChannelSelector: string,
      yChannelSelector: string
    ): DisplacementMapEffect
    dropShadow(dx: number, dy: number, stdDeviation: number): DropShadowEffect
    flood(color: string, opacity: number): FloodEffect
    gaussianBlur(x?: number, y?: number): GaussianBlurEffect
    image(src: string): ImageEffect
    merge(
      input: Array<Effect> | ((mergeEffect: MergeEffect) => void)
    ): MergeEffect
    morphology(operator: string, radius: number): MorphologyEffect
    offset(x: number, y: number): OffsetEffect
    specularLighting(
      surfaceScale: number,
      lightingColor: string,
      diffuseConstant: number,
      specularExponent: number,
      kernelUnitLength: number
    ): SpecularLightingEffect
    tile(): TileEffect
    turbulence(
      baseFrequency: number,
      numOctaves: number,
      seed: number,
      stitchTiles: string,
      type: string
    ): TurbulenceEffect
  }

  interface LightEffects {
    distantLight(attr?: object | SVGFEDistantLightElement): DistantLight
    pointLight(attr?: object | SVGFEPointLightElement): PointLight
    spotLight(attr?: object | SVGFESpotLightElement): SpotLight
  }

  // The following classes are all available effects
  // which can be used with filter
  class BlendEffect extends Effect {
    constructor(node: SVGFEBlendElement)
    constructor(attr: object)

    in2(effect: EffectOrString): this
    in2(): EffectOrString
  }

  class ColorMatrixEffect extends Effect {
    constructor(node: SVGFEColorMatrixElement)
    constructor(attr: object)
  }

  class ComponentTransferEffect extends Effect {
    constructor(node: SVGFEComponentTransferElement)
    constructor(attr: object)

    funcR(attr?: object | SVGFEFuncRElement): FuncR
    funcG(attr?: object | SVGFEFuncGElement): FuncG
    funcB(attr?: object | SVGFEFuncBElement): FuncB
    funcA(attr?: object | SVGFEFuncAElement): FuncA
  }

  class CompositeEffect extends Effect {
    constructor(node: SVGFECompositeElement)
    constructor(attr: object)

    in2(effect: EffectOrString): this
    in2(): EffectOrString
  }

  class ConvolveMatrixEffect extends Effect {
    constructor(node: SVGFEConvolveMatrixElement)
    constructor(attr: object)
  }

  class DiffuseLightingEffect extends Effect implements LightEffects {
    constructor(node: SVGFEDiffuseLightingElement)
    constructor(attr: object)

    distantLight(attr?: object | SVGFEDistantLightElement): DistantLight
    pointLight(attr?: object | SVGFEPointLightElement): PointLight
    spotLight(attr?: object | SVGFESpotLightElement): SpotLight
  }

  class DisplacementMapEffect extends Effect {
    constructor(node: SVGFEDisplacementMapElement)
    constructor(attr: object)

    in2(effect: EffectOrString): this
    in2(): EffectOrString
  }

  class DropShadowEffect extends Effect {
    constructor(node: SVGFEDropShadowElement)
    constructor(attr: object)
  }

  class FloodEffect extends Effect {
    constructor(node: SVGFEFloodElement)
    constructor(attr: object)
  }

  class GaussianBlurEffect extends Effect {
    constructor(node: SVGFEGaussianBlurElement)
    constructor(attr: object)
  }

  class ImageEffect extends Effect {
    constructor(node: SVGFEImageElement)
    constructor(attr: object)
  }

  class MergeEffect extends Effect {
    constructor(node: SVGFEMergeElement)
    constructor(attr: object)

    mergeNode(attr?: object | SVGFEMergeNodeElement): MergeNode
  }

  class MorphologyEffect extends Effect {
    constructor(node: SVGFEMorphologyElement)
    constructor(attr: object)
  }

  class OffsetEffect extends Effect {
    constructor(node: SVGFEOffsetElement)
    constructor(attr: object)
  }

  class SpecularLightingEffect extends Effect {
    constructor(node: SVGFESpecularLightingElement)
    constructor(attr: object)

    distantLight(attr?: object | SVGFEDistantLightElement): DistantLight
    pointLight(attr?: object | SVGFEPointLightElement): PointLight
    spotLight(attr?: object | SVGFESpotLightElement): SpotLight
  }

  class TileEffect extends Effect {
    constructor(node: SVGFETileElement)
    constructor(attr: object)
  }

  class TurbulenceEffect extends Effect {
    constructor(node: SVGFETurbulenceElement)
    constructor(attr: object)
  }

  // These are the lightsources for the following effects:
  // - DiffuseLightingEffect
  // - SpecularLightingEffect
  class DistantLight extends Effect {
    constructor(node: SVGFEDistantLightElement)
    constructor(attr: object)
  }

  class PointLight extends Effect {
    constructor(node: SVGFEPointLightElement)
    constructor(attr: object)
  }

  class SpotLight extends Effect {
    constructor(node: SVGFESpotLightElement)
    constructor(attr: object)
  }

  // Mergenode is the element required for the MergeEffect
  class MergeNode extends Effect {
    constructor(node: SVGFEMergeNodeElement)
    constructor(attr: object)
  }

  // Component elements for the ComponentTransferEffect
  class FuncR extends Effect {
    constructor(node: SVGFEFuncRElement)
    constructor(attr: object)
  }

  class FuncG extends Effect {
    constructor(node: SVGFEFuncGElement)
    constructor(attr: object)
  }

  class FuncB extends Effect {
    constructor(node: SVGFEFuncBElement)
    constructor(attr: object)
  }

  class FuncA extends Effect {
    constructor(node: SVGFEFuncAElement)
    constructor(attr: object)
  }

  // Extensions of the core lib
  interface Element {
    filterWith(filterOrFn?: Filter | ((filter: Filter) => void)): this
    filterer(): Filter | null
    unfilter(remove?: boolean): this
  }

  interface Defs {
    filter(fn?: (filter: Filter) => void): Filter
  }

  interface Container {
    filter(fn?: (filter: Filter) => void): Filter
  }
}

export {}
