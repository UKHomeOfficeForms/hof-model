'use strict';

const Model = require('../../');

describe('Referenced Fields', () => {
  let model;

  beforeEach(() => {
    model = new Model();
    model.set('parent', 'original value');
    model.set('reffed', '$ref:parent');
  });

  it('`get` returns the referenced field value', () => {
    model.get('reffed').should.equal('original value');
  });

  it('`toJSON` returns the referenced field value', () => {
    model.toJSON().reffed.should.equal('original value');
  });

  it('`get` returns referenced field value after a change', () => {
    model.get('reffed').should.equal('original value');
    model.set('parent', 'new value');
    model.get('reffed').should.equal('new value');
  });

  it('`toJSON` returns referenced field value after a change', () => {
    model.toJSON().reffed.should.equal('original value');
    model.set('parent', 'new value');
    model.toJSON().reffed.should.equal('new value');
  });

  it('emits change events for referenced fields when referenced value changes', () => {
    const listener = sinon.stub();
    model.on('change', listener);
    model.set('parent', 'new value');
    listener.should.have.been.calledWith({ parent: 'new value', reffed: 'new value' });
  });

  it('emits field specific change events for referenced fields when referenced value changes', () => {
    const listener = sinon.stub();
    model.on('change:reffed', listener);
    model.set('parent', 'new value');
    listener.should.have.been.calledWith('new value', 'original value');
  });

});
