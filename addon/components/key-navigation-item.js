/* eslint-disable ember/no-component-lifecycle-hooks */
/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/no-classic-components */
import Component from '@ember/component';
import layout from '../templates/components/key-navigation-item';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  classNameBindings: [':navigation-item', 'activeClass', 'isDisabled:disabled'],
  disabledPath: null,
  isActive: computed('highlightedItem', 'model', function () {
    return this.highlightedItem === this.model;
  }),
  activeClass: computed('isActive', 'activeItemClass', function () {
    return this.isActive ? this.activeItemClass : '';
  }),
  activeItemClass: 'active',
  isDisabled: computed('model', 'disabledPath', function () {
    if (!this.disabledPath || this.model === undefined || this.model === null) {
      return false;
    }
    return Boolean(this.model[this.disabledPath]);
  }),

  didUpdateAttrs() {
    this._super(...arguments);
    if (this.isActive) {
      this.navigationWrapper.on('on-select', this, 'onOptionSelected');
    } else {
      this.navigationWrapper.off('on-select', this, 'onOptionSelected');
    }
  },

  mouseEnter() {
    if (!this.isDisabled) {
      this.setHighLightedItem(this.model);
    }
  },

  onOptionSelected() {
    this.onSelect(this.model);
  },

  click() {
    if (!this.isDisabled) {
      this.onOptionSelected();
    }
  },

  willDestroyElement() {
    if (this.isActive) {
      this.navigationWrapper.off('on-select', this, 'onOptionSelected');
    }
    this._super(...arguments);
  },
});
