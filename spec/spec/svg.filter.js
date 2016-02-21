describe('Filter', function() {
  var rect;

  beforeEach(function() {
    rect = draw.rect();
  });

  afterEach(function() {
    draw.clear();
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
    it('pass Array in, new SVG.MergeEffect(["id",anotherEffect])', function() {
      var effect = new SVG.MergeEffect(['some-id','another-id']);
      expect(effect.get(0).attr('in')).toBe('some-id');
      expect(effect.get(1).attr('in')).toBe('another-id');
    });

    it('pass arguments in, new SVG.MergeEffect("some-id",effect)', function() {
      var effect = new SVG.MergeEffect('some-id','another-id');
      expect(effect.get(0).attr('in')).toBe('some-id');
      expect(effect.get(1).attr('in')).toBe('another-id');
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
