import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {catchError, filter, of, startWith} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';

import {injectAPI} from '../../api';
import {AppDownloadBtnListComponent} from '../../components/app-download-btn-list.component';
import {OrdersCard} from '../../components/start/orders-card';
import {UnusedPrintersCard} from '../../components/start/unused-printers-card';
import {AuthService} from '../../services/auth/auth.service';
import {SelectedEventService} from '../../services/selected-event.service';
import {SystemInfoShowService} from '../../services/system-info.service';
import {MyUserService} from '../../services/user/my-user.service';
import {EnvironmentHelper} from '../../util/EnvironmentHelper';

@Component({
  template: `
    <div class="d-flex flex-column flex-md-row justify-content-between gap-2">
      <div class="col-12 col-md-6 col-xl-5 col-xxl-4 d-flex flex-column gap-2">
        <div class="card p-2">
          <div class="card-body">
            <h5 class="card-title">{{ 'HOME_START_SETUP' | transloco }}</h5>

            <div class="d-flex gap-2 flex-wrap">
              <a class="btn btn-outline-info btn-sm" routerLink="o/organisationId/e/eventId/tables/t/create">
                <bi name="plus-circle" />
                {{ 'HOME_START_SETUP_CREATE_TABLE' | transloco }}</a
              >
              <a class="btn btn-outline-info btn-sm" routerLink="o/organisationId/e/eventId/products/p/create">
                <bi name="plus-circle" />
                {{ 'HOME_START_SETUP_CREATE_PRODUCT' | transloco }}</a
              >
              <a class="btn btn-outline-info btn-sm" routerLink="o/organisationId/e/eventId/waiters/waiter/create">
                <bi name="plus-circle" />
                {{ 'HOME_START_SETUP_CREATE_WAITER' | transloco }}</a
              >
              <a class="btn btn-outline-info btn-sm" routerLink="o/organisationId/e/eventId/table-groups/create">
                <bi name="plus-circle" />
                {{ 'HOME_START_SETUP_CREATE_TABLE_GROUP' | transloco }}</a
              >
              <a class="btn btn-outline-info btn-sm" routerLink="o/organisationId/e/eventId/product-groups/create">
                <bi name="plus-circle" />
                {{ 'HOME_START_SETUP_CREATE_PRODUCT_GROUP' | transloco }}</a
              >
            </div>
          </div>
        </div>

        <div class="card p-2">
          <div class="card-body">
            <h5 class="card-title">{{ 'ABOUT_APP_DISCOVER' | transloco }}</h5>
            <app-download-btn-list />
          </div>
        </div>

        @let _event = event();
        @defer (when _event) {
          @if (_event) {
            <wr-unused-printers-card />
          }
        }
        @defer (when myUser()?.isAdmin) {
          @if (myUser()?.isAdmin) {
            <div class="card p-2">
              <div
                class="card-body d-inline-flex align-items-center gap-2 clickable"
                (mousedown)="showSystemInfoService.set(!showSystemInfoService.show())"
              >
                <span>Toggle Developer Menu:</span>
                <kbd class="px-2" style="padding-top: 5px"><kbd>Super</kbd> + <kbd>K</kbd></kbd>
              </div>
            </div>
          }
          @if (hasError() && !isProduction) {
            <div class="card p-2">
              <div class="card-body">
                <button class="btn btn-sm btn-warning" (click)="logout()" type="button">Logout</button>
              </div>
            </div>
          }
        }
      </div>

      @defer (when _event) {
        @if (_event) {
          <div class="col-12 col-md-6 col-xl-5 col-xxl-4 d-flex flex-column gap-2">
            <wr-orders-card />
          </div>
        }
      }
    </div>

    @if (type === 'dev') {
      <div class="d-flex justify-content-center">
        <div class="mt-5 pt-5 text-break text-center">
          <h1 style="font-size: 60px">kellner.team DEV</h1>
        </div>
      </div>
    }
  `,
  selector: 'start-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoPipe, AppDownloadBtnListComponent, BiComponent, UnusedPrintersCard, OrdersCard],
})
export class StartPage {
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
