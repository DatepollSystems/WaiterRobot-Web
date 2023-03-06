import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxArrayMapNamePipe, DfxImplodePipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {QrCodeService} from '../../_shared/services/qr-code.service';

import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsWithNameListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-with-name-list-with-delete.component';
import {GetWaiterResponse} from '../../_shared/waiterrobot-backend';

import {OrganisationsService} from '../organisations/_services/organisations.service';
import {OrganisationWaitersService} from './_services/organisation-waiters.service';
import {BtnWaiterSignInQrCodeComponent} from './btn-waiter-sign-in-qr-code.component';
import {MobileLinkService} from '../../_shared/services/mobile-link.service';

@Component({
  template: `
    <ng-container *ngIf="selectedOrganisation$ | async as selectedOrganisation">
      <h1>{{ selectedOrganisation?.name }} {{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</h1>

      <btn-toolbar>
        <div>
          <a routerLink="../create" class="btn btn-sm btn-outline-success">
            <i-bs name="plus-circle" />
            {{ 'ADD_2' | tr }}</a
          >
        </div>

        <div>
          <button class="btn btn-sm btn-outline-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
            <i-bs name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>

        <!--        <div>-->
        <!--          <a routerLink="./duplicates" class="btn btn-sm btn-outline-secondary">-->
        <!--            <i-bs name="person-bounding-box"/>-->
        <!--            {{ 'HOME_WAITERS_DUPLICATES' | tr }}</a-->
        <!--          >-->
        <!--        </div>-->
      </btn-toolbar>
    </ng-container>

    <form>
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter.value?.length ?? 0) > 0">
          <i-bs name="x-circle-fill" />
        </button>
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
                [checked]="selection.hasValue() && isAllSelected()" />
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
                [checked]="selection.isSelected(selectable)" />
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
            <div class="form-check">
              <input class="form-check-input" onclick="return false;" type="checkbox" [checked]="waiter.activated" name="activated" />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="events">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAV_EVENTS' | tr }}</th>
          <td *ngbCellDef="let waiter" ngb-cell>{{ waiter.events | a_mapName | s_implode : ', ' : 20 : '...' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let waiter" ngb-cell>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-info text-white"
              ngbTooltip="{{ 'HOME_WAITERS_EDIT_QR_CODE' | tr }}"
              (click)="openLoginQRCode(waiter.signInToken, $event)">
              <i-bs name="qr-code"></i-bs>
            </button>
            <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../{{ waiter.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
              <i-bs name="pencil-square" />
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(waiter.id, $event)">
              <i-bs name="trash" />
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
    NgIf,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxArrayMapNamePipe,
    DfxImplodePipe,
    AppBtnToolbarComponent,
    AppIconsModule,
    AppSpinnerRowComponent,
    BtnWaiterSignInQrCodeComponent,
  ],
})
export class OrganisationWaitersComponent extends AbstractModelsWithNameListWithDeleteComponent<GetWaiterResponse> {
  selectedOrganisation$ = inject(OrganisationsService).getSelected$;

  constructor(entitiesService: OrganisationWaitersService, private qrCodeService: QrCodeService, private mobileLink: MobileLinkService) {
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
