import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import { create } from '../../test/factories/floating-label';
import stateModifiers, { EVENTS } from './state-modifiers';

chai.use(chaiJquery);

describe('State Modifiers', () => {
  const { FOCUS, BLUR, INVALID } = EVENTS;

  const setup = (run, overrides = {}, formAttrs = {}) => {
    const modifiers = {
      filledModifier: 'filled',
      invalidModifier: 'invalid',
      selectedModifier: 'selected',
      suppressErrorModifier: 'suppress-error',
    };
    const caller = stateModifiers(modifiers);
    const { $input, nodes, trigger, teardown } = create([caller], overrides, {}, formAttrs);
    run({ $input, nodes, trigger, teardown, modifiers });
    teardown();
  };

  const addClassNames = (nodes, ...modifiers) => {
    nodes.forEach(({ name, node }) =>
      modifiers.forEach(modifier => $(node).addClass(`${name}--${modifier}`)),
    );
  };

  const assertHasClassNames = (nodes, ...modifiers) => {
    nodes.forEach(({ name, node }) => {
      modifiers.forEach(modifier =>
        expect($(node)).to.have.class(`${name}--${modifier}`),
      );
    });
  };

  const assertNoClassNames = (nodes, ...modifiers) => {
    nodes.forEach(({ name, node }) => {
      modifiers.forEach(modifier =>
        expect($(node)).to.not.have.class(`${name}--${modifier}`),
      );
    });
  };

  it('should mark invalid when field is invalid', () => {
    setup(({ nodes, modifiers: { invalidModifier } }) => {
      assertHasClassNames(nodes, invalidModifier);
    }, { required: true });
  });

  it('should fire off a focus event', () => {
    setup(({ nodes, trigger, modifiers: {
      filledModifier,
      invalidModifier,
      selectedModifier,
      suppressErrorModifier,
    } }) => {
      const negateArgList = [nodes, filledModifier, invalidModifier, suppressErrorModifier];

      addClassNames(...negateArgList);
      trigger(FOCUS);

      assertHasClassNames(nodes, selectedModifier);
      assertNoClassNames(...negateArgList);
    });
  });

  it('should fire off a blur event', () => {
    setup(({ nodes, trigger, modifiers: {
      filledModifier,
      invalidModifier,
    } }) => {
      trigger(BLUR, {
        value: 'lebowski.me',
      });

      assertHasClassNames(nodes, invalidModifier, filledModifier);

      trigger(BLUR, {
        value: 'http://lebowski.me',
      });

      assertNoClassNames(nodes, invalidModifier);
      assertHasClassNames(nodes, filledModifier);
    }, {
      attrs: 'pattern="https?://.+"',
    });
  });

  it('should fire off an invalid event', () => {
    setup(({ nodes, trigger, modifiers: {
      invalidModifier,
      suppressErrorModifier,
    } }) => {
      addClassNames(nodes, suppressErrorModifier);
      trigger(INVALID);
      assertNoClassNames(nodes, suppressErrorModifier);
      assertHasClassNames(nodes, invalidModifier);
    });
  });

  it('should do nothing if no event is found', () => {
    setup(({ nodes, trigger, modifiers: {
      filledModifier,
      invalidModifier,
    } }) => {
      trigger('duuuuuuuuuuuuuuuuuuude');
      assertNoClassNames(nodes, filledModifier, invalidModifier);
    });
  });

  it('should apply the suppress error modifier with validate submit only', () => {
    setup(({ nodes, trigger, modifiers: {
      filledModifier,
      invalidModifier,
      suppressErrorModifier,
    } }) => {
      trigger(BLUR, {
        value: 'lebowski.me',
      });

      assertHasClassNames(nodes, filledModifier, suppressErrorModifier);
      assertNoClassNames(nodes, invalidModifier);
    }, {
      attrs: 'pattern="https?://.+"',
    }, {
      validateOnlyOnSubmit: true,
    });
  });
});
