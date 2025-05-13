import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';

import {EventLicencesLicencesStore} from '../_services/event-licences.store';

@Component({
  template: `
    <div class="d-flex gap-2">
      <div>
        <a class="btn btn-sm btn-outline-success" routerLink="../../l/new" type="button">
          <bi name="plus-circle" />
          {{ 'ADD_2' | transloco }}
        </a>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-danger" [class.disabled]="!eventLicencesLicencesStore.hasValue()" type="button">
          <bi name="trash" />
          {{ 'DELETE' | transloco }}
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table [hover]="true" [dataSource]="eventLicencesLicencesStore.dataSource()" ngb-table ngb-sort ngbSortDirection="desc">
        <ng-container ngbColumnDef="select">
          <th *ngbHeaderCellDef ngb-header-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                [checked]="eventLicencesLicencesStore.isAllSelected()"
                (change)="eventLicencesLicencesStore.toggleAll()"
                type="checkbox"
                name="checked"
              />
            </div>
          </th>
          <td *ngbCellDef="let selectable" ngb-cell stopPropagation>
            <div class="form-check">
              <input
                class="form-check-input"
                [checked]="eventLicencesLicencesStore.isSelected(selectable)"
                (change)="eventLicencesLicencesStore.toggle(selectable, !eventLicencesLicencesStore.isSelected(selectable))"
                type="checkbox"
                name="checked"
              />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="start">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
            {{ 'Start' | transloco }}
          </th>
          <td *ngbCellDef="let licence" ngb-cell>{{ licence.start }}</td>
        </ng-container>

        <ng-container ngbColumnDef="end">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
            {{ 'End' | transloco }}
          </th>
          <td *ngbCellDef="let licence" ngb-cell>
            {{ licence.end | date: 'YYYY.MM.dd - HH:mm:ss' }}
          </td>
        </ng-container>

        <ng-container ngbColumnDef="hours">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
            {{ 'Hours' | transloco }}
          </th>
          <td *ngbCellDef="let licence" ngb-cell>
            {{ licence.hours }}
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="eventLicencesLicencesStore.columnsToDisplay()" ngb-header-row></tr>
        <tr *ngbRowDef="let session; columns: eventLicencesLicencesStore.columnsToDisplay()" ngb-row></tr>
      </table>
    </div>

    @if (eventLicencesLicencesStore.isEmpty()) {
      <div class="w-100 text-center">Keine Lizenzen verfügbar.</div>
    }
  `,
  selector: 'app-event-licences-licences',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DatePipe, DfxTableModule, DfxSortModule, TranslocoPipe, BiComponent, StopPropagationDirective, RouterLink],
})
export class EventLicencesLicencesComponent {
  eventLicencesLicencesStore = inject(EventLicencesLicencesStore);

  sort = viewChild(NgbSort);

  constructor() {
    this.eventLicencesLicencesStore.setSort(this.sort);
  }
}
