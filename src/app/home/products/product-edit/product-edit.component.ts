import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {filter, map} from 'rxjs';

import {n_from, n_isNumeric} from 'dfts-helper';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '../../../_shared/ui/form/app-deleted.directives';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {CreateProductDto, GetProductMaxResponse, UpdateProductDto} from '../../../_shared/waiterrobot-backend';
import {SelectedEventService} from '../../events/_services/selected-event.service';
import {PrintersService} from '../../printers/_services/printers.service';
import {TableEditFormComponent} from '../../tables/table-edit/table-edit-form.component';
import {AllergensService} from '../_services/allergens.service';
import {ProductGroupsService} from '../_services/product-groups.service';
import {ProductsService} from '../_services/products.service';
import {AppProductEditFormComponent} from './product-edit-form.component';

@Component({
  template: `
    @if (entity$ | async; as entity) {
      <h1 *isCreating="entity">{{ 'HOME_PROD_ADD' | tr }}</h1>
      <h1 *isEditingAndNotDeleted="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isEditingAndDeleted="entity">{{ entity.name }} {{ 'DELETED' | tr }}</h1>

      <scrollable-toolbar>
        <back-button />
        <app-model-edit-save-btn *isNotDeleted="entity" (submit)="form?.submit()" [valid]="valid()" [editing]="entity !== 'CREATE'" />

        <ng-container *isEditingAndNotDeleted="entity">
          <div>
            <button class="btn btn-sm btn-danger" (click)="onDelete(entity.id)">
              <bi name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>

          <div>
            <button class="btn btn-sm btn-primary" routerLink="../groups/products/{{ entity.group.id }}">
              <bi name="diagram-3" />
              {{ 'HOME_PROD_GO_TO_GROUP' | tr }}
            </button>
          </div>
        </ng-container>
        <div class="d-flex align-items-center" *isCreating="entity">
          <app-continues-creation-switch (continuesCreationChange)="continuesCreation = $event" />
        </div>
      </scrollable-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs" (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            @if ((productGroups()?.length ?? 1) < 1) {
              @defer (on timer(200)) {
                <div class="alert alert-warning">
                  <a routerLink="../groups/create">{{ 'HOME_PROD_ADD_GROUP_FIRST' | tr }}</a>
                </div>
              }
            }
            <app-product-edit-form
              #form
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [allergens]="allergens()"
              [printers]="printers()"
              [productGroups]="productGroups() ?? []"
              [selectedEventId]="selectedEventId()"
              [selectedProductGroupId]="selectedProductGroupId()"
              [product]="entity"
              [formDisabled]="(productGroups()?.length ?? 1) < 1 || (entity !== 'CREATE' && !!entity.deleted)"
            />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2"></div>
    } @else {
      <app-spinner-row />
    }
  `,
  selector: 'app-product-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    AppFormModule,
    AppProductEditFormComponent,
    AppContinuesCreationSwitchComponent,
    TableEditFormComponent,
    AppDeletedDirectives,
    RouterLink,
  ],
})
export class ProductEditComponent extends AbstractModelEditComponent<CreateProductDto, UpdateProductDto, GetProductMaxResponse, 'DATA'> {
  defaultTab = 'DATA' as const;
  continuousUsePropertyNames = ['groupId', 'printerId', 'eventId', 'allergenIds'];

  selectedProductGroupId = toSignal(
    this.route.queryParams.pipe(
      map((params) => params.group as string),
      filter(n_isNumeric),
      map((id) => n_from(id)),
    ),
  );

  productGroups = toSignal(inject(ProductGroupsService).getAll$());
  printers = toSignal(inject(PrintersService).getAll$(), {initialValue: []});
  selectedEventId = inject(SelectedEventService).selectedId;
  allergens = toSignal(inject(AllergensService).getAll$(), {initialValue: []});

  constructor(productsService: ProductsService) {
    super(productsService);
  }
}
