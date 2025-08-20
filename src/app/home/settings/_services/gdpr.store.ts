import {inject} from '@angular/core';

import {filter, pipe, switchMap, tap} from 'rxjs';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {tapResponse} from '@ngrx/operators';
import {patchState, signalStore, withMethods} from '@ngrx/signals';
import {setAllEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';

import {SelectedOrganisationService} from '@shared/services';

import {APIType, injectAPI} from '../../../api';
import {setError, setFulfilled, setPending} from '../../../api/request-status.feature';
import {withTable} from '../../../api/table.feature';
import {base64ToArrayBuffer} from '../../../services/file.utils';
import {GDPRConfirmationModal} from '../gdpr/gdpr-confirmation-modal';

export const GDPRStore = signalStore(
  {providedIn: 'root'},
  withTable<APIType['GdprDocumentPreviewResponse']>({
    columnsToDisplay: ['agreedOnAt', 'agreedOnBy'],
  }),
  withMethods((store, api = injectAPI(), modal = inject(NgbModal), selectedOrganisationService = inject(SelectedOrganisationService)) => ({
    newAgreement: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() => api.post('/v1/config/gdpr/{id}', {params: {path: {id: selectedOrganisationService.selectedId()!}}})),
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
        switchMap(() => api.put('/v1/config/gdpr/{id}', {params: {path: {id: selectedOrganisationService.selectedId()!}}})),
        tap(() => patchState(store, setPending())),
        switchMap(() =>
          api.get('/v1/config/gdpr/{id}', {params: {path: {id: selectedOrganisationService.selectedId()!}}}).pipe(
            tapResponse({
              next: (agreements) => patchState(store, setAllEntities(agreements), setFulfilled()),
              error: (error) => patchState(store, setError(error)),
            }),
          ),
        ),
      ),
    ),
    loadAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() =>
          api.get('/v1/config/gdpr/{id}', {params: {path: {id: selectedOrganisationService.selectedId()!}}}).pipe(
            tapResponse({
              next: (agreements) => patchState(store, setAllEntities(agreements), setFulfilled()),
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
