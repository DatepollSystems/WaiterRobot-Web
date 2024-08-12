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
import {deriveLoading} from 'ngxtension/derive-loading';

import {catchError, filter, map, of, startWith, switchMap, timer} from 'rxjs';
import {catchError, combineLatest, filter, map, of, startWith, switchMap, timer} from 'rxjs';
import {MyUserService} from '../_shared/services/user/my-user.service';
import {SelectedEventService} from '../_admin/events/_services/selected-event.service';
import {MyUserService} from '../_shared/services/user/my-user.service';
import {AppOrderStateBadgeComponent} from '../orders/_components/app-order-state-badge.component';
import {OrdersService} from '../orders/orders.service';
import {MediatorsService} from '../printers/_services/mediators.service';
import {PrintersService} from '../printers/_services/printers.service';

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
  #mediatorsService = inject(MediatorsService);
  #printersService = inject(PrintersService);

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

  #orders$ = timer(0, 5000).pipe(
    switchMap(() =>
      this.#ordersService.getAllPaginated({
        page: 0,
        size: 8,
        sort: {
          name: 'createdAt',
          direction: 'desc',
        },
      }),
    ),
    map((it) => it.data),
  );

  orders = toSignal(this.#orders$);

  showOrdersLoading = toSignal(this.#orders$.pipe(deriveLoading({threshold: 0, loadingTime: 0})), {requireSync: true});

  unusedPrinters = toSignal(
    timer(0, 3 * 60000).pipe(
      switchMap(() => combineLatest([this.#mediatorsService.getAll$(), this.#printersService.getAll$()])),
      map(([mediators, printers]) => {
        const allUsedPrinters = mediators.map((mediator) => mediator.printers.map((printer) => printer.id)).flat();
        return printers.filter((printer) => !allUsedPrinters.includes(printer.id));
      }),
      map((printers) => (printers.length > 0 ? printers : undefined)),
    ),
  );

  logout(): void {
    this.#authService.logout();
  }
}
