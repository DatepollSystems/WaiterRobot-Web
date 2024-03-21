import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {EnvironmentHelper} from '@shared/EnvironmentHelper';

export function maxiGuard(): boolean {
  const isProd = EnvironmentHelper.getProduction();

  if (isProd) {
    void inject(Router).navigateByUrl('/');

    return false;
  }
  return true;
}
