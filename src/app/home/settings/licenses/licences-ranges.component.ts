import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';

import {EventLicencesRangesStore} from '../_services/event-licences.store';

@Component({
  template: `
    <div class="table-responsive">
      <table [hover]="true" [dataSource]="eventLicencesRangesStore.dataSource()" ngb-table ngb-sort ngbSortDirection="desc">
        <ng-container ngbColumnDef="startDate">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
            {{ 'Start' | transloco }}
          </th>
          <td *ngbCellDef="let licence" ngb-cell>
            {{ licence.startDate | date: 'YYYY.MM.dd - HH:mm:ss' }}
          </td>
        </ng-container>

        <ng-container ngbColumnDef="endDate">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
            {{ 'End' | transloco }}
          </th>
          <td *ngbCellDef="let licence" ngb-cell>
            {{ licence.endDate | date: 'YYYY.MM.dd - HH:mm:ss' }}
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="eventLicencesRangesStore.columnsToDisplay()" ngb-header-row></tr>
        <tr *ngbRowDef="let session; columns: eventLicencesRangesStore.columnsToDisplay()" ngb-row></tr>
      </table>
    </div>

    @if (eventLicencesRangesStore.isEmpty()) {
      <div class="w-100 text-center">Keine Lizenzen verfügbar.</div>
    }
  `,
  selector: 'app-event-licences-ranges',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DatePipe, DfxTableModule, DfxSortModule, TranslocoPipe],
})
export class LicencesRangesComponent {
  eventLicencesRangesStore = inject(EventLicencesRangesStore);

  sort = viewChild(NgbSort);

  constructor() {
    this.eventLicencesRangesStore.setSort(this.sort);
  }
}
