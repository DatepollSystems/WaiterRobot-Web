import {signal} from '@angular/core';
import {b_fromStorage, st_set} from 'dfts-helper';
import {createInjectionToken} from 'ngxtension/create-injection-token';

const storageKey = 'blur_secure';
export const [injectBlurSetting] = createInjectionToken(() => {
  const isBlurred = signal(b_fromStorage(storageKey) ?? true);
  const setBlur = (_isBlurred: boolean) => {
    st_set(storageKey, _isBlurred);
    isBlurred.set(_isBlurred);
  };

  return {
    isBlurred: isBlurred.asReadonly(),
    setBlur,
  };
});
