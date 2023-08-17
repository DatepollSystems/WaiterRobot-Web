import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {AppActivatedPipe} from '../../_shared/ui/app-activated.pipe';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {AbstractModelsListWithDeleteComponent} from '../../_shared/ui/models-list-with-delete/abstract-models-list-with-delete.component';
import {GetSystemNotificationResponse} from '../../_shared/waiterrobot-backend';
import {AppSystemNotificationTypeBadgeComponent} from './_components/system-notification-type-badge.component';
import {SystemNotificationsService} from './_services/system-notifications.service';

@Component({
  template: `
    <h1>{{ 'NAV_SYSTEM_NOTIFICATIONS' | tr }}</h1>

    <btn-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-success">
          <i-bs name="plus-circle" />
          {{ 'ADD_2' | tr }}</a
        >
      </div>
    </btn-toolbar>

    <form>
      <div class="input-group">
        <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
        <button
          class="btn btn-outline-secondary"
          type="button"
          ngbTooltip="{{ 'CLEAR' | tr }}"
          placement="bottom"
          (click)="filter.reset()"
          *ngIf="(filter?.value?.length ?? 0) > 0"
        >
          <i-bs name="x-circle-fill" />
        </button>
      </div>
    </form>

    <div class="table-responsive">
      <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort ngbSortActive="id" ngbSortDirection="asc">
        <ng-container ngbColumnDef="title">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'TITLE' | tr }}</th>
          <td *ngbCellDef="let it" ngb-cell>{{ it.title }}</td>
        </ng-container>

        <ng-container ngbColumnDef="type">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'TYPE' | tr }}</th>
          <td *ngbCellDef="let it" ngb-cell>
            <app-system-notification-type-badge [type]="it.type" />
          </td>
        </ng-container>

        <ng-container ngbColumnDef="starts">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'STARTS' | tr }}</th>
          <td *ngbCellDef="let it" ngb-cell>{{ it.starts | date: 'dd.MM.YYYY HH:mm' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="ends">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ENDS' | tr }}</th>
          <td *ngbCellDef="let it" ngb-cell>{{ it.ends | date: 'dd.MM.YYYY HH:mm' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="active">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ACTIVE' | tr }}</th>
          <td *ngbCellDef="let it" ngb-cell>
            {{ it.active | activated }}
          </td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let it" ngb-cell>
            <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../{{ it.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
              <i-bs name="pencil-square" />
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(it.id, $event)"
            >
              <i-bs name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let it; columns: columnsToDisplay" ngb-row routerLink="../{{ it.id }}"></tr>
      </table>
    </div>

    <app-spinner-row [show]="isLoading" />
  `,
  selector: 'app-all-system-notifications',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    DatePipe,
    NgIf,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    DfxTr,
    AppIconsModule,
    AppSpinnerRowComponent,
    AppBtnToolbarComponent,
    AppSystemNotificationTypeBadgeComponent,
    AppActivatedPipe,
  ],
})
export class AllSystemNotificationsComponent extends AbstractModelsListWithDeleteComponent<GetSystemNotificationResponse> {
  constructor(private systemNotificationsService: SystemNotificationsService) {
    super(systemNotificationsService);
    this.columnsToDisplay = ['title', 'type', 'starts', 'ends', 'active', 'actions'];
  }

  override selectionEnabled = false;
  override nameMap = (it: GetSystemNotificationResponse) => it.title ?? it.type;
}
