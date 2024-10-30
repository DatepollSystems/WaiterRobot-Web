import {inject} from '@angular/core';

import {pipe, switchMap, tap} from 'rxjs';

import {tapResponse} from '@ngrx/operators';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';

import {base64ToFileAndDownload} from '@home-shared/services/file.utils';

import {BackendType} from '@shared/api';

import {GDPRClient} from './gdpr.client';

type OrganisationsGDPRState = {
  organisationId: number | undefined;
  agreements: BackendType['GdprDocumentPreviewResponse'][];
  fileDto: BackendType['FileDto'] | undefined;
  isLoading: boolean;
};

const initialState: OrganisationsGDPRState = {
  organisationId: undefined,
  agreements: [],
  fileDto: undefined,
  isLoading: true,
};

export const GDPRStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store, gdprClient = inject(GDPRClient)) => ({
    confirm: rxMethod<void>(
      pipe(
        tap(() => patchState(store, () => ({isLoading: true}))),
        switchMap(() =>
          gdprClient.confirm(store.organisationId()!).pipe(
            tapResponse({
              next: () => patchState(store, () => ({fileDto: undefined})),
              error: () => {},
            }),
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
      ),
    ),
    newAgreement: rxMethod<void>(
      pipe(
        tap(() => patchState(store, () => ({isLoading: true}))),
        switchMap(() =>
          gdprClient.newAgreement(store.organisationId()!).pipe(
            tapResponse({
              next: (fileDto) => patchState(store, () => ({fileDto})),
              error: () => {},
            }),
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
            next: (agreement) => void base64ToFileAndDownload(agreement.base64Data, 'gdpr.pdf'),
            error: () => {},
          }),
        ),
      ),
    ),
  })),
);
