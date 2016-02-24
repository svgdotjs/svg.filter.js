describe('Filter', function() {
  var rect

  beforeEach(function() {
    rect = draw.rect()
  })

  afterEach(function() {
    draw.clear()
  })

  it('should extend SVG.Parent',function(){
    expect(SVG.Filter.prototype.__proto__).toBe(SVG.Parent.prototype)
  })

  it('creates the filter() method on elements', function() {
    expect(draw.filter() instanceof SVG.Filter).toBe(true)
  })

  describe('source', function() {
    it('returns "SourceGraphic" string', function() {
      rect.filter(function(add) {
        expect(add.source).toBe('SourceGraphic')
      })
    })
  })

  describe('alpha', function() {
    it('returns "SourceAlpha" string', function() {
      rect.filter(function(add) {
        expect(add.sourceAlpha).toBe('SourceAlpha')
      })
    })
  })

})

describe('Effect', function() {
  beforeAll(function() {
    this.filter = new SVG.Filter()
    this.blur = this.filter.gaussianBlur()
  })

  it('has the filter type stored in the instance', function() {
    expect(this.blur.type).toBe('feGaussianBlur')
  })

  it('are interchainable', function() {
    var filter = new SVG.Filter()
    filter.gaussianBlur(3).merge(filter.source).offset(10);
    expect(filter.get(1).get(0).attr('in')).toBe(filter.get(0).result());
    expect(filter.get(2).attr('in')).toBe(filter.get(1).result());
  })

  it('result is set when effect it created', function() {
    var offset = new SVG.OffsetEffect(10)
    expect(offset.attr('result')).not.toBeUndefined()
  });

  describe('result()', function() {
    it('returns the output name containing the element id', function() {
      expect(this.blur.result()).toBe(this.blur.attr('id') + 'Out')
    })

    it('works as a setter',function(){
      var a = this.blur.result();
      this.blur.result('test-result');
      expect(this.blur.attr('result')).toBe('test-result');
      expect(this.blur.result()).toBe('test-result');
      this.blur.attr('result',a);
    })

    it('works as a getter', function(){
      expect(this.blur.result()).toBe(this.blur.attr('result'))
    })
  })

  describe('in()', function() {
    it('sets effects \'in\' attr', function() {
      this.blur.in('testing')
      expect(this.blur.attr('in')).toBe('testing');
    })

    it('returns an effect with a matching \'result\' attr', function() {
      otherEffect = this.filter.offset(10)
      this.blur.in(otherEffect)
      expect(this.blur.in()).toBe(otherEffect)
      otherEffect.remove()
    })

    it('returns the attr value if no effect with has a matching \'result\' attr', function() {
      this.blur.in('testing')
      expect(this.blur.in()).toBe('testing');
    })

    it('still works when effect has no parent', function() {
      this.blur.remove()
      this.blur.in('testing-parent')
      expect(this.blur.in()).toBe('testing-parent')
      this.filter.add(this.blur)
    });
  })

  describe('in2() *only on a few effects*', function() {
    beforeAll(function(){
      this.composite = this.blur.composite(this.filter.sourceAlpha)
    })

    afterAll(function(){
      this.composite.remove();
    })

    it('sets effects \'in2\' attr', function() {
      this.composite.in2('testing')
      expect(this.composite.attr('in2')).toBe('testing')
      this.composite.in2(this.filter.sourceAlpha)
    })

    it('returns an effect with a matching \'result\' attr', function() {
      otherEffect = this.filter.offset(10)
      this.composite.in2(otherEffect)
      expect(this.composite.in2()).toBe(otherEffect)
      this.composite.in2(this.filter.sourceAlpha)
      otherEffect.remove()
    })

    it('returns the attr value if no effect with has a matching \'result\' attr', function() {
      this.composite.in2('testing')
      expect(this.composite.in2()).toBe('testing');
      this.composite.in2(this.filter.sourceAlpha)
    })

    it('still works when effect has no parent', function() {
      this.composite.remove()
      this.composite.in2('testing-parent')
      expect(this.composite.in2()).toBe('testing-parent')
      this.composite.in2(this.filter.sourceAlpha)
      this.filter.add(this.composite)
    });
  });

  describe('toString()', function() {
    it('is an alias to the result() method', function() {
      expect(this.blur.toString()).toBe(this.blur.result())
    })
  })
})

describe('effects',function(){
  describe('MergeEffect', function() {
    it('pass an Array in, new SVG.MergeEffect(["id",anotherEffect])', function() {
      var effect = new SVG.MergeEffect(['some-id','another-id'])
      expect(effect.get(0).attr('in')).toBe('some-id')
      expect(effect.get(1).attr('in')).toBe('another-id')
    })

    it('pass arguments in, new SVG.MergeEffect("some-id",effect)', function() {
      var effect = new SVG.MergeEffect('some-id','another-id')
      expect(effect.get(0).attr('in')).toBe('some-id')
      expect(effect.get(1).attr('in')).toBe('another-id')
    })

    it('pass a SVG.Set of SVG.Effects in', function() {
      var filter = new SVG.Filter()
      var set = new SVG.Set()
      set.add(filter.flood('black'))
      set.add(filter.offset(10))

      var effect = filter.merge(set)
      expect(effect.children().length).toBe(2)
      expect(effect.get(0).attr('in')).toBe(set.get(0).result())
      expect(effect.get(1).attr('in')).toBe(set.get(1).result())
    })

    it('when .in() is called it prepends a MergeNode', function() {
      var effect = new SVG.MergeEffect('first-id')
      effect.in('insert-id')
      expect(effect.get(0).attr('in')).toBe('insert-id')
    })

    it('when chaining its first input is set to the effect before it', function() {
      var filter = new SVG.Filter();
      filter.offset(10).merge(filter.source);
      expect(filter.get(1).get(0).attr('in')).toBe(filter.get(0).result())
    });
  })

  describe('Composite', function() {
    beforeAll(function(){
      this.filter = new SVG.Filter();
      this.filter.offset(10).composite(this.filter.source);
    })

    it('when chaining its first input is set to the effect before it', function() {
      expect(this.filter.get(1).attr('in')).toBe(this.filter.get(0).result())
    })

    it('when chaining its second input is set to the first argument', function() {
      expect(this.filter.get(1).attr('in2')).toBe(this.filter.source)
    })
  })

  describe('BlendEffect', function() {
    beforeAll(function(){
      this.filter = new SVG.Filter();
      this.filter.offset(10).blend(this.filter.source);
    })

    it('when chaining its first input is set to the effect before it', function() {
      expect(this.filter.get(1).attr('in')).toBe(this.filter.get(0).result())
    })

    it('when chaining its second input is set to the first argument', function() {
      expect(this.filter.get(1).attr('in2')).toBe(this.filter.source)
    })
  })

  describe('DisplacementMap', function() {
    beforeAll(function(){
      this.filter = new SVG.Filter();
      this.filter.offset(10).displacementMap(this.filter.source);
    })

    it('when chaining its first input is set to the effect before it', function() {
      expect(this.filter.get(1).attr('in')).toBe(this.filter.get(0).result())
    })

    it('when chaining its second input is set to the first argument', function() {
      expect(this.filter.get(1).attr('in2')).toBe(this.filter.source)
    })
  })
})

describe('ChildEffect',function(){
  it('dose not have a result function', function() {
    var effect = new SVG.MergeNode('testing')
    expect(effect.result).toBeUndefined()
  })
})

describe('ParentEffect',function(){
  it('should extend SVG.Parent',function(){
    expect(SVG.ParentEffect.prototype.__proto__).toBe(SVG.Parent.prototype)
  })
})
