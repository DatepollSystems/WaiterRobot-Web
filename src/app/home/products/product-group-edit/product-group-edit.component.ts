import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';

import {combineLatest, map} from 'rxjs';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '../../../_shared/ui/form/app-deleted.directives';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {CreateProductGroupDto, GetProductGroupResponse, UpdateProductGroupDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {PrintersService} from '../../printers/_services/printers.service';
import {ProductGroupsService} from '../_services/product-groups.service';
import {ProductGroupEditFormComponent} from './product-group-edit-form.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isCreating="entity">{{ 'HOME_PROD_GROUPS_ADD' | tr }}</h1>
      <h1 *isEditingAndNotDeleted="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *isEditingAndDeleted="entity">{{ entity.name }} {{ 'DELETED' | tr }}</h1>

      <btn-toolbar>
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
            <a routerLink="../products/{{ entity.id }}" class="btn btn-sm btn-primary">
              <bi name="columns-gap" />
              {{ 'HOME_PROD_GROUP_SHOW_TABLES' | tr }}</a
            >
          </div>
        </ng-container>

        <div class="d-flex align-items-center" *isCreating="entity">
          <app-continues-creation-switch (continuesCreationChange)="continuesCreation = $event" />
        </div>
      </btn-toolbar>

      <ul
        ngbNav
        #nav="ngbNav"
        [destroyOnHide]="false"
        [activeId]="activeTab$ | async"
        class="nav-tabs"
        (navChange)="navigateToTab($event.nextId)"
      >
        <li [ngbNavItem]="'DATA'">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <app-product-group-edit-form
              #form
              *ngIf="vm$ | async as vm"
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [productGroup]="entity"
              [printers]="vm.printers"
              [selectedEventId]="vm.selectedEvent?.id"
              [formDisabled]="entity !== 'CREATE' && !!entity.deleted"
            />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2"></div>
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-product-group-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    DfxTr,
    NgbNavModule,
    BiComponent,
    AppFormModule,
    AppContinuesCreationSwitchComponent,
    ProductGroupEditFormComponent,
    AppDeletedDirectives,
  ],
})
export class ProductGroupEditComponent extends AbstractModelEditComponent<
  CreateProductGroupDto,
  UpdateProductGroupDto,
  GetProductGroupResponse,
  'DATA'
> {
  defaultTab = 'DATA' as const;

  override continuousUsePropertyNames = ['eventId'];

  vm$ = combineLatest([this.printersService.getAll$(), this.eventsService.getSelected$]).pipe(
    map(([printers, selectedEvent]) => ({
      printers,
      selectedEvent,
    })),
  );

  constructor(
    groupsService: ProductGroupsService,
    private printersService: PrintersService,
    private eventsService: EventsService,
  ) {
    super(groupsService);
  }
}
