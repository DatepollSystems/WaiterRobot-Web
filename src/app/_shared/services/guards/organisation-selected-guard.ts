import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

import {getLogMessage, n_from, n_isNumeric} from 'dfts-helper';

import {
  selectedOrganisationRouteParamKey,
  SelectedOrganisationService,
} from '../../../home/organisations/_services/selected-organisation.service';
import {RedirectService} from '../redirect.service';

export function organisationSelectedGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const router = inject(Router);

  inject(RedirectService).setRedirectUrl(state.url);

  const selectedService = inject(SelectedOrganisationService);

  const selectedId = selectedService.selectedId;

  if (!selectedId()) {
    const paramSelectedId = route.paramMap.get(selectedOrganisationRouteParamKey);
    console.info('found param', paramSelectedId);
    if (paramSelectedId && n_isNumeric(paramSelectedId)) {
      selectedService.setSelected(n_from(paramSelectedId));
    }
  }

  if (!selectedId()) {
    console.log(getLogMessage('LOG', 'organisationSelectedGuard', 'canActivate', 'No organisation selected; Routing to select'));
    void router.navigateByUrl('/select');
    return false;
  }
  return true;
}
