import {Element, List} from '@svgdotjs/svg.js'

declare module "@svgdotjs/svg.js" {

  type EffectOrString = Effect | string
  type componentsOrFn = {
    r: number,
    g: number,
    b: number,
    a: number
  } | number | ((componentTransfer: ComponentTransferEffect) => void)

  export class Filter extends Element {
    constructor (node?: SVGFilterElement)
    constructor (attr: Object)

    targets (): List<Element>

    node: SVGFilterElement
    $source: 'SourceGraphic'
    $sourceAlpha: 'SourceAlpha'
    $background: 'BackgroundImage'
    $backgroundAlpha: 'BackgroundAlpha'
    $fill: 'FillPaint'
    $stroke: 'StrokePaint'
    $autoSetIn: boolean

    blend (in1: EffectOrString, in2: EffectOrString, mode: string): BlendEffect
    colorMatrix (type: string, values: Array<number> | string ): ColorMatrixEffect
    componentTransfer (components: componentsOrFn): ComponentTransferEffect
    composite (in1: EffectOrString, in2: EffectOrString, operator: string): CompositeEffect
    convolveMatrix (matrix: Array<number> | string): ConvolveMatrixEffect
    diffuseLighting (surfaceScale: number, lightingColor: string, diffuseConstant: number, kernelUnitLength: number): DiffuseLightingEffect
    displacementMap (in1: EffectOrString, in2: EffectOrString, scale: number, xChannelSelector: string, yChannelSelector: string): DisplacementMapEffect
    dropShadow (in1: EffectOrString, dx: number, dy: number, stdDeviation: number): DropShadowEffect
    flood (color: string, opacity: number): FloodEffect
    gaussianBlur (x: number, y: number): GaussianBlurEffect
    image (src: string): ImageEffect
    merge (input: Array<Effect> | ((mergeEffect: MergeEffect) => void)): MergeEffect
    morphology (operator: string, radius: number): MorphologyEffect
    offset (x: number, y: number): OffsetEffect
    specularLighting (surfaceScale: number, lightingColor: string, diffuseConstant: number, specularExponent: number, kernelUnitLength: number): SpecularLightingEffect
    tile (): TileEffect
    turbulence (baseFrequency: number, numOctaves: number, seed: number, stitchTiles: string, type: string): TurbulenceEffect
  }

