import {ChangeDetectionStrategy, Component, computed, inject, viewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {UnknownModelEditFormComponent} from '../../../forms/form/abstract-model-edit-form.component';
import {AppContinuesCreationSwitchComponent} from '../../../forms/form/app-continues-creation-switch.component';
import {AppEntityEditModule} from '../../../forms/form/app-entity-edit.module';
import {injectContinuousCreation, injectEditEntity, injectOnDelete, injectTabControls} from '../../../forms/form/edit';
import {SelectedEventService} from '../../../services/selected-event.service';
import {injectOnSubmit} from '../../../util/form';
import {PrintersService} from '../_services/printers.service';
import {AppPrinterEditForm} from './printer-edit-form.component';
import {PrinterEditProductsComponent} from './printer-edit-products.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">
          {{ 'EDIT_2' | transloco }} {{ entity.name }}
          {{ 'NAV_PRINTERS' | transloco }}
        </h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditing="entity">
            <div>
              <button class="btn btn-sm btn-danger" (mousedown)="onDelete(entity.id)" type="button">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>
          </ng-container>

          <div class="d-flex align-items-center" *isCreating="entity">
            <app-continues-creation-switch (continuesCreationChange)="continuousCreation.set($event)" />
          </div>
        </scrollable-toolbar>

        <hr />

        <ul
          class="nav-tabs"
          #nav="ngbNav"
          [activeId]="tabControls.activeTab()"
          (navChange)="tabControls.navigateToTab($event.nextId)"
          ngbNav
        >
          <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
            <a ngbNavLink>{{ 'DATA' | transloco }}</a>
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
            <a ngbNavLink>{{ 'HOME_PROD_ALL' | transloco }}</a>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppEntityEditModule, AppPrinterEditForm, AppContinuesCreationSwitchComponent, PrinterEditProductsComponent, NgbNavModule],
})
export class PrinterEditComponent {
  #printersService = inject(PrintersService);

  form = viewChild<UnknownModelEditFormComponent>('form');

  entity = injectEditEntity({
    get$: (id) => this.#printersService.getSingle$(id),
  });

  onDelete = injectOnDelete((it: number) => this.#printersService.delete$(it).subscribe());
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['eventId', 'font', 'bonWidth', 'bonPadding', 'bonPaddingTop'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.#printersService,
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

  fonts = toSignal(this.#printersService.getAllFonts$(), {initialValue: []});
}
