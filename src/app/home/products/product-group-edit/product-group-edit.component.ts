import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';

import {combineLatest, map} from 'rxjs';

import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {AppBackButtonComponent} from '../../../_shared/ui/app-back-button.component';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppIsCreatingDirective} from '../../../_shared/ui/form/app-is-creating.directive';
import {AppIsEditingDirective} from '../../../_shared/ui/form/app-is-editing.directive';
import {AppModelEditSaveBtn} from '../../../_shared/ui/form/app-model-edit-save-btn.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {CreateProductGroupDto, GetProductGroupResponse, UpdateProductGroupDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {PrintersService} from '../../printers/_services/printers.service';
import {ProductGroupsService} from '../_services/product-groups.service';
import {ProductGroupEditFormComponent} from './product-group-edit-form.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} "{{ entity.name }}"</h1>
      <h1 *isCreating="entity">{{ 'HOME_PROD_GROUPS_ADD' | tr }}</h1>

      <btn-toolbar>
        <back-button />
        <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid$ | async" [editing]="entity !== 'CREATE'" />

        <div *isEditing="entity">
          <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
            <i-bs name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>

        <a *isEditing="entity" routerLink="../products/{{ entity.id }}" class="btn btn-sm btn-primary">
          <i-bs name="columns-gap" />
          {{ 'HOME_PROD_GROUP_SHOW_TABLES' | tr }}</a
        >

        <div class="d-flex align-items-center" *isCreating="entity">
          <app-continues-creation-switch (continuesCreationChange)="continuesCreation = $event" />
        </div>
      </btn-toolbar>

      <ul
        ngbNav
        #nav="ngbNav"
        [destroyOnHide]="false"
        [activeId]="activeTab$ | async"
        class="nav-tabs bg-dark"
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
            />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
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
    DfxTr,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    NgbNavOutlet,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
    AppIconsModule,
    AppIsEditingDirective,
    AppIsCreatingDirective,
    AppModelEditSaveBtn,
    AppContinuesCreationSwitchComponent,
    ProductGroupEditFormComponent,
    AppBackButtonComponent,
    RouterLink,
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
