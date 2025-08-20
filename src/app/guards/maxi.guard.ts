import {inject} from '@angular/core';
import {Router} from '@angular/router';

import {EnvironmentHelper} from '../util/EnvironmentHelper';

export function maxiGuard(): boolean {
  const type = EnvironmentHelper.getType();

  if (type === 'prod') {
    void inject(Router).navigateByUrl('/');

    return false;
  }
  return true;
}
