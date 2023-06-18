import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';
import {AbstractModelsListComponent} from '../../../_shared/ui/abstract-models-list.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {DuplicateWaiterResponse} from '../../../_shared/waiterrobot-backend';
import {DuplicateWaitersService} from '../_services/duplicate-waiters.service';

@Component({
  template: `
    <h1 class="mb-3">{{ 'HOME_WAITERS_DUPLICATES' | tr }}</h1>

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
      <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort>
        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
          <td *ngbCellDef="let duplicateWaiter" ngb-cell>{{ duplicateWaiter.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="count">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'COUNT' | tr }}</th>
          <td *ngbCellDef="let duplicateWaiter" ngb-cell>
            {{ duplicateWaiter.waiters.length }}
          </td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let duplicateWaiter" ngb-cell>
            <a
              class="btn btn-sm m-1 btn-outline-danger"
              routerLink="./merge/&quot;{{ duplicateWaiter.name }}&quot;"
              ngbTooltip="{{ 'MERGE' | tr }}"
            >
              <i-bs name="union" />
            </a>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr
          *ngbRowDef="let duplicateWaiter; columns: columnsToDisplay"
          ngb-row
          class="clickable"
          routerLink="./merge/&quot;{{ duplicateWaiter.name }}&quot;"
        ></tr>
      </table>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    RouterLink,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    DfxTr,
    AppIconsModule,
    AppSpinnerRowComponent,
  ],
  selector: 'app-duplicate-organisation-waiters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DuplicateOrganisationWaitersComponent extends AbstractModelsListComponent<DuplicateWaiterResponse> {
  constructor(protected entitiesService: DuplicateWaitersService) {
    super(entitiesService);

    this.columnsToDisplay = ['name', 'count', 'actions'];
  }
}
