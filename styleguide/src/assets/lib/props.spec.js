import { expect } from 'chai';

import { get, set, clearStore, updateStore } from './props';

describe('props', () => {
  afterEach(() => clearStore());

  describe('when getting a value', () => {
    it('should error when no name has been provided', () => {
      expect(() => get()).to.throw(Error);
    });

    it('should get a prop', () => {
      const name = 'name';
      const value = 'Maude';
      set(name, value);
      expect(get(name)).to.equal(value);
    });

    it('should get a prop that is heavily nested', () => {
      const name = 'info';
      const firstName = 'Bunny';
      const obj = {
        character: { firstName },
      };
      set(name, obj);
      expect(get('info.character.firstName')).to.equal(firstName);
    });

    it('should not mutate an immutable object', () => {
      const name = 'info';
      const obj = {
        character: {
          firstName: 'Walter',
          rollsOnShabbos: false,
        },
      };
      set(name, obj);
      const character = get('info.character');
      character.rollsOnShabbos = true;
      expect(get('info.character')).to.eql(obj.character);
    });

    it('should return a default value when no prop is present', () => {
      const name = 'name';
      const defaultValue = 'The Dude';
      updateStore({
        [name]: undefined,
      });
      expect(get(name, defaultValue)).to.equal(defaultValue);
    });
  });

  describe('when setting a value', () => {
    it('should error when no name has been provided', () => {
      expect(() => set()).to.throw(Error);
    });

    it('should error when no value has been provided', () => {
      expect(() => set('dawg')).to.throw(Error);
    });

    it('should set a value property', () => {
      const name = 'name';
      const value = 'Donny';
      set(name, value);
      expect(get(name)).to.equal(value);
    });

    it('should error when no override flag has been provided for an existing prop', () => {
      const name = 'name';
      const value = 'Donny';
      set(name, value);
      expect(() => set(name, 'Walter')).to.throw(Error);
    });

    it('should not error when an override flag has been provided for an existing prop', () => {
      const name = 'name';
      const value = 'Donny';
      const override = 'Walter';
      set(name, value);
      set(name, override, true);
      expect(get(name)).to.equal(override);
    });
  });
});
