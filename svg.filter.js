// svg.filter.js 0.4 - Copyright (c) 2013-2014 Wout Fierens - Licensed under the MIT license
;(function() {

  // Main filter class
  SVG.Filter = function() {
    this.constructor.call(this, SVG.create('filter'))
  }

  // Inherit from SVG.Container
  SVG.Filter.prototype = new SVG.Parent

  //
  SVG.extend(SVG.Filter, {
    // Static strings
    source:           'SourceGraphic'
  , sourceAlpha:      'SourceAlpha'
  , background:       'BackgroundImage'
  , backgroundAlpha:  'BackgroundAlpha'
  , fill:             'FillPaint'
  , stroke:           'StrokePaint'

  , autoSetIn: true
    // Custom put method for leaner code
  , put: function(element, i) {
      this.add(element, i)

      if(!element.attr('in') && this.autoSetIn){
        element.attr('in',this.source);
      }
      if(!element.attr('result')){
        element.attr('result',element);
      }

      return element;
    }
    // Blend effect
  , blend: function(in1, in2, mode, attrs) {
      return this.put(new SVG.BlendEffect(in1,in2,mode,attrs));
    }
    // ColorMatrix effect
  , colorMatrix: function(type, values, attrs) {
      return this.put(new SVG.ColorMatrixEffect(type,values,attrs));
    }
    // ConvolveMatrix effect
  , convolveMatrix: function(matrix, attrs) {
      return this.put(new SVG.ConvolveMatrixEffect(matrix,attrs));
    }
    // ComponentTransfer effect
  , componentTransfer: function(compontents,attrs) {
      return this.put(new SVG.ComponentTransferEffect(compontents,attrs));
    }
    // Composite effect
  , composite: function(in1, in2, operator, attrs) {
      return this.put(new SVG.CompositeEffect(in1,in2,operator,attrs));;
    }
    // Flood effect
  , flood: function(color, attrs) {
      return this.put(new SVG.FloodEffect(color,attrs));
    }
    // Offset effect
  , offset: function(x, y, attrs) {
      return this.put(new SVG.OffsetEffect(x,y,attrs));
    }
    // Image effect
  , image: function(src, attrs) {
      return this.put(new SVG.ImageEffect(src,attrs));
    }
    // Merge effect
  , merge: function() {
      return this.put(new (bindConstructor(SVG.MergeEffect,arguments)));
    }
    // Gaussian Blur effect
  , gaussianBlur: function() {
      return this.put(new (bindConstructor(SVG.GaussianBlurEffect,arguments)));
    }
    // Morphology effect
  , morphology: function(operator,radius,attrs){
      return this.put(new SVG.MorphologyEffect(operator,radius,attrs));
    }
    // DiffuseLighting effect
  , diffuseLighting: function(){
      return this.put(new (bindConstructor(SVG.DiffuseLightingEffect,arguments)) );
    }
    // DisplacementMap effect
  , displacementMap: function(){
      return this.put(new (bindConstructor(SVG.DisplacementMapEffect,arguments)) );
    }
    // SpecularLighting effect
  , specularLighting: function(){
      return this.put(new (bindConstructor(SVG.SpecularLightingEffect,arguments)) );
    }
    // Tile effect
  , tile: function(){
      return this.put(new (bindConstructor(SVG.TileEffect,arguments)) );
    }
    // Turbulence effect
  , turbulence: function(){
      return this.put(new (bindConstructor(SVG.TurbulenceEffect,arguments)) );
    }
    // DistantLight effect
  , distantLight: function(){
      return this.put(new (bindConstructor(SVG.DistantLightEffect,arguments)) );
    }
    // PointLight effect
  , pointLight: function(){
      return this.put(new (bindConstructor(SVG.PointLightEffect,arguments)) );
    }
    // SpotLight effect
  , spotLight: function(){
      return this.put(new (bindConstructor(SVG.SpotLightEffect,arguments)) );
    }
    //recolor
  , addRecolor: function(color,opacity,attrs){
      opacity = opacity || 0;
      var c = new SVG.Color(color);
      var r = c.r / 255,
          g = c.g / 255,
          b = c.b / 255;

      /**
       * r' 0 0 0 0 r   r 
       * g' 0 0 0 0 g   g
       * b' = 0 0 0 0 b . b
       * a' 0 0 0 a 0   a
       * 1          1
       */
      return this.put(new SVG.ColorMatrixEffect('matrix',"0 0 0 0 " + r + " 0 0 0 0 " + g + " 0 0 0 0 " + b + " 0 0 0 " + opacity + " 0 ",attrs));
    }
  , addStroke: function(size,color,opacity,attr){
      attr = attr || {};
      return this.morphology('dilate',size).in(attr.in || this.source).addRecolor(color || this.stroke,opacity || 1).merge(attr.in || this.source).attr('result',attr.result);
    }
    // Default string value
  , toString: function() {
      return 'url(#' + this.attr('id') + ')'
    }

  })

  //
  SVG.extend(SVG.Defs, {
    // Define filter
    filter: function(block) {
      var filter = this.put(new SVG.Filter)
      
      /* invoke passed block */
      if (typeof block === 'function')
        block.call(filter, filter)
      
      return filter
    }
    
  })

  //
  SVG.extend(SVG.Container, {
    // Define filter on defs
    filter: function(block) {
      return this.defs().filter(block)
    }
    
  })

  //
  SVG.extend(SVG.Element, SVG.G, SVG.Nested, {
    // Create filter element in defs and store reference
    filter: function(block) {
      this.filterer = block instanceof SVG.Element ?
        block : this.doc().filter(block)

      if(this.doc() && this.filterer.doc() !== this.doc()){
        this.doc().defs().add(this.filterer);
      }

      this.attr('filter', this.filterer)

      return this.filterer
    }
    // Remove filter
  , unfilter: function(remove) {
      /* also remove the filter node */
      if (this.filterer && remove === true)
        this.filterer.remove()

      /* delete reference to filterer */
      delete this.filterer

      /* remove filter attribute */
      return this.attr('filter', null)
    }

  })

  // Create wrapping SVG.Effect class
  SVG.Effect = function() {}

  // Inherit from SVG.Element
  SVG.Effect.prototype = new SVG.Element

  SVG.extend(SVG.Effect, {
    // Set in attribute
    in: function(effect) {
      return this.attr('in', effect)
    }
    // Named result
  , result: function() {
      return this.attr('id') + 'Out'
    }
    // Stringification
  , toString: function() {
      return this.result()
    }

  })

  // create class for parent effects like merge
  SVG.ParentEffect = function(){}

  // Inherit from SVG.Parent
  SVG.ParentEffect.prototype = new SVG.Parent

  SVG.extend(SVG.ParentEffect, {
    // Set in attribute
    in: function(effect) {
      return this.attr('in', effect)
    }
    // Named result
  , result: function() {
      return this.attr('id') + 'Out'
    }
    // Stringification
  , toString: function() {
      return this.result()
    }
  , addRecolor: function(){
      return this.parent.addRecolor.apply(this.parent,arguments).in(this);
    }
  , addStroke: function(){
      return this.parent.addStroke.apply(this.parent,arguments).in(this);
    }

  })

  // Create all different effects
  var effects = {
    blend: function(in1,in2,mode){
      this.attr({
        in: in1,
        in2: in2,
        mode: mode || 'normal'
      })
    },
    colorMatrix: function(type,values){
      if (type == 'matrix')
        values = normaliseMatrix(values)

      this.attr({
        type:   type
      , values: typeof values == 'undefined' ? null : values
      });
    },
    convolveMatrix: function(matrix){
      matrix = normaliseMatrix(matrix)

      this.attr({
        order:        Math.sqrt(matrix.split(' ').length)
      , kernelMatrix: matrix
      });
    },
    composite: function(in1, in2, operator){
      this.attr({
        in: in1,
        in2: in2,
        operator: operator
      })
    },
    flood: function(color){
      this.attr('flood-color',color);
    },
    offset: function(x,y){
      this.attr({
        dx: x,
        dy: y
      })
    },
    image: function(src){
      this.attr('href', src, SVG.xlink)
    },
    diffuseLighting: function(){

    },
    displacementMap: function(){

    },
    gaussianBlur: function(){
      this.attr('stdDeviation', listString(Array.prototype.slice.call(arguments)))
    },
    morphology: function(operator,radius){
      this.attr({
        operator: operator,
        radius: radius
      });
    },
    specularLighting: function(){

    },
    tile: function(){

    },
    turbulence: function(){

    },
    distantLight: function(){

    },
    pointLight: function(){

    },
    spotLight: function(){

    },
  }

  // Create all parent effects
  var parentEffects = {
    merge: function(){
      //add nodes
      for(var i = 0; i < arguments.length; i++){
        this.put(arguments[i]);
      }
    },
    componentTransfer: function(compontents){
      /* create rgb set */
      this.rgb = new SVG.Set;

      /* create components */
      ;(['r', 'g', 'b', 'a']).forEach(function(c) {
        /* create component */
        this[c] = new SVG['Func' + c.toUpperCase()]().attr('type', 'identity')

        /* store component in set */
        this.rgb.add(this[c])

        /* add component node */
        this.node.appendChild(this[c].node)
      })

      /* set components */
      if (compontents) {
        if (compontents.rgb) {
          /* set bundled components */
          ;(['r', 'g', 'b']).forEach(function(c) {
            this[c].attr(compontents.rgb)
          })

          delete compontents.rgb
        }
        
        /* set individual components */
        for (var c in compontents)
          this[c].attr(compontents[c])
      }
    },
  }

  //create effects
  foreach(effects,function(effect,i){

    /* capitalize name */
    var name = i.charAt(0).toUpperCase() + i.slice(1)

    /* create class */
    SVG[name + 'Effect'] = function() {
      var attrs = arguments[arguments.length - 1];
      if(typeof attrs == 'object' && attrs.__proto__ === Object.prototype){ //make sure its a object and its prototype is Object
        Array.prototype.splice.call(arguments,arguments.length - 1, 1);
      }
      else attrs = {};

      //call super
      this.constructor.call(this, SVG.create('fe' + name))

      //call constructor for this effect, not sure about relaying on the scope, but i dont know of anything else to do
      effect.apply(this,arguments);

      this.attr(attrs);
    }

    /* inherit from SVG.Effect */
    SVG[name + 'Effect'].prototype = new SVG.Effect;

    /* make all effects interchainable */
    foreach(effects,parentEffects,function(effect,e){

      SVG[name + 'Effect'].prototype[e] = function() {
        return this.parent[e].apply(this.parent, arguments).in(this)
      }

    })
  });

  //create parent effects
  foreach(parentEffects,function(effect,i){

    /* capitalize name */
    var name = i.charAt(0).toUpperCase() + i.slice(1)

    /* create class */
    SVG[name + 'Effect'] = function() {
      var attrs = arguments[arguments.length - 1];
      if(typeof attrs == 'object' && attrs.__proto__ === Object.prototype){ //make sure its a object and its prototype is Object
        Array.prototype.splice.call(arguments,arguments.length - 1, 1);
      }
      else attrs = {};

      //call super
      this.constructor.call(this, SVG.create('fe' + name))

      //call constructor for this effect, not sure about relaying on the scope, but i dont know of anything else to do
      effect.apply(this,arguments);

      this.attr(attrs);
    }

    /* inherit from SVG.Effect */
    SVG[name + 'Effect'].prototype = new SVG.ParentEffect;

    /* make all effects interchainable */
    foreach(effects,parentEffects,function(effect,e){

      SVG[name + 'Effect'].prototype[e] = function() {
        return this.parent[e].apply(this.parent, arguments).in(this)
      }

    })
  });

  // Create compontent functions
  ;(['r', 'g', 'b', 'a']).forEach(function(c) {
    /* create class */
    SVG['Func' + c.toUpperCase()] = function() {
      this.constructor.call(this, SVG.create('feFunc' + c.toUpperCase()))
    }

    /* inherit from SVG.Element */
    SVG['Func' + c.toUpperCase()].prototype = new SVG.Element

  })


  // Effect-specific extensions
  SVG.extend(SVG.FloodEffect, {
    // implement flood-color and flood-opacity
  })

  // Presets
  SVG.filter = {
    sepiatone:  [ .343, .669, .119, 0, 0 
                , .249, .626, .130, 0, 0
                , .172, .334, .111, 0, 0
                , .000, .000, .000, 1, 0 ]
  }

  // Helpers
  function normaliseMatrix(matrix) {
    /* convert possible array value to string */
    if (Array.isArray(matrix))
      matrix = new SVG.Array(matrix)

    /* ensure there are no leading, tailing or double spaces */
    return matrix.toString().replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/g, ' ')
  }

  function listString(list) {
    if (!Array.isArray(list))
      return list

    for (var i = 0, l = list.length, s = []; i < l; i++)
      s.push(list[i])

    return s.join(' ')
  }

  function foreach(){ //loops through mutiple objects
    var fn = function(){};
    if(typeof arguments[arguments.length-1] == 'function'){
      fn = arguments[arguments.length-1]
      Array.prototype.splice.call(arguments,arguments.length-1,1);
    }
    for(var k in arguments){
      for(var i in arguments[k]){
        fn(arguments[k][i],i,arguments[k]);
      }
    }
  }

  function bindConstructor(fn,args){
    Array.prototype.splice.call(args,0,0,null);
    return fn.bind.apply( fn, args );
  }

}).call(this);