  interface SVGFEDropShadowElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    readonly in1: SVGAnimatedString;
    readonly dx: SVGAnimatedNumber;
    readonly dy: SVGAnimatedNumber;
    readonly stdDeviationX: SVGAnimatedNumber;
    readonly stdDeviationY: SVGAnimatedNumber;
    setStdDeviation(stdDeviationX: number, stdDeviationY: number): void;
    addEventListener<K extends keyof SVGElementEventMap>(type: K, listener: (this: SVGFEDisplacementMapElement, ev: SVGElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof SVGElementEventMap>(type: K, listener: (this: SVGFEDisplacementMapElement, ev: SVGElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  }

  type SVGEffectElement =
    SVGFEBlendElement |
    SVGFEBlendElement |
    SVGFEColorMatrixElement |
    SVGFEComponentTransferElement |
    SVGFECompositeElement |
    SVGFEConvolveMatrixElement |
    SVGFEDiffuseLightingElement |
    SVGFEDisplacementMapElement |
    SVGFEDropShadowElement |
    SVGFEFloodElement |
    SVGFEGaussianBlurElement |
    SVGFEImageElement |
    SVGFEMergeElement |
    SVGFEMorphologyElement |
    SVGFEOffsetElement |
    SVGFESpecularLightingElement |
    SVGFETileElement |
    SVGFETurbulenceElement

  // Base class for all effects
  class Effect extends Element {
    constructor (node?: SVGEffectElement)
    constructor (attr: Object)
    in (): Effect | string
    in (effect: Effect | string): this
    result (): string
    result (result: string): this

    blend (in2: EffectOrString, mode: string): BlendEffect
    colorMatrix (type: string, values: Array<number> | string ): ColorMatrixEffect
    componentTransfer (components: componentsOrFn): ComponentTransferEffect
    composite (in2: EffectOrString, operator: string): CompositeEffect
    convolveMatrix (matrix: Array<number> | string): ConvolveMatrixEffect
    diffuseLighting (surfaceScale: number, lightingColor: string, diffuseConstant: number, kernelUnitLength: number): DiffuseLightingEffect
    displacementMap (in2: EffectOrString, scale: number, xChannelSelector: string, yChannelSelector: string): DisplacementMapEffect
    dropShadow (dx: number, dy: number, stdDeviation: number): DropShadowEffect
    flood (color: string, opacity: number): FloodEffect
    gaussianBlur (x: number, y: number): GaussianBlurEffect
    image (src: string): ImageEffect
    merge (input: Array<Effect> | ((mergeEffect: MergeEffect) => void)): MergeEffect
    morphology (operator: string, radius: number): MorphologyEffect
    offset (x: number, y: number): OffsetEffect
    specularLighting (surfaceScale: number, lightingColor: string, diffuseConstant: number, specularExponent: number, kernelUnitLength: number): SpecularLightingEffect
    tile (): TileEffect
    turbulence (baseFrequency: number, numOctaves: number, seed: number, stitchTiles: string, type: string): TurbulenceEffect
  }

  interface LightEffects {
    distantLight (attr?: Object | SVGFEDistantLightElement): DistantLight
    pointLight (attr?: Object | SVGFEPointLightElement): PointLight
    spotLight (attr?: Object | SVGFESpotLightElement): SpotLight
  }

  // The following classes are all available effects
  // which can be used with filter
  class BlendEffect extends Effect {
    constructor (node: SVGFEBlendElement)
    constructor (attr: Object)

    in2 (effect: EffectOrString): this
    in2 (): EffectOrString
  }

  class ColorMatrixEffect extends Effect {
    constructor (node: SVGFEColorMatrixElement)
    constructor (attr: Object)
  }

  class ComponentTransferEffect extends Effect {
    constructor (node: SVGFEComponentTransferElement)
    constructor (attr: Object)

    funcR (attr?: Object | SVGFEFuncRElement): FuncR
    funcG (attr?: Object | SVGFEFuncGElement): FuncG
    funcB (attr?: Object | SVGFEFuncBElement): FuncB
    funcA (attr?: Object | SVGFEFuncAElement): FuncA
  }

  class CompositeEffect extends Effect {
    constructor (node: SVGFECompositeElement)
    constructor (attr: Object)

    in2 (effect: EffectOrString): this
    in2 (): EffectOrString
  }

  class ConvolveMatrixEffect extends Effect {
    constructor (node: SVGFEConvolveMatrixElement)
    constructor (attr: Object)
  }

  class DiffuseLightingEffect extends Effect implements LightEffects {
    constructor (node: SVGFEDiffuseLightingElement)
    constructor (attr: Object)

    distantLight (attr?: Object | SVGFEDistantLightElement): DistantLight
    pointLight (attr?: Object | SVGFEPointLightElement): PointLight
    spotLight (attr?: Object | SVGFESpotLightElement): SpotLight
  }

  class DisplacementMapEffect extends Effect {
    constructor (node: SVGFEDisplacementMapElement)
    constructor (attr: Object)

    in2 (effect: EffectOrString): this
    in2 (): EffectOrString
  }

  class DropShadowEffect extends Effect {
    constructor (node: SVGFEDropShadowElement)
    constructor (attr: Object)
  }

  class FloodEffect extends Effect {
    constructor (node: SVGFEFloodElement)
    constructor (attr: Object)
  }

  class GaussianBlurEffect extends Effect {
    constructor (node: SVGFEGaussianBlurElement)
    constructor (attr: Object)
  }

  class ImageEffect extends Effect {
    constructor (node: SVGFEImageElement)
    constructor (attr: Object)
  }

  class MergeEffect extends Effect {
    constructor (node: SVGFEMergeElement)
    constructor (attr: Object)

    mergeNode (attr?: Object | SVGFEMergeNodeElement): MergeNode
  }

  class MorphologyEffect extends Effect {
    constructor (node: SVGFEMorphologyElement)
    constructor (attr: Object)
  }

  class OffsetEffect extends Effect {
    constructor (node: SVGFEOffsetElement)
    constructor (attr: Object)
  }

  class SpecularLightingEffect extends Effect {
    constructor (node: SVGFESpecularLightingElement)
    constructor (attr: Object)

    distantLight (attr?: Object | SVGFEDistantLightElement): DistantLight
    pointLight (attr?: Object | SVGFEPointLightElement): PointLight
    spotLight (attr?: Object | SVGFESpotLightElement): SpotLight
  }

  class TileEffect extends Effect {
    constructor (node: SVGFETileElement)
    constructor (attr: Object)
  }

  class TurbulenceEffect extends Effect {
    constructor (node: SVGFETurbulenceElement)
    constructor (attr: Object)
  }



  // These are the lightsources for the following effects:
  // - DiffuseLightingEffect
  // - SpecularLightingEffect
  class DistantLight extends Effect {
    constructor (node: SVGFEDistantLightElement)
    constructor (attr: Object)
  }

  class PointLight extends Effect {
    constructor (node: SVGFEPointLightElement)
    constructor (attr: Object)
  }

  class SpotLight extends Effect {
    constructor (node: SVGFESpotLightElement)
    constructor (attr: Object)
  }

  // Mergenode is the element required for the MergeEffect
  class MergeNode extends Effect {
    constructor (node: SVGFEMergeNodeElement)
    constructor (attr: Object)
  }

  // Component elements for the ComponentTransferEffect
  class FuncR extends Effect {
    constructor (node: SVGFEFuncRElement)
    constructor (attr: Object)
  }

  class FuncG extends Effect {
    constructor (node: SVGFEFuncGElement)
    constructor (attr: Object)
  }

  class FuncB extends Effect {
    constructor (node: SVGFEFuncBElement)
    constructor (attr: Object)
  }

  class FuncA extends Effect {
    constructor (node: SVGFEFuncAElement)
    constructor (attr: Object)
  }



  // Extensions of the core lib
  interface Element {
    filterWith(filterOrFn?: Filter | ((filter: Filter) => void)): this
    filterer(): Filter | null
    unfilter(): this
  }

  interface Defs {
    filter(fn?: (filter: Filter) => void): Filter
  }

  interface Container {
    filter(fn?: (filter: Filter) => void): Filter
  }
}
