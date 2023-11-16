import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

import {getLogMessage, n_from, n_isNumeric} from 'dfts-helper';

import {selectedEventRouteParamKey, SelectedEventService} from '../../../home/events/_services/selected-event.service';
import {RedirectService} from '../redirect.service';

export function eventSelectedGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const router = inject(Router);

  inject(RedirectService).setRedirectUrl(state.url);

  const selectedService = inject(SelectedEventService);

  const selectedId = selectedService.selectedId;

  if (!selectedId()) {
    const paramSelectedId = route.paramMap.get(selectedEventRouteParamKey);
    if (paramSelectedId && n_isNumeric(paramSelectedId)) {
      console.info(getLogMessage('INFO', 'routeGuard', 'canActivate', 'Found event param'), paramSelectedId);
      selectedService.setSelected(n_from(paramSelectedId));

      return true;
    }

    console.warn(getLogMessage('WARNING', 'routeGuard', 'canActivate', 'No event selected; Routing to select view'));
    void router.navigateByUrl('/select');
    return false;
  }

  return true;
}
