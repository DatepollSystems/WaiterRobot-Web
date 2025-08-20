import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, combineLatest, switchMap, tap} from 'rxjs';

import {APIType, injectAPI} from '../../../api';
import {SelectedOrganisationService} from '../../../services/selected-organisation.service';

@Injectable({providedIn: 'root'})
export class DuplicateWaitersService {
  #api = injectAPI();
  #selectedOrganisationService = inject(SelectedOrganisationService);

  trigger = new BehaviorSubject(true);

  getAll$() {
    return combineLatest([this.trigger, this.#selectedOrganisationService.selectedIdNotNull$]).pipe(
      switchMap(([, organisationId]) =>
        this.#api.get('/v1/config/waiter/duplicates', {
          params: {
            query: {
              organisationId,
            },
          },
        }),
      ),
    );
  }

  public merge(body: APIType['MergeWaiterDto']) {
    return this.#api.put('/v1/config/waiter/duplicates/merge', {body}).pipe(
      tap(() => {
        this.trigger.next(true);
      }),
    );
  }
}
