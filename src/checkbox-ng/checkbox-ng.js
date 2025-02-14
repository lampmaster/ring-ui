import angular from 'angular';

import checkmarkIcon from '@jetbrains/icons/checkmark-14px';

import IconNG from '../icon-ng/icon-ng';
import proxyAttrs from '../proxy-attrs/proxy-attrs';

import styles from '../checkbox/checkbox.css';

/**
 * @name Checkbox Ng
 */

const angularModule = angular.module('Ring.checkbox', [IconNG]);

let idCounter = 0;
const CHECKBOX_ID_PREFIX = 'rg-checkbox-';

angularModule.directive('rgCheckbox', function rgCheckboxDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: proxyAttrs(`
<label class="${styles.checkbox}">
  <input
    data-proxy-ng-disabled
    data-proxy-ng-model
    data-proxy-ng-change
    data-proxy-ng-true-value
    data-proxy-ng-false-value
    data-proxy-name
    data-proxy-title
    data-proxy-aria-label
    data-test="ring-checkbox"
    type="checkbox"
    class="${styles.input}"
  />
  <span class="${styles.cell}">
    <rg-icon class="${styles.check}" glyph="{{:: checkmarkIcon}}" />
  </span><span class="${styles.label}" ng-transclude></span>
</label>
    `),
    link: function link(scope, iElement, attrs, controller, transcludeFn) {
      scope.checkmarkIcon = checkmarkIcon;
      const input = iElement[0].querySelector('input[type="checkbox"]');
      const label = iElement[0].querySelector(`*[class~="${styles.label}"]`);

      const id = CHECKBOX_ID_PREFIX + idCounter++;
      iElement[0].setAttribute('for', id);
      input.setAttribute('id', id);

      transcludeFn(clone => {
        if (clone.length) {
          label.style.display = 'initial';
        } else {
          label.style.display = 'none';
        }
      });
    }
  };
});

export default angularModule.name;
