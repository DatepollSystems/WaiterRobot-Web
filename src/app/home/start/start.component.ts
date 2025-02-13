import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {catchError, filter, of, startWith} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';

import {EnvironmentHelper} from '@shared/EnvironmentHelper';
import {injectAPI} from '@shared/api';
import {AuthService, SelectedEventService, SystemInfoShowService} from '@shared/services';
import {AppDownloadBtnListComponent} from '@shared/ui';

import {MyUserService} from '../_shared/services/user/my-user.service';
import {OrdersCard} from './orders-card';
import {UnusedPrintersCard} from './unused-printers-card';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoPipe, AppDownloadBtnListComponent, BiComponent, UnusedPrintersCard, OrdersCard],
})
export class StartComponent {
  #api = injectAPI();
  #authService = inject(AuthService);

  isProduction = EnvironmentHelper.getProduction();
  type = EnvironmentHelper.getType();

  myUser = inject(MyUserService).user;
  event = inject(SelectedEventService).selected;
  showSystemInfoService = inject(SystemInfoShowService);

  hasError = toSignal(
    this.#api.get('/v1/user/myself').pipe(
      startWith(false),
      catchError(() => of(true)),
      filter((it) => it === true),
    ),
  );

  logout(): void {
    this.#authService.logout();
  }
}
