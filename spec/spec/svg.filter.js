describe('Filter', function() {
  var rect;

  beforeEach(function() {
    rect = draw.rect();
  });

  afterEach(function() {
    draw.clear();
  });

  it('should extend SVG.Parent',function(){
    expect(SVG.Filter.prototype.__proto__).toBe(SVG.Parent.prototype);
  });

  it('creates the filter() method on elements', function() {
    expect(draw.filter() instanceof SVG.Filter).toBe(true);
  });

  describe('Element#filter()', function() {

  });

  describe('source', function() {
    it('returns "SourceGraphic" string', function() {
      rect.filter(function(add) {
        expect(add.source).toBe('SourceGraphic');
      });
    });
  });

  describe('alpha', function() {
    it('returns "SourceAlpha" string', function() {
      rect.filter(function(add) {
        expect(add.sourceAlpha).toBe('SourceAlpha');
      });
    });
  });

});

describe('Effect', function() {
  var blur;

  beforeEach(function() {
    blur = new SVG.GaussianBlurEffect;
  });

  it('has the filter type stored in the instance', function() {
    expect(blur.type).toBe('feGaussianBlur');
  });

  it('are interchainable', function() {
    var filter = new SVG.Filter();
    filter.merge(filter.source).gaussianBlur(3);
    expect(filter.get(1).attr('in')).toBe(filter.get(0).result())
  });

  describe('result()', function() {
    it('returns the output name containing the element id', function() {
      expect(blur.result()).toBe(blur.attr('id') + 'Out');
    });
  });

  describe('toString()', function() {
    it('is an alias to the result() method', function() {
      expect(blur.toString()).toBe(blur.result());
    });
  });
});

describe('effects',function(){
  describe('MergeEffect', function() {
    it('pass an Array in, new SVG.MergeEffect(["id",anotherEffect])', function() {
      var effect = new SVG.MergeEffect(['some-id','another-id']);
      expect(effect.get(0).attr('in')).toBe('some-id');
      expect(effect.get(1).attr('in')).toBe('another-id');
    });

    it('pass arguments in, new SVG.MergeEffect("some-id",effect)', function() {
      var effect = new SVG.MergeEffect('some-id','another-id');
      expect(effect.get(0).attr('in')).toBe('some-id');
      expect(effect.get(1).attr('in')).toBe('another-id');
    });

    it('pass a SVG.Set of SVG.Effects in', function() {
      var filter = new SVG.Filter();
      var set = new SVG.Set();
      set.add(filter.flood('black'));
      set.add(filter.offset(10));

      var effect = filter.merge(set);
      expect(effect.children().length).toBe(2);
      expect(effect.get(0).attr('in')).toBe(set.get(0).result());
      expect(effect.get(1).attr('in')).toBe(set.get(1).result());
    });

    it('when .in() is called it prepends a MergeNode', function() {
      var effect = new SVG.MergeEffect('first-id');
      effect.in('insert-id');
      expect(effect.get(0).attr('in')).toBe('insert-id');
    });
  });
});

describe('ChildEffect',function(){
  it('dose not have a result function', function() {
    var effect = new SVG.MergeNode('testing');
    expect(effect.result).toBeUndefined();
  });
});

describe('ParentEffect',function(){
  it('should extend SVG.Parent',function(){
    expect(SVG.ParentEffect.prototype.__proto__).toBe(SVG.Parent.prototype);
  });
});
