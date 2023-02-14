import {ChangeDetectionStrategy, Component} from '@angular/core';

import {ProductGroupsService} from './_services/product-groups.service';
import {DfxTr} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {RouterLink} from '@angular/router';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {AsyncPipe, NgIf} from '@angular/common';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {AbstractModelsListWithDeleteComponent} from '../../_shared/ui/abstract-models-list-with-delete.component';
import {GetProductGroupResponse} from '../../_shared/waiterrobot-backend';

@Component({
  template: `
    <h1>{{ 'HOME_PROD_GROUP' | tr }}</h1>

    <btn-toolbar>
      <div>
        <a routerLink="../create" class="btn btn-sm btn-outline-success">
          <i-bs name="plus-circle"></i-bs>
          {{ 'ADD_2' | tr }}</a
        >
      </div>
      <div *ngIf="selection">
        <button class="btn btn-sm btn-outline-danger" [class.disabled]="!selection.hasValue()" (click)="onDeleteSelected()">
          <i-bs name="trash"></i-bs>
          {{ 'DELETE' | tr }}
        </button>
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
          *ngIf="(filter.value?.length ?? 0) > 0">
          <i-bs name="x-circle-fill"></i-bs>
        </button>
      </div>
    </form>

    <div class="table-responsive" *ngIf="dataSource$ | async as dataSource; else loading">
      <table ngb-table [hover]="true" [dataSource]="dataSource" ngb-sort ngbSortActive="name" ngbSortDirection="asc">
        <ng-container ngbColumnDef="select">
          <th *ngbHeaderCellDef ngb-header-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (change)="$event ? toggleAllRows() : null"
                [checked]="selection!.hasValue() && isAllSelected()" />
            </div>
          </th>
          <td *ngbCellDef="let selectable" ngb-cell>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="checked"
                (click)="$event.stopPropagation()"
                (change)="$event ? selection!.toggle(selectable) : null"
                [checked]="selection!.isSelected(selectable)" />
            </div>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="name">
          <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
          <td *ngbCellDef="let productGroup" ngb-cell>{{ productGroup.name }}</td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let productGroup" ngb-cell>
            <a class="btn btn-sm m-1 btn-outline-success text-white" routerLink="../{{ productGroup.id }}" ngbTooltip="{{ 'EDIT' | tr }}">
              <i-bs name="pencil-square"></i-bs>
            </a>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onDelete(productGroup.id, $event)">
              <i-bs name="trash"></i-bs>
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let productGroup; columns: columnsToDisplay" ngb-row routerLink="../{{ productGroup.id }}"></tr>
      </table>
    </div>

    <ng-template #loading>
      <app-spinner-row></app-spinner-row>
    </ng-template>
  `,
  selector: 'app-product-groups',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    NgIf,
    DfxTr,
    DfxTableModule,
    DfxSortModule,
    NgbTooltip,
    AppBtnToolbarComponent,
    AppIconsModule,
    AppSpinnerRowComponent,
  ],
})
export class ProductGroupsComponent extends AbstractModelsListWithDeleteComponent<GetProductGroupResponse> {
  override columnsToDisplay = ['name', 'actions'];

  constructor(entitiesService: ProductGroupsService) {
    super(entitiesService);

    this.setSelectable();
  }
}