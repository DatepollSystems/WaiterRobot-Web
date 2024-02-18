import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '@home-shared/form/app-continues-creation-switch.component';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectContinuousCreation, injectOnDelete, injectTabControls} from '@home-shared/form/edit';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {injectOnSubmit} from '@shared/form';
import {GetPrinterResponse} from '@shared/waiterrobot-backend';

import {SelectedEventService} from '../../events/_services/selected-event.service';
import {OrganisationEditUsersComponent} from '../../organisations/organisation-edit/organisation-edit-users.component';
import {PrintersService} from '../_services/printers.service';
import {AppPrinterEditForm} from './printer-edit-form.component';
import {PrinterEditProductsComponent} from './printer-edit-products.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditing="entity">
            <div>
              <button type="button" class="btn btn-sm btn-danger" (click)="onDelete(entity.id)">
                <bi name="trash" />
                {{ 'DELETE' | tr }}
              </button>
            </div>
          </ng-container>

          <div *isCreating="entity" class="d-flex align-items-center">
            <app-continues-creation-switch (continuesCreationChange)="continuousCreation.set($event)" />
          </div>
        </scrollable-toolbar>

        <hr />

        <ul
          #nav="ngbNav"
          ngbNav
          class="nav-tabs"
          [activeId]="tabControls.activeTab()"
          (navChange)="tabControls.navigateToTab($event.nextId)"
        >
          <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
            <a ngbNavLink>{{ 'DATA' | tr }}</a>
            <ng-template ngbNavContent>
              <app-printer-edit-form
                #form
                [selectedEventId]="selectedEvent()"
                [availableFonts]="fonts()"
                [printer]="entity"
                (submitUpdate)="onSubmit('UPDATE', $event)"
                (submitCreate)="onSubmit('CREATE', $event)"
              />
            </ng-template>
          </li>

          <li *isEditing="entity" [ngbNavItem]="'PRODUCTS'" [destroyOnHide]="true">
            <a ngbNavLink>{{ 'HOME_PROD_ALL' | tr }}</a>
            <ng-template ngbNavContent>
              <app-printer-edit-products *isEditing="entity" [products]="entity.products" />
            </ng-template>
          </li>
        </ul>

        <div [ngbNavOutlet]="nav"></div>
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-printer-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppEntityEditModule,
    AppPrinterEditForm,
    AppContinuesCreationSwitchComponent,
    PrinterEditProductsComponent,
    NgbNavModule,
    OrganisationEditUsersComponent,
  ],
})
export class PrinterEditComponent extends AbstractModelEditComponent<GetPrinterResponse> {
  onDelete = injectOnDelete((it: number) => this.printersService.delete$(it).subscribe());
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['eventId', 'font', 'bonWidth', 'bonPadding', 'bonPaddingTop'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.printersService,
    continuousCreation: {
      enabled: this.continuousCreation.enabled,
      patch: this.continuousCreation.patch,
    },
  });

  tabControls = injectTabControls<'DATA' | 'PRODUCTS'>({
    onlyEditingTabs: ['PRODUCTS'],
    defaultTab: 'DATA',
    isCreating: computed(() => this.entity() === 'CREATE'),
  });

  selectedEvent = inject(SelectedEventService).selectedId;

  fonts = toSignal(this.printersService.getAllFonts$(), {initialValue: []});

  constructor(private printersService: PrintersService) {
    super(printersService);
  }
}
