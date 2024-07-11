import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

import {getLogMessage, n_from, n_isNumeric} from 'dfts-helper';

import {RedirectService} from '../services/redirect.service';
import {
  selectedOrganisationRouteParamKey,
  SelectedOrganisationService,
} from '../../_admin/organisations/_services/selected-organisation.service';

export function organisationSelectedGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const router = inject(Router);

  inject(RedirectService).setRedirectUrl(state.url);

  const selectedService = inject(SelectedOrganisationService);

  const selectedId = selectedService.selectedId;

  if (!selectedId()) {
    const paramSelectedId = route.paramMap.get(selectedOrganisationRouteParamKey);
    if (paramSelectedId && n_isNumeric(paramSelectedId)) {
      console.info(getLogMessage('INFO', 'routeGuard', 'canActivate', 'Found organisation param'), paramSelectedId);
      selectedService.setSelected(n_from(paramSelectedId));

      return true;
    }

    console.warn(getLogMessage('WARNING', 'routeGuard', 'canActivate', 'No organisation selected; Routing to select view'));
    void router.navigateByUrl('/select');
    return false;
  }

  return true;
}
