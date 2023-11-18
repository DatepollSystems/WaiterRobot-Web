import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {MobileLinkService} from '../../_shared/services/mobile-link.service';
import {QrCodeService} from '../../_shared/services/qr-code.service';
import {AppActivatedPipe} from '../../_shared/ui/app-activated.pipe';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {BtnWaiterCreateQrCodeComponent} from '../../_shared/ui/button/app-waiter-create-qr-code-btn.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNameListByIdComponent} from '../../_shared/ui/models-list-by-id/abstract-models-with-name-list-by-id.component';
import {GetEventOrLocationResponse, GetWaiterResponse} from '../../_shared/waiterrobot-backend';
import {EventsService} from '../events/_services/events.service';
import {WaitersService} from './_services/waiters.service';
import {BtnWaiterSignInQrCodeComponent} from './btn-waiter-sign-in-qr-code.component';

@Component({
  template: `
    @if (entity$ | async; as entity) {
      <h1>{{ entity?.name }} {{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</h1>

      <scrollable-toolbar>
        <a routerLink="../../create" [queryParams]="{event: entity?.id}" class="btn btn-sm btn-success">
          <bi name="plus-circle" />
          {{ 'ADD_2' | tr }}</a
        >
        <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_WAITERS_SELECT' | tr) : undefined }}">
          <button class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <bi name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>

        @if (entity) {
          <app-waiter-create-qrcode-btn [token]="entity.waiterCreateToken" />
        }
      </scrollable-toolbar>
    }

    <form>
      <div class="input-group">
        <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        @if ((filter.value?.length ?? 0) > 0) {
          <button
            class="btn btn-outline-secondary"
            type="button"
            ngbTooltip="{{ 'CLEAR' | tr }}"
            placement="bottom"
            (click)="filter.reset()"
          >
            <bi name="x-circle-fill" />
          </button>
        }
      </div>
    </form>

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="name" ngbSortDirection="asc">
        <ng-container ngbColumnDef="select">
          <th *ngbHeaderCellDef ngb-header-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (change)="$event ? toggleAllRows() : null"
                [checked]="selection.hasValue() && isAllSelected()"
              />
            </div>
          </th>
          <td *ngbCellDef="let selectable" ngb-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (click)="$event.stopPropagation()"
                (change)="$event ? selection.toggle(selectable) : null"
                [checked]="selection.isSelected(selectable)"
              />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
          <td *ngbCellDef="let waiter" ngb-cell>{{ waiter.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="activated">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERS_ACTIVATED' | tr }}</th>
          <td *ngbCellDef="let waiter" ngb-cell>
            {{ waiter.activated | activated }}
          </td>
        </ng-container>

        <ng-container ngbColumnDef="events">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_EVENTS' | tr }}</th>
          <td *ngbCellDef="let waiter" ngb-cell>{{ waiter.events | a_mapName | s_implode: ', ' : 20 : '...' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let waiter" ngb-cell>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-info text-body-emphasis"
              ngbTooltip="{{ 'HOME_WAITERS_EDIT_QR_CODE' | tr }}"
              (click)="openLoginQRCode(waiter.signInToken, $event)"
            >
              <bi name="qr-code" />
            </button>
            <a
              class="btn btn-sm m-1 btn-outline-secondary text-body-emphasis"
              routerLink="../../{{ waiter.id }}"
              [queryParams]="{tab: 'ORDERS'}"
              ngbTooltip="{{ 'NAV_ORDERS' | tr }}"
              (click)="$event.stopPropagation()"
            >
              <bi name="stack" />
            </a>
            <a
              class="btn btn-sm m-1 btn-outline-success text-body-emphasis"
              routerLink="../../{{ waiter.id }}"
              ngbTooltip="{{ 'EDIT' | tr }}"
            >
              <bi name="pencil-square" />
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(waiter.id, $event)"
            >
              <bi name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let waiter; columns: columnsToDisplay" ngb-row routerLink="../../{{ waiter.id }}"></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
  selector: 'app-event-by-id-waiters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    NgbTooltip,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    DfxArrayMapNamePipe,
    DfxImplodePipe,
    BtnWaiterCreateQrCodeComponent,
    AppSpinnerRowComponent,
    BiComponent,
    ScrollableToolbarComponent,
    BtnWaiterSignInQrCodeComponent,
    AppActivatedPipe,
  ],
})
export class EventByIdWaitersComponent extends AbstractModelsWithNameListByIdComponent<GetWaiterResponse, GetEventOrLocationResponse> {
  constructor(
    waitersService: WaitersService,
    eventsService: EventsService,
    private mobileLink: MobileLinkService,
    private qrCodeService: QrCodeService,
  ) {
    super(waitersService, eventsService);

    this.columnsToDisplay = ['name', 'activated', 'events', 'actions'];
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
