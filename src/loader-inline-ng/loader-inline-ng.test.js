/*global inject*/
import 'angular';
import 'angular-mocks';

import styles from '../loader-inline/loader-inline.css';

import LoaderInline from './loader-inline-ng';

describe('LoaderInline', () => {
  let element;
  let scope;
  let $compile;

  beforeEach(window.module(LoaderInline));

  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new();
    $compile = _$compile_;
    element = $compile('<rg-loader-inline></rg-loader-inline>')(scope)[0];
    scope.$digest();
  }));

  it('should render loader markup', () => {
    element.should.contain(`.${styles.loader}`);
    element.should.contain('[data-test="ring-loader-inline-ng"]');
  });

});
