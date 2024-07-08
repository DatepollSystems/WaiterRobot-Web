import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {AppTestBadge} from '@home-shared/components/app-test-badge.component';
import {TranslocoPipe} from '@jsverse/transloco';

import {EnvironmentHelper} from '@shared/EnvironmentHelper';
import {AuthService} from '@shared/services/auth/auth.service';
import {SystemInfoShowService} from '@shared/services/system-info.service';
import {AppDownloadBtnListComponent} from '@shared/ui/app-download-btn-list.component';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {StopPropagationDirective} from 'dfx-helper';

import {catchError, filter, map, of, startWith, switchMap, timer} from 'rxjs';
import {MyUserService} from '../_shared/services/user/my-user.service';
import {SelectedEventService} from '../events/_services/selected-event.service';
import {AppOrderStateBadgeComponent} from '../orders/_components/app-order-state-badge.component';
import {OrdersService} from '../orders/orders.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    TranslocoPipe,
    AppDownloadBtnListComponent,
    BiComponent,
    AppOrderStateBadgeComponent,
    AppTestBadge,
    DatePipe,
    AppProgressBarComponent,
    StopPropagationDirective,
  ],
})
export class StartComponent {
  #httpClient = inject(HttpClient);
  #authService = inject(AuthService);
  #ordersService = inject(OrdersService);

  isProduction = EnvironmentHelper.getProduction();
  type = EnvironmentHelper.getType();

  myUser = inject(MyUserService).user;
  event = inject(SelectedEventService).selected;
  showSystemInfoService = inject(SystemInfoShowService);

  hasError = toSignal(
    this.#httpClient.get('/user/myself').pipe(
      startWith(false),
      catchError(() => of(true)),
      filter((it) => it === true),
    ),
  );

  orders = toSignal(
    timer(0, 5000).pipe(
      switchMap(() =>
        this.#ordersService.getAllPaginated({
          page: 0,
          size: 8,
          sort: 'createdAt,desc',
        }),
      ),
      map((it) => it.data),
    ),
  );

  logout(): void {
    this.#authService.logout();
  }
}
