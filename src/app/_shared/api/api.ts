import {HttpClient} from '@angular/common/http';
import {inject} from '@angular/core';

import {createOpenAPIHttpClient} from 'dfx-openapi';

import {EnvironmentHelper} from '@shared/EnvironmentHelper';

import type {paths} from './api-types';

export function injectAPI() {
  const httpClient = inject(HttpClient);
  return createOpenAPIHttpClient<paths>(httpClient, {
    baseUrl: EnvironmentHelper.getAPIUrl(),
  });
}
