import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';

import {NgbDropdownItem, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {GetEventOrLocationResponse, GetWaiterResponse} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe} from 'dfx-helper';
import {BtnWaiterCreateQrCodeComponent} from '../_shared/components/button/app-waiter-create-qr-code-btn.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {EntitiesHeaderWithPlaceholderLayout} from '../_shared/layouts/entities-header-with-placeholder.layout';
import {AbstractModelsWithNameListByIdComponent} from '../_shared/list/models-list-by-id/abstract-models-with-name-list-by-id.component';
import {AppActivatedPipe} from '../_shared/pipes/app-activated.pipe';
import {MobileLinkService} from '../_shared/services/mobile-link.service';
import {QrCodeService} from '../_shared/services/qr-code.service';
import {EventsService} from '../events/_services/events.service';
import {WaitersService} from './_services/waiters.service';
import {BtnWaiterSignInQrCodeComponent} from './btn-waiter-sign-in-qr-code.component';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      @if (entity$ | async; as entity) {
        <entities-header-with-placeholder-layout [loading]="entityLoading()">
          <h1 class="my-0">{{ entity?.name }} {{ 'HOME_WAITERS_NAV_ORGANISATION' | transloco }}</h1>

          <scrollable-toolbar>
            <a routerLink="../../create" class="btn btn-sm btn-success" [queryParams]="{event: entity?.id}">
              <bi name="plus-circle" />
              {{ 'ADD_2' | transloco }}</a
            >
            <div [ngbTooltip]="!selection.hasValue() ? ('HOME_WAITERS_SELECT_INFO' | transloco) : undefined">
              <button type="button" class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>

            @if (entity) {
              <app-waiter-create-qrcode-btn [token]="entity.waiterCreateToken" />
            }
          </scrollable-toolbar>
        </entities-header-with-placeholder-layout>
      }

      <form>
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter" [placeholder]="'SEARCH' | transloco" />
          @if ((filter.value?.length ?? 0) > 0) {
            <button
              class="btn btn-outline-secondary"
              type="button"
              placement="bottom"
              [ngbTooltip]="'CLEAR' | transloco"
              (click)="filter.reset()"
            >
              <bi name="x-circle-fill" />
            </button>
          }
        </div>
      </form>

      <div class="table-responsive">
        <table ngb-table ngb-sort ngbSortActive="name" ngbSortDirection="asc" [hover]="true" [dataSource]="(dataSource$ | async) ?? []">
          <ng-container ngbColumnDef="select">
            <th *ngbHeaderCellDef ngb-header-cell>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  [checked]="selection.hasValue() && isAllSelected()"
                  (change)="$event ? toggleAllRows() : null"
                />
              </div>
            </th>
            <td *ngbCellDef="let selectable" ngb-cell (click)="$event.stopPropagation()">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="checked"
                  [checked]="selection.isSelected(selectable)"
                  (change)="$event ? selection.toggle(selectable) : null"
                />
              </div>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
            <td *ngbCellDef="let waiter" ngb-cell>{{ waiter.name }}</td>
          </ng-container>

          <ng-container ngbColumnDef="activated">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERS_ACTIVATED' | transloco }}</th>
            <td *ngbCellDef="let waiter" ngb-cell>
              {{ waiter.activated | activated }}
            </td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>
              <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
            </th>
            <td *ngbCellDef="let waiter" ngb-cell>
              <app-action-dropdown>
                <button
                  type="button"
                  class="d-flex gap-2 align-items-center"
                  ngbDropdownItem
                  (click)="openLoginQRCode(waiter.signInToken, $event)"
                >
                  <bi name="qr-code" />
                  {{ 'HOME_WAITERS_EDIT_QR_CODE' | transloco }}
                </button>
                <a
                  type="button"
                  class="d-flex gap-2 align-items-center"
                  ngbDropdownItem
                  routerLink="../../../orders"
                  [queryParams]="{waiterIds: waiter.id}"
                >
                  <bi name="stack" />
                  {{ 'NAV_ORDERS' | transloco }}
                </a>
                <a
                  type="button"
                  class="d-flex gap-2 align-items-center"
                  ngbDropdownItem
                  routerLink="../../../bills"
                  [queryParams]="{waiterIds: waiter.id}"
                >
                  <bi name="cash-coin" />
                  {{ 'NAV_BILLS' | transloco }}
                </a>
                <div class="dropdown-divider"></div>
                <a type="button" class="d-flex gap-2 align-items-center" ngbDropdownItem [routerLink]="'../../' + waiter.id">
                  <bi name="pencil-square" />
                  {{ 'EDIT' | transloco }}
                </a>
                <button
                  type="button"
                  class="d-flex gap-2 align-items-center text-danger-emphasis"
                  ngbDropdownItem
                  (click)="onDelete(waiter.id, $event)"
                >
                  <bi name="trash" />
                  {{ 'DELETE' | transloco }}
                </button>
              </app-action-dropdown>
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let waiter; columns: columnsToDisplay" ngb-row [routerLink]="'../../' + waiter.id"></tr>
        </table>
      </div>

      <app-progress-bar [show]="isLoading()" />
    </div>
  `,
  selector: 'app-event-by-id-waiters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    NgbTooltip,
    TranslocoPipe,
    DfxTableModule,
    DfxSortModule,
    DfxArrayMapNamePipe,
    DfxImplodePipe,
    BtnWaiterCreateQrCodeComponent,
    BiComponent,
    ScrollableToolbarComponent,
    BtnWaiterSignInQrCodeComponent,
    AppActivatedPipe,
    AppProgressBarComponent,
    EntitiesHeaderWithPlaceholderLayout,
    ActionDropdownComponent,
    NgbDropdownItem,
  ],
})
export class WaitersByEventComponent extends AbstractModelsWithNameListByIdComponent<GetWaiterResponse, GetEventOrLocationResponse> {
  constructor(
    waitersService: WaitersService,
    eventsService: EventsService,
    private mobileLink: MobileLinkService,
    private qrCodeService: QrCodeService,
  ) {
    super(waitersService, eventsService);

    this.columnsToDisplay = ['name', 'activated', 'actions'];
  }

  openLoginQRCode(token: string, $event: MouseEvent): void {
    $event.stopPropagation();
    this.qrCodeService.openQRCodePage({
      data: this.mobileLink.createWaiterSignInLink(token),
      text: 'HOME_WAITERS_EDIT_QR_CODE',
      info: 'HOME_WAITERS_EDIT_QR_CODE_DESCRIPTION',
    });
  }
}
