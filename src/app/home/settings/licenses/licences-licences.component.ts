import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbDropdownItem} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';

import {ActionDropdownComponent} from '@home-shared/components/action-dropdown.component';
import {MyUserService} from '@home-shared/services/user/my-user.service';

import {EventLicencesLicencesStore, EventLicencesStore} from '../_services/event-licences.store';

@Component({
  template: `
    @let isAdmin = myUserService.user()?.isAdmin;
    @if (isAdmin) {
      <div class="d-flex gap-2 mb-2">
        <div>
          <a class="btn btn-sm btn-outline-success" routerLink="new" type="button">
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
    }
    <div class="table-responsive">
      <table [hover]="true" [dataSource]="eventLicencesLicencesStore.dataSource()" ngb-table ngb-sort ngbSortDirection="desc">
        <ng-container ngbColumnDef="select">
          <th *ngbHeaderCellDef ngb-header-cell>
            @if (isAdmin) {
              <div class="form-check">
                <input
                  class="form-check-input"
                  [checked]="eventLicencesLicencesStore.isAllSelected()"
                  (change)="eventLicencesLicencesStore.toggleAll()"
                  type="checkbox"
                  name="checked"
                />
              </div>
            }
          </th>
          <td *ngbCellDef="let selectable" ngb-cell stopPropagation>
            @if (isAdmin) {
              <div class="form-check">
                <input
                  class="form-check-input"
                  [checked]="eventLicencesLicencesStore.isSelected(selectable)"
                  (change)="eventLicencesLicencesStore.toggle(selectable, !eventLicencesLicencesStore.isSelected(selectable))"
                  type="checkbox"
                  name="checked"
                />
              </div>
            }
          </td>
        </ng-container>

        <ng-container ngbColumnDef="start">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
            {{ 'Start' | transloco }}
          </th>
          <td *ngbCellDef="let licence" ngb-cell>
            {{ licence.start | date: 'YYYY.MM.dd - HH:mm:ss' }}
          </td>
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

        <ng-container ngbColumnDef="note">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>
            {{ 'Note' | transloco }}
          </th>
          <td *ngbCellDef="let licence" ngb-cell>
            {{ licence.note }}
          </td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>
            <span class="visually-hidden">{{ 'ACTIONS' | transloco }}</span>
          </th>
          <td *ngbCellDef="let licence" ngb-cell>
            <app-action-dropdown>
              <button
                class="d-flex gap-2 align-items-center text-danger-emphasis"
                (mousedown)="eventLicencesStore.delete(licence.id)"
                type="button"
                ngbDropdownItem
              >
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </app-action-dropdown>
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
  imports: [
    ReactiveFormsModule,
    DatePipe,
    DfxTableModule,
    DfxSortModule,
    TranslocoPipe,
    BiComponent,
    StopPropagationDirective,
    RouterLink,
    ActionDropdownComponent,
    NgbDropdownItem,
  ],
})
export class LicencesLicencesComponent {
  myUserService = inject(MyUserService);
  eventLicencesStore = inject(EventLicencesStore);
  eventLicencesLicencesStore = inject(EventLicencesLicencesStore);

  sort = viewChild(NgbSort);

  constructor() {
    this.eventLicencesLicencesStore.setSort(this.sort);
  }
}
