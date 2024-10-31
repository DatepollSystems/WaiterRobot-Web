import {inject} from '@angular/core';

import {filter, pipe, switchMap, tap} from 'rxjs';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {tapResponse} from '@ngrx/operators';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';

import {base64ToArrayBuffer} from '@home-shared/services/file.utils';

import {BackendType} from '@shared/api';

import {GDPRConfirmationModal} from '../gdpr/gdpr-confirmation-modal';
import {GDPRClient} from './gdpr.client';

type OrganisationsGDPRState = {
  organisationId: number | undefined;
  agreements: BackendType['GdprDocumentPreviewResponse'][];
  isLoading: boolean;
};

const initialState: OrganisationsGDPRState = {
  organisationId: undefined,
  agreements: [],
  isLoading: true,
};

export const GDPRStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store, gdprClient = inject(GDPRClient), modal = inject(NgbModal)) => ({
    newAgreement: rxMethod<void>(
      pipe(
        tap(() => patchState(store, () => ({isLoading: true}))),
        switchMap(() => gdprClient.newAgreement(store.organisationId()!)),
        tap(() => patchState(store, () => ({isLoading: false}))),
        switchMap((response) => {
          const modalRef = modal.open(GDPRConfirmationModal, {
            ariaLabelledBy: 'modal-gdpr-confirmation',
            size: 'lg',
          });

          (modalRef.componentInstance as GDPRConfirmationModal).pdf.set(base64ToArrayBuffer(response.data));

          return modalRef.closed;
        }),
        filter((result) => result === true),
        switchMap(() => gdprClient.confirm(store.organisationId()!)),
        tap(() => patchState(store, () => ({isLoading: true}))),
        switchMap(() =>
          gdprClient.loadAgreements(store.organisationId()!).pipe(
            tapResponse({
              next: (agreements) => patchState(store, () => ({agreements, isLoading: false})),
              error: () => {},
            }),
          ),
        ),
      ),
    ),
    loadAll: rxMethod<number>(
      pipe(
        tap(() => patchState(store, () => ({isLoading: true}))),
        switchMap((id) =>
          gdprClient.loadAgreements(id).pipe(
            tapResponse({
              next: (agreements) => patchState(store, () => ({agreements, isLoading: false, organisationId: id})),
              error: () => {},
            }),
          ),
        ),
      ),
    ),
    load: rxMethod<number>(
      switchMap((id) =>
        gdprClient.loadAgreement(id).pipe(
          tapResponse({
            next: (agreement) => {
              const modalRef = modal.open(GDPRConfirmationModal, {
                ariaLabelledBy: 'modal-gdpr-confirmation',
                size: 'lg',
              });

              (modalRef.componentInstance as GDPRConfirmationModal).confirm.set(false);
              (modalRef.componentInstance as GDPRConfirmationModal).contractDate.set(new Date(agreement.agreedOnAt));
              (modalRef.componentInstance as GDPRConfirmationModal).pdf.set(base64ToArrayBuffer(agreement.base64Data));
            },
            error: () => {},
          }),
        ),
      ),
    ),
  })),
);
