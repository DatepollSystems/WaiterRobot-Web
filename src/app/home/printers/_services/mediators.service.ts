import {Injectable, inject} from '@angular/core';

import {switchMap} from 'rxjs';

import {injectAPI} from '@shared/api';
import {SelectedOrganisationService} from '@shared/services/selected-organisation.service';

@Injectable({
  providedIn: 'root',
})
export class MediatorsService {
  #api = injectAPI();
  #selectedOrganisationService = inject(SelectedOrganisationService);

  getAll$() {
    return this.#selectedOrganisationService.selectedIdNotNull$.pipe(
      switchMap((organisationId) =>
        this.#api.get('/v1/config/mediator', {
          params: {
            query: {organisationId},
          },
        }),
      ),
    );
  }
}
