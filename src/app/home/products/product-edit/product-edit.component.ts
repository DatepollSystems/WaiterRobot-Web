import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '@home-shared/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '@home-shared/form/app-entity-deleted.directives';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectContinuousCreation, injectOnDelete} from '@home-shared/form/edit';
import {AppSoldOutPipe} from '@home-shared/pipes/app-sold-out.pipe';
import {injectOnSubmit} from '@shared/form';
import {GetProductMaxResponse} from '@shared/waiterrobot-backend';

import {n_from, n_isNumeric} from 'dfts-helper';

import {filter, map} from 'rxjs';

import {SelectedEventService} from '../../_admin/events/_services/selected-event.service';
import {PrintersService} from '../../printers/_services/printers.service';
import {AllergensService} from '../_services/allergens.service';
import {ProductGroupsService} from '../_services/product-groups.service';
import {ProductsService} from '../_services/products.service';
import {AppProductEditFormComponent} from './product-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isCreating="entity">{{ 'HOME_PROD_ADD' | transloco }}</h1>
        <div *isEditingAndNotDeleted="entity" class="d-flex gap-3 align-items-center">
          <h1>{{ 'EDIT_2' | transloco }} {{ entity.name }}</h1>
          <span class="fs-4 mb-1">{{ entity.soldOut | soldOut }}</span>
        </div>
        <h1 *isEditingAndDeleted="entity">{{ entity.name }} {{ 'DELETED' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />
          <ng-container *isEditingAndNotDeleted="entity">
            <div>
              <button type="button" class="btn btn-sm btn-danger" (mousedown)="onDelete(entity.id)">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>

            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../../orders" [queryParams]="{productIds: entity.id}">
                <bi name="stack" />
                {{ 'NAV_ORDERS' | transloco }}
              </a>
            </div>
            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../../bills" [queryParams]="{productIds: entity.id}">
                <bi name="cash-coin" />
                {{ 'NAV_BILLS' | transloco }}
              </a>
            </div>
          </ng-container>
          <div *isCreating="entity" class="d-flex align-items-center">
            <app-continues-creation-switch (continuesCreationChange)="continuousCreation.set($event)" />
          </div>
        </scrollable-toolbar>

        <hr />

        @defer (on timer(200)) {
          @if ((productGroups()?.length ?? 1) < 1) {
            <div class="alert alert-warning d-flex gap-2">
              <bi name="exclamation-triangle-fill" />
              <a class="link-warning" routerLink="../../../product-groups/create">{{ 'HOME_PROD_ADD_GROUP_FIRST' | transloco }}</a>
            </div>
          }
          @if ((printers()?.length ?? 1) < 1) {
            <div class="alert alert-warning d-flex gap-2">
              <bi name="exclamation-triangle-fill" />
              <a class="link-warning" routerLink="../../../printers/create">{{ 'HOME_PROD_ADD_PRINTER_FIRST' | transloco }}</a>
            </div>
          }
        }
        <app-product-edit-form
          #form
          [allergens]="allergens()"
          [printers]="printers() ?? []"
          [productGroups]="productGroups() ?? []"
          [selectedEventId]="selectedEventId()"
          [selectedProductGroupId]="selectedProductGroupId()"
          [product]="entity"
          [formDisabled]="formDisabled()"
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-product-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    AppEntityEditModule,
    AppProductEditFormComponent,
    AppContinuesCreationSwitchComponent,
    AppDeletedDirectives,
    AppSoldOutPipe,
  ],
})
export class ProductEditComponent extends AbstractModelEditComponent<GetProductMaxResponse> {
  onDelete = injectOnDelete((it: number) => this.productsService.delete$(it).subscribe());
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['groupId', 'printerId', 'eventId', 'allergenIds'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.productsService,
    continuousCreation: {
      enabled: this.continuousCreation.enabled,
      patch: this.continuousCreation.patch,
    },
  });

  selectedProductGroupId = toSignal(
    this.route.queryParams.pipe(
      map((params) => params.group as string),
      filter(n_isNumeric),
      map((id) => n_from(id)),
    ),
  );

  productGroups = toSignal(inject(ProductGroupsService).getAll$());
  printers = toSignal(inject(PrintersService).getAll$());
  selectedEventId = inject(SelectedEventService).selectedId;
  allergens = toSignal(inject(AllergensService).getAll$(), {initialValue: []});

  formDisabled = computed(() => {
    if ((this.productGroups()?.length ?? 1) < 1) {
      return true;
    }
    if ((this.printers()?.length ?? 1) < 1) {
      return true;
    }
    const entity = this.entity();
    if (entity !== 'CREATE' && !!entity?.deleted) {
      return true;
    }
    return false;
  });

  constructor(private productsService: ProductsService) {
    super(productsService);
  }
}
