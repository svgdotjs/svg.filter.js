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
      return this.put(new (bindConstructor(SVG.BlendEffect,arguments)) );
    }
    // ColorMatrix effect
  , colorMatrix: function(type, values, attrs) {
      return this.put(new (bindConstructor(SVG.ColorMatrixEffect, arguments)) );
    }
    // ConvolveMatrix effect
  , convolveMatrix: function(matrix, attrs) {
      return this.put(new (bindConstructor(SVG.ConvolveMatrixEffect, arguments)) );
    }
    // ComponentTransfer effect
  , componentTransfer: function(compontents,attrs) {
      return this.put(new (bindConstructor(SVG.ComponentTransferEffect, arguments)) );
    }
    // Composite effect
  , composite: function(in1, in2, operator, attrs) {
      return this.put(new (bindConstructor(SVG.CompositeEffect, arguments)) );
    }
    // Flood effect
  , flood: function(color, attrs) {
      return this.put(new (bindConstructor(SVG.FloodEffect, arguments)) );
    }
    // Offset effect
  , offset: function(x, y, attrs) {
      return this.put(new (bindConstructor(SVG.OffsetEffect, arguments)) );
    }
    // Image effect
  , image: function(src, attrs) {
      return this.put(new (bindConstructor(SVG.ImageEffect, arguments)) );
    }
    // Merge effect
  , merge: function() {
      return this.put(new (bindConstructor(SVG.MergeEffect,arguments)) );
    }
    // Gaussian Blur effect
  , gaussianBlur: function(x,y,attrs) {
      return this.put(new (bindConstructor(SVG.GaussianBlurEffect,arguments)) );
    }
    // Morphology effect
  , morphology: function(operator,radius,attrs){
      return this.put(new (bindConstructor(SVG.MorphologyEffect,arguments)) );
    }
    // DiffuseLighting effect
  , diffuseLighting: function(surfaceScale,diffuseConstant,kernelUnitLength,attrs){
      return this.put(new (bindConstructor(SVG.DiffuseLightingEffect,arguments)) );
    }
    // DisplacementMap effect
  , displacementMap: function(in1,in2,scale,xChannelSelector,yChannelSelector,attrs){
      return this.put(new (bindConstructor(SVG.DisplacementMapEffect,arguments)) );
    }
    // SpecularLighting effect
  , specularLighting: function(surfaceScale,diffuseConstant,specularExponent,kernelUnitLength,attrs){
      return this.put(new (bindConstructor(SVG.SpecularLightingEffect,arguments)) );
    }
    // Tile effect
  , tile: function(){
      return this.put(new (bindConstructor(SVG.TileEffect,arguments)) );
    }
    // Turbulence effect
  , turbulence: function(baseFrequency,numOctaves,seed,stitchTiles,type,attrs){
      return this.put(new (bindConstructor(SVG.TurbulenceEffect,arguments)) );
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
      return this.attr('result') || this.attr('id') + 'Out'
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

  })

  SVG.ChildEffect = function(){};

  SVG.ChildEffect.prototype = new SVG.Element;

  SVG.extend(SVG.ChildEffect,{
    in: function(effect){
      this.attr('in',effect);
    }
    //dont include any "result" functions because these types of nodes dont have them
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
    displacementMap: function(in1,in2,scale,xChannelSelector,yChannelSelector){
      this.attr({
        in: in1,
        in2: in2,
        scale: scale,
        xChannelSelector: xChannelSelector,
        yChannelSelector: yChannelSelector
      })
    },
    gaussianBlur: function(x,y){
      this.attr('stdDeviation', listString(Array.prototype.slice.call(arguments)))
    },
    morphology: function(operator,radius){
      this.attr({
        operator: operator,
        radius: radius
      });
    },
    tile: function(){

    },
    turbulence: function(baseFrequency,numOctaves,seed,stitchTiles,type){
      this.attr({
        numOctaves: numOctaves,
        seed: seed,
        stitchTiles: stitchTiles,
        baseFrequency: baseFrequency,
        type: type
      })
    }
  }

  // Create all parent effects
  var parentEffects = {
    merge: function(){
      //add nodes
      for(var i = 0; i < arguments.length; i++){
        this.put(new SVG.MergeNode(arguments[i]));
      }
    },
    componentTransfer: function(compontents){
      /* create rgb set */
      this.rgb = new SVG.Set;

      /* create components */
      ;(['r', 'g', 'b', 'a']).forEach(function(c) {
        /* create component */
        this[c] = new SVG['Func' + c.toUpperCase()]('identity');

        /* store component in set */
        this.rgb.add(this[c])

        /* add component node */
        this.node.appendChild(this[c].node)
      }.bind(this)) //lost context in foreach

      /* set components */
      if (compontents) {
        if (compontents.rgb) {
          /* set bundled components */
          ;(['r', 'g', 'b']).forEach(function(c) {
            this[c].attr(compontents.rgb)
          }.bind(this))

          delete compontents.rgb
        }
        
        /* set individual components */
        for (var c in compontents)
          this[c].attr(compontents[c])
      }
    },
    diffuseLighting: function(surfaceScale,diffuseConstant,kernelUnitLength){
      this.attr({
        surfaceScale: surfaceScale,
        diffuseConstant: diffuseConstant,
        kernelUnitLength: kernelUnitLength
      })
    },
    specularLighting: function(surfaceScale,diffuseConstant,specularExponent,kernelUnitLength){
      this.attr({
        surfaceScale: surfaceScale,
        diffuseConstant: diffuseConstant,
        specularExponent: specularExponent,
        kernelUnitLength: kernelUnitLength
      })
    },
  }

  // Create child effects like PointLight and MergeNode
  var childEffects = {
    distantLight: function(azimuth, elevation){
      this.attr({
        azimuth: azimuth,
        elevation: elevation
      })
    },
    pointLight: function(x,y,z){
      this.attr({
        x: x,
        y: y,
        z: z
      })
    },
    spotLight: function(x,y,z,pointsAtX,pointsAtY,pointsAtZ){
      this.attr({
        x: x,
        y: y,
        z: z,
        pointsAtX: pointsAtX,
        pointsAtY: pointsAtY,
        pointsAtZ: pointsAtZ
      })
    },
    mergeNode: function(in1){
      this.attr('in',in1);
    }
  }

  // Create compontent functions
  ;(['r', 'g', 'b', 'a']).forEach(function(c) {
    /* create class */
    childEffects['Func' + c.toUpperCase()] = function(type) {
      this.attr('type',type);

      // take diffent arguments based on the type
      switch(type){
        case 'table':
          this.attr('tableValues',arguments[1])
          break;
        case 'linear':
          this.attr('slope',arguments[1])
          this.attr('intercept',arguments[2])
          break;
        case 'gamma':
          this.attr('amplitude',arguments[1])
          this.attr('exponent',arguments[2])
          this.attr('offset',arguments[2])
          break;
      }
    }

  })

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

      //call constructor for this effect
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
      //see if theres a children array
      var children = arguments[arguments.length - 1];
      if(typeof children == 'object' && children.__proto__ === Array.prototype){ //make sure its a object and its prototype is Object
        Array.prototype.splice.call(arguments,arguments.length - 1, 1);
      }
      else children = [];

      var attrs = arguments[arguments.length - 1];
      if(typeof attrs == 'object' && attrs.__proto__ === Object.prototype){ //make sure its a object and its prototype is Object
        Array.prototype.splice.call(arguments,arguments.length - 1, 1);
      }
      else attrs = {};

      //call super
      this.constructor.call(this, SVG.create('fe' + name))

      //call constructor for this effect
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

  //create child effects
  foreach(childEffects,function(effect,i){

    /* capitalize name */
    var name = i.charAt(0).toUpperCase() + i.slice(1)

    /* create class */
    SVG[name] = function() {
      // get attrs
      var attrs = arguments[arguments.length - 1];
      if(typeof attrs == 'object' && attrs.__proto__ === Object.prototype){ //make sure its a object and its prototype is Object
        Array.prototype.splice.call(arguments,arguments.length - 1, 1);
      }
      else attrs = {};

      //call super
      this.constructor.call(this, SVG.create('fe' + name))

      //call constructor for this effect
      effect.apply(this,arguments);

      this.attr(attrs);
    }

    /* inherit from SVG.Effect */
    SVG[name].prototype = new SVG.Effect;
  });

  // Effect-specific extensions
  SVG.extend(SVG.FloodEffect, {
    // implement flood-color and flood-opacity
  })

  SVG.extend(SVG.MergeEffect,{
    in: function(effect){
      this.put(new SVG.MergeNode(effect)).back();
    }
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