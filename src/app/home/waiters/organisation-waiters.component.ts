import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
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
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {GetWaiterResponse} from '../../_shared/waiterrobot-backend';
import {SelectedOrganisationService} from '../organisations/_services/selected-organisation.service';
import {OrganisationWaitersService} from './_services/organisation-waiters.service';
import {BtnWaiterSignInQrCodeComponent} from './btn-waiter-sign-in-qr-code.component';

@Component({
  template: `
    <h1>{{ selectedOrganisation()?.name }} {{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</h1>

    <scrollable-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-success">
          <bi name="plus-circle" />
          {{ 'ADD_2' | tr }}</a
        >
      </div>

      <div ngbTooltip="{{ !selection.hasValue() ? ('HOME_WAITERS_SELECT' | tr) : undefined }}">
        <button class="btn btn-sm btn-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
          <bi name="trash" />
          {{ 'DELETE' | tr }}
        </button>
      </div>

      <div>
        <a routerLink="duplicates" class="btn btn-sm btn-secondary">
          <bi name="person-bounding-box" />
          {{ 'HOME_WAITERS_DUPLICATES' | tr }}</a
        >
      </div>
    </scrollable-toolbar>

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
              routerLink="../{{ waiter.id }}"
              [queryParams]="{tab: 'ORDERS'}"
              ngbTooltip="{{ 'NAV_ORDERS' | tr }}"
              (click)="$event.stopPropagation()"
            >
              <bi name="stack" />
            </a>
            <a class="btn btn-sm m-1 btn-outline-success text-body-emphasis" routerLink="../{{ waiter.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
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
        <tr *ngbRowDef="let waiter; columns: columnsToDisplay" ngb-row routerLink="../{{ waiter.id }}"></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
  selector: 'app-organisation-waiters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    DfxTr,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxArrayMapNamePipe,
    DfxImplodePipe,
    ScrollableToolbarComponent,
    BiComponent,
    AppSpinnerRowComponent,
    BtnWaiterSignInQrCodeComponent,
    AppActivatedPipe,
  ],
})
export class OrganisationWaitersComponent extends AbstractModelsWithNameListWithDeleteComponent<GetWaiterResponse> {
  selectedOrganisation = inject(SelectedOrganisationService).selected;

  constructor(
    entitiesService: OrganisationWaitersService,
    private qrCodeService: QrCodeService,
    private mobileLink: MobileLinkService,
  ) {
    super(entitiesService);

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
