import {DatePipe} from '@angular/common';
import {Component, inject, viewChild} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';

import {ListFilterComponent, injectTableFilter} from '@home-shared/list';

import {SelectedOrganisationService} from '@shared/services';
import {AppProgressBarComponent} from '@shared/ui/loading';

import {GDPRStore} from '../_services/gdpr.store';

@Component({
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">{{ 'NAV_SETTINGS_GDPR' | transloco }}</h1>

      <div>
        <button class="btn btn-success" (click)="gdprStore.newAgreement()">{{ 'HOME_ORGS_SETTINGS_NEW_GDPR_CONTRACT' | transloco }}</button>
      </div>

      <app-list-filter [filter]="filter" />

      <div class="table-responsive">
        <table [hover]="true" [dataSource]="gdprStore.dataSource()" ngb-table ngb-sort ngbSortActive="agreedOnAt" ngbSortDirection="desc">
          <ng-container ngbColumnDef="agreedOnAt">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_SETTINGS_GDPR_AGREED_AT' | transloco }}</th>
            <td *ngbCellDef="let agreement" ngb-cell>{{ agreement.agreedOnAt | date: 'dd.MM.YYYY HH:mm:ss' }}</td>
          </ng-container>

          <ng-container ngbColumnDef="agreedOnBy">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_ORGS_SETTINGS_GDPR_AGREED_BY' | transloco }}</th>
            <td *ngbCellDef="let agreement" ngb-cell>{{ agreement.agreedOnBy }}</td>
          </ng-container>

          <tr *ngbHeaderRowDef="gdprStore.columnsToDisplay()" ngb-header-row></tr>
          <tr *ngbRowDef="let agreement; columns: gdprStore.columnsToDisplay()" (mousedown)="gdprStore.load(agreement.id)" ngb-row></tr>
        </table>
      </div>

      <app-progress-bar [show]="gdprStore.isPending()" />
    </div>
  `,
  selector: 'wr-gdpr-list',
  standalone: true,
  imports: [TranslocoPipe, DfxSortModule, DfxTableModule, AppProgressBarComponent, DatePipe, ListFilterComponent],
})
export class GDPRList {
  #selectedOrganisationId$ = inject(SelectedOrganisationService).selectedIdNotNull$;

  gdprStore = inject(GDPRStore);
  filter = injectTableFilter();

  sort = viewChild(NgbSort);

  constructor() {
    this.gdprStore.setFilter(this.filter.value);
    this.gdprStore.setSort(this.sort);
    this.gdprStore.loadAll(this.#selectedOrganisationId$);
  }
}
