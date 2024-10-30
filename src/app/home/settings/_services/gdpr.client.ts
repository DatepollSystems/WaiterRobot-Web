import {createInjectable} from 'ngxtension/create-injectable';

import {injectAPI} from '@shared/api';

export const GDPRClient = createInjectable(() => {
  const api = injectAPI();

  return {
    loadAgreements: (id: number) => api.get('/v1/config/gdpr/{id}', {params: {path: {id}}}),
    loadAgreement: (id: number) => api.get('/v1/config/gdpr/agreement/{gdprId}', {params: {path: {gdprId: id}}}),
    newAgreement: (id: number) => api.post('/v1/config/gdpr/{id}', {params: {path: {id}}}),
    confirm: (id: number) => api.put('/v1/config/gdpr/{id}', {params: {path: {id}}}),
  };
});
