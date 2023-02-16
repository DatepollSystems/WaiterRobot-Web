import {DatePipe, NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {AbstractModelsListComponent} from '../../../_shared/ui/abstract-models-list.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';

import {QuestionDialogComponent} from '../../../_shared/ui/question-dialog/question-dialog.component';

import {SessionModel} from '../../user-settings/_models/session.model';
import {WaiterSessionsService} from '../_services/waiter-sessions.service';

@Component({
  template: `
    <app-spinner-row [show]="!entitiesLoaded"></app-spinner-row>

    <form [hidden]="!entitiesLoaded" class="d-flex flex-column flex-sm-row gap-2">
      <div class="flex-grow-1">
        <div class="input-group">
          <input class="form-control bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
          <button
            class="btn btn-outline-secondary"
            type="button"
            ngbTooltip="{{ 'CLEAR' | tr }}"
            placement="bottom"
            (click)="filter.reset()"
            *ngIf="filter?.value?.length > 0">
            <i-bs name="x-circle-fill"></i-bs>
          </button>
        </div>
      </div>

      <div>
        <button class="btn btn-outline-danger" (click)="deleteAll()">{{ 'DELETE_ALL' | tr }}</button>
      </div>
    </form>

    <div class="table-responsive" [hidden]="!entitiesLoaded">
      <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="updatedAt" ngbSortDirection="desc">
        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
          <td *ngbCellDef="let session" ngb-cell>{{ session.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="registeredAt">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERSETTINGS_SESSIONS_REGISTERED_AT' | tr }}</th>
          <td *ngbCellDef="let session" ngb-cell>{{ session.registeredAt | date : 'YYYY.MM.dd - HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="updatedAt">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'HOME_USERSETTINGS_SESSIONS_UPDATED_AT' | tr }}</th>
          <td *ngbCellDef="let session" ngb-cell>{{ session.updatedAt | date : 'YYYY.MM.dd - HH:mm:ss' }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let session" ngb-cell>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              placement="left"
              (click)="onDelete(session.id)">
              <i-bs name="trash"></i-bs>
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let table; columns: columnsToDisplay" ngb-row></tr>
      </table>
    </div>
  `,
  selector: 'app-waiter-sessions',
  standalone: true,
  imports: [NgbTooltip, NgIf, AppIconsModule, ReactiveFormsModule, AppSpinnerRowComponent, DfxTableModule, DfxSortModule, DatePipe, DfxTr],
})
export class WaiterSessionsComponent extends AbstractModelsListComponent<SessionModel> {
  override columnsToDisplay = ['name', 'registeredAt', 'updatedAt', 'actions'];

  constructor(sessionsService: WaiterSessionsService) {
    super(sessionsService);
  }

  deleteAll(): void {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      this.lumber.info('onDelete', 'Question dialog result:', result);
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        for (const session of this.entities) {
          this.entitiesService.delete(session.id).subscribe();
        }
      }
    });
  }
}
