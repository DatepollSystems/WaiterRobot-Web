import {inject} from '@angular/core';

import {filter, pipe, switchMap, tap} from 'rxjs';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {tapResponse} from '@ngrx/operators';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {setAllEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';

import {base64ToArrayBuffer} from '@home-shared/services/file.utils';

import {BackendType, injectAPI} from '@shared/api';
import {setError, setFulfilled, setPending} from '@shared/api/request-status.feature';
import {withTable} from '@shared/api/table.feature';

import {GDPRConfirmationModal} from '../gdpr/gdpr-confirmation-modal';

type OrganisationsGDPRState = {
  organisationId: number | undefined;
};

export const GDPRStore = signalStore(
  {providedIn: 'root'},
  withTable<BackendType['GdprDocumentPreviewResponse']>({
    columnsToDisplay: ['agreedOnAt', 'agreedOnBy'],
  }),
  withState<OrganisationsGDPRState>({organisationId: undefined}),
  withMethods((store, api = injectAPI(), modal = inject(NgbModal)) => ({
    newAgreement: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() => api.post('/v1/config/gdpr/{id}', {params: {path: {id: store.organisationId()!}}})),
        tap(() => patchState(store, setFulfilled())),
        switchMap((response) => {
          const modalRef = modal.open(GDPRConfirmationModal, {
            ariaLabelledBy: 'modal-gdpr-confirmation',
            size: 'lg',
          });

          (modalRef.componentInstance as GDPRConfirmationModal).pdf.set(base64ToArrayBuffer(response.data));

          return modalRef.closed;
        }),
        filter((result) => result === true),
        switchMap(() => api.put('/v1/config/gdpr/{id}', {params: {path: {id: store.organisationId()!}}})),
        tap(() => patchState(store, setPending())),
        switchMap(() =>
          api.get('/v1/config/gdpr/{id}', {params: {path: {id: store.organisationId()!}}}).pipe(
            tapResponse({
              next: (agreements) => patchState(store, setAllEntities(agreements), setFulfilled()),
              error: (error) => patchState(store, setError(error)),
            }),
          ),
        ),
      ),
    ),
    loadAll: rxMethod<number>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap((organisationId) =>
          api.get('/v1/config/gdpr/{id}', {params: {path: {id: organisationId}}}).pipe(
            tapResponse({
              next: (agreements) => patchState(store, setAllEntities(agreements), setFulfilled(), () => ({organisationId})),
              error: (error) => patchState(store, setError(error)),
            }),
          ),
        ),
      ),
    ),
    load: rxMethod<number>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap((id) =>
          api.get('/v1/config/gdpr/agreement/{gdprId}', {params: {path: {gdprId: id}}}).pipe(
            tapResponse({
              next: (agreement) => {
                const modalRef = modal.open(GDPRConfirmationModal, {
                  ariaLabelledBy: 'modal-gdpr-confirmation',
                  size: 'lg',
                });

                (modalRef.componentInstance as GDPRConfirmationModal).confirm.set(false);
                (modalRef.componentInstance as GDPRConfirmationModal).contractDate.set(new Date(agreement.agreedOnAt));
                (modalRef.componentInstance as GDPRConfirmationModal).pdf.set(base64ToArrayBuffer(agreement.base64Data));

                patchState(store, setFulfilled());
              },
              error: (error) => patchState(store, setError(error)),
            }),
          ),
        ),
      ),
    ),
  })),
);
