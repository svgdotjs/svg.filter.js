import { before, beforeEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { createSVGWindow } from 'svgdom'
import { SVG, registerWindow } from '@svgdotjs/svg.js'

import Filter from '../src/svg.filter.js'

const window = createSVGWindow()
registerWindow(window, window.document)

const canvas = SVG().addTo(window.document.documentElement)

describe('Filter', () => {
  let rect

  beforeEach(() => {
    canvas.clear()
    rect = canvas.rect()
  })

  it('creates the filter() method on elements', () => {
    assert.ok(canvas.filter() instanceof Filter)
  })

  describe('unfilter', () => {
    it('removes the filter attribute but keeps the filter element by default', () => {
      rect.filterWith((add) => {
        add.gaussianBlur(3)
      })
      const filter = rect.filterer()
      rect.unfilter()

      assert.ok(!rect.attr('filter'))
      assert.notStrictEqual(filter.parent(), null)
    })

    it('removes the filter element from the DOM when remove is truthy', () => {
      rect.filterWith((add) => {
        add.gaussianBlur(3)
      })
      const filter = rect.filterer()
      rect.unfilter(true)

      assert.ok(!rect.attr('filter'))
      assert.strictEqual(filter.parent(), null)
    })
  })

  describe('$source', () => {
    it('returns "SourceGraphic" string', () => {
      rect.filterWith((add) => {
        assert.strictEqual(add.$source, 'SourceGraphic')
      })
    })
  })

  describe('$sourceAlpha', () => {
    it('returns "SourceAlpha" string', () => {
      rect.filterWith((add) => {
        assert.strictEqual(add.$sourceAlpha, 'SourceAlpha')
      })
    })
  })
})

describe('Effect', () => {
  let filter
  let blur

  before(() => {
    filter = new Filter()
    blur = filter.gaussianBlur()
  })

  it('has the filter type stored in the instance', () => {
    assert.strictEqual(blur.type, 'feGaussianBlur')
  })

  it('are interchainable', () => {
    const filter = new Filter()
    filter.gaussianBlur(3).merge(filter.$source).offset(10)

    assert.strictEqual(filter.get(1).get(0).attr('in'), filter.get(0).result())
    assert.strictEqual(filter.get(2).attr('in'), filter.get(1).result())
  })

  it('result is set when effect it created', () => {
    const offset = new Filter.OffsetEffect(10)
    assert.notStrictEqual(offset.attr('result'), undefined)
  })

  describe('result()', () => {
    it('returns the output name containing the element id', () => {
      assert.strictEqual(blur.result(), blur.attr('id'))
    })

    it('works as a setter', () => {
      const before = blur.result()
      blur.result('test-result')

      assert.strictEqual(blur.attr('result'), 'test-result')
      assert.strictEqual(blur.result(), 'test-result')

      blur.attr('result', before)
    })

    it('works as a getter', () => {
      assert.strictEqual(blur.result(), blur.attr('result'))
    })
  })

  describe('in()', () => {
    it("sets effects 'in' attr", () => {
      blur.in('testing')
      assert.strictEqual(blur.attr('in'), 'testing')
    })

    it("returns an effect with a matching 'result' attr", () => {
      const otherEffect = filter.offset(10)
      blur.in(otherEffect)

      assert.strictEqual(blur.in(), otherEffect)
      otherEffect.remove()
    })

    it("returns the attr value if no effect has a matching 'result' attr", () => {
      blur.in('testing')
      assert.strictEqual(blur.in(), 'testing')
    })

    it('still works when effect has no parent', () => {
      blur.remove()
      blur.in('testing-parent')

      assert.strictEqual(blur.in(), 'testing-parent')
      filter.add(blur)
    })
  })

  describe('in2() *only on a few effects*', () => {
    let composite

    before(() => {
      composite = blur.composite(filter.$sourceAlpha)
    })

    it("sets effects 'in2' attr", () => {
      composite.in2('testing')
      assert.strictEqual(composite.attr('in2'), 'testing')

      composite.in2(filter.$sourceAlpha)
    })

    it("returns an effect with a matching 'result' attr", () => {
      const otherEffect = filter.offset(10)
      composite.in2(otherEffect)

      assert.strictEqual(composite.in2(), otherEffect)

      composite.in2(filter.$sourceAlpha)
      otherEffect.remove()
    })

    it("returns the attr value if no effect has a matching 'result' attr", () => {
      composite.in2('testing')
      assert.strictEqual(composite.in2(), 'testing')

      composite.in2(filter.$sourceAlpha)
    })

    it('still works when effect has no parent', () => {
      composite.remove()
      composite.in2('testing-parent')

      assert.strictEqual(composite.in2(), 'testing-parent')

      composite.in2(filter.$sourceAlpha)
      filter.add(composite)
    })
  })

  describe('toString()', () => {
    it('is an alias to the result() method', () => {
      assert.strictEqual(blur.toString(), blur.result())
    })
  })
})

describe('effects', () => {
  describe('MergeEffect', () => {
    it('pass an Array to merge', () => {
      const filter = new Filter()
      const effect = filter.merge(['some-id', 'another-id'])

      assert.strictEqual(effect.get(0).attr('in'), 'some-id')
      assert.strictEqual(effect.get(1).attr('in'), 'another-id')
    })

    it('pass arguments to merge', () => {
      const filter = new Filter()
      const effect = filter.merge('some-id', 'another-id')

      assert.strictEqual(effect.get(0).attr('in'), 'some-id')
      assert.strictEqual(effect.get(1).attr('in'), 'another-id')
    })

    it('when .in() is called it prepends a MergeNode', () => {
      const effect = new Filter.MergeEffect('first-id')
      effect.in('insert-id')

      assert.strictEqual(effect.get(0).attr('in'), 'insert-id')
    })

    it('when chaining its first input is set to the effect before it', () => {
      const filter = new Filter()
      filter.offset(10).merge(filter.$source)

      assert.strictEqual(
        filter.get(1).get(0).attr('in'),
        filter.get(0).result()
      )
    })
  })

  describe('Composite', () => {
    let filter

    before(() => {
      filter = new Filter()
      filter.offset(10).composite(filter.$source)
    })

    it('when chaining its first input is set to the effect before it', () => {
      assert.strictEqual(filter.get(1).attr('in'), filter.get(0).result())
    })

    it('when chaining its second input is set to the first argument', () => {
      assert.strictEqual(filter.get(1).attr('in2'), filter.$source)
    })
  })

  describe('BlendEffect', () => {
    let filter

    before(() => {
      filter = new Filter()
      filter.offset(10).blend(filter.$source)
    })

    it('when chaining its first input is set to the effect before it', () => {
      assert.strictEqual(filter.get(1).attr('in'), filter.get(0).result())
    })

    it('when chaining its second input is set to the first argument', () => {
      assert.strictEqual(filter.get(1).attr('in2'), filter.$source)
    })
  })

  describe('DisplacementMap', () => {
    let filter

    before(() => {
      filter = new Filter()
      filter.offset(10).displacementMap(filter.$source)
    })

    it('when chaining its first input is set to the effect before it', () => {
      assert.strictEqual(filter.get(1).attr('in'), filter.get(0).result())
    })

    it('when chaining its second input is set to the first argument', () => {
      assert.strictEqual(filter.get(1).attr('in2'), filter.$source)
    })
  })
})
