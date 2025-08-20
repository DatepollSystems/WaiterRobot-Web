import {Injectable, inject} from '@angular/core';

import {combineLatest, switchMap, tap} from 'rxjs';

import {PageableDto, injectAPI} from '../../../api';
import {SelectedOrganisationService} from '../../../services/selected-organisation.service';
import {WaitersService} from './waiters.service';

@Injectable({providedIn: 'root'})
export class OrganisationWaitersService {
  #api = injectAPI();
  #waitersService = inject(WaitersService);
  #selectedOrganisationService = inject(SelectedOrganisationService);

  getAll$() {
    return combineLatest([this.#waitersService.triggerGet$, this.#selectedOrganisationService.selectedIdNotNull$]).pipe(
      switchMap(([, organisationId]) =>
        this.#api.get('/v1/config/waiter', {
          params: {
            query: {
              organisationId,
            },
          },
        }),
      ),
    );
  }

  delete$(id: number) {
    return this.#api
      .delete('/v1/config/organisation/{id}', {
        params: {
          path: {
            id,
          },
        },
      })
      .pipe(
        tap(() => {
          this.#waitersService.triggerGet$.next(true);
        }),
      );
  }

  unDelete$(id: number) {
    return this.#api.delete('/v1/config/waiter/{id}/undo', {
      params: {
        path: {
          id,
        },
      },
    });
  }

  getAllDeleted$(options: PageableDto) {
    return combineLatest([this.#waitersService.triggerGet$, this.#selectedOrganisationService.selectedIdNotNull$]).pipe(
      switchMap(([, organisationId]) =>
        this.#api.get('/v1/config/waiter/deleted', {
          params: {
            query: {
              organisationId,
              ...options,
            },
          },
        }),
      ),
    );
  }
}
