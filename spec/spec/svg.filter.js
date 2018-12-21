describe('Filter', function() {
  var rect
  beforeEach(function() {
    rect = canvas.rect()
  })

  afterEach(function() {
    canvas.clear()
  })

  it('creates the filter() method on elements', function() {
    expect(canvas.filter()).toEqual(jasmine.any(SVG.Filter))
  })

  describe('source', function() {
    it('returns "SourceGraphic" string', function() {
      rect.filterWith(function(add) {
        expect(add.source).toBe('SourceGraphic')
      })
    })
  })

  describe('alpha', function() {
    it('returns "SourceAlpha" string', function() {
      rect.filterWith(function(add) {
        expect(add.sourceAlpha).toBe('SourceAlpha')
      })
    })
  })

})

describe('Effect', function() {
  var filter, blur

  beforeAll(function() {
    filter = new SVG.Filter()
    blur = filter.gaussianBlur()
  })

  it('has the filter type stored in the instance', function() {
    expect(blur.type).toBe('feGaussianBlur')
  })

  it('are interchainable', function() {
    var filter = new SVG.Filter()
    filter.gaussianBlur(3).merge(filter.source).offset(10);
    expect(filter.get(1).get(0).attr('in')).toBe(filter.get(0).result());
    expect(filter.get(2).attr('in')).toBe(filter.get(1).result());
  })

  it('result is set when effect it created', function() {
    var offset = new SVG.Filter.OffsetEffect(10)
    expect(offset.attr('result')).not.toBeUndefined()
  });

  describe('result()', function() {
    it('returns the output name containing the element id', function() {
      expect(blur.result()).toBe(blur.attr('id'))
    })

    it('works as a setter',function(){
      var a = blur.result();
      blur.result('test-result');
      expect(blur.attr('result')).toBe('test-result');
      expect(blur.result()).toBe('test-result');
      blur.attr('result',a);
    })

    it('works as a getter', function(){
      expect(blur.result()).toBe(blur.attr('result'))
    })
  })

  describe('in()', function() {
    it('sets effects \'in\' attr', function() {
      blur.in('testing')
      expect(blur.attr('in')).toBe('testing');
    })

    it('returns an effect with a matching \'result\' attr', function() {
      var otherEffect = filter.offset(10)
      blur.in(otherEffect)
      expect(blur.in()).toBe(otherEffect)
      otherEffect.remove()
    })

    it('returns the attr value if no effect with has a matching \'result\' attr', function() {
      blur.in('testing')
      expect(blur.in()).toBe('testing');
    })

    it('still works when effect has no parent', function() {
      blur.remove()
      blur.in('testing-parent')
      expect(blur.in()).toBe('testing-parent')
      filter.add(blur)
    });
  })

  describe('in2() *only on a few effects*', function() {
    var composite

    beforeAll(function(){
      composite = blur.composite(filter.sourceAlpha)
    })

    afterAll(function(){
      composite.remove();
    })

    it('sets effects \'in2\' attr', function() {
      composite.in2('testing')
      expect(composite.attr('in2')).toBe('testing')
      composite.in2(filter.sourceAlpha)
    })

    it('returns an effect with a matching \'result\' attr', function() {
      otherEffect = filter.offset(10)
      composite.in2(otherEffect)
      expect(composite.in2()).toBe(otherEffect)
      composite.in2(filter.sourceAlpha)
      otherEffect.remove()
    })

    it('returns the attr value if no effect with has a matching \'result\' attr', function() {
      composite.in2('testing')
      expect(composite.in2()).toBe('testing');
      composite.in2(filter.sourceAlpha)
    })

    it('still works when effect has no parent', function() {
      composite.remove()
      composite.in2('testing-parent')
      expect(composite.in2()).toBe('testing-parent')
      composite.in2(filter.sourceAlpha)
      filter.add(composite)
    });
  });

  describe('toString()', function() {
    it('is an alias to the result() method', function() {
      expect(blur.toString()).toBe(blur.result())
    })
  })
})

describe('effects',function(){
  describe('MergeEffect', function() {
    it('pass an Array to merge', function() {
      var filter = new SVG.Filter()
      effect = filter.merge(['some-id', 'another-id'])
      expect(effect.get(0).attr('in')).toBe('some-id')
      expect(effect.get(1).attr('in')).toBe('another-id')
    })

    it('pass arguments to merge', function() {
      var filter = new SVG.Filter()
      effect = filter.merge('some-id', 'another-id')
      expect(effect.get(0).attr('in')).toBe('some-id')
      expect(effect.get(1).attr('in')).toBe('another-id')
    })

    it('when .in() is called it prepends a MergeNode', function() {
      var effect = new SVG.Filter.MergeEffect('first-id')
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
    var filter

    beforeAll(function(){
      filter = new SVG.Filter();
      filter.offset(10).composite(filter.source);
    })

    it('when chaining its first input is set to the effect before it', function() {
      expect(filter.get(1).attr('in')).toBe(filter.get(0).result())
    })

    it('when chaining its second input is set to the first argument', function() {
      expect(filter.get(1).attr('in2')).toBe(filter.source)
    })
  })

  describe('BlendEffect', function() {
    var filter

    beforeAll(function(){
      filter = new SVG.Filter();
      filter.offset(10).blend(filter.source);
    })

    it('when chaining its first input is set to the effect before it', function() {
      expect(filter.get(1).attr('in')).toBe(filter.get(0).result())
    })

    it('when chaining its second input is set to the first argument', function() {
      expect(filter.get(1).attr('in2')).toBe(filter.source)
    })
  })

  describe('DisplacementMap', function() {
    var filter

    beforeAll(function(){
      filter = new SVG.Filter();
      filter.offset(10).displacementMap(filter.source);
    })

    it('when chaining its first input is set to the effect before it', function() {
      expect(filter.get(1).attr('in')).toBe(filter.get(0).result())
    })

    it('when chaining its second input is set to the first argument', function() {
      expect(filter.get(1).attr('in2')).toBe(filter.source)
    })
  })
})
