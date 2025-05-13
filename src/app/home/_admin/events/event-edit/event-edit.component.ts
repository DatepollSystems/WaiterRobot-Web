import {ChangeDetectionStrategy, Component, computed, inject, numberAttribute} from '@angular/core';

import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';
import {injectQueryParams} from 'ngxtension/inject-query-params';

import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectEditEntity, injectOnDelete, injectTabControls} from '@home-shared/form/edit';

import {injectOnSubmit} from '@shared/form';

import {EventsService} from '../_services/events.service';
import {AppEventEditFormComponent} from './event-edit-form.component';
import {EventLicencesComponent} from './event-licences.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | transloco }} {{ entity.name }}</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditing="entity">
            <div>
              <button class="btn btn-sm btn-outline-danger" (mousedown)="onDelete(entity.id)" type="button">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>
          </ng-container>
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
              <app-event-edit-form
                [selectedOrganisationId]="entity !== 'CREATE' ? entity.organisationId : selectedOrganisationId()"
                [event]="entity"
                (submitUpdate)="onSubmit('UPDATE', $event)"
                (submitCreate)="onSubmit('CREATE', $event)"
              />
            </ng-template>
          </li>
          <li *isEditing="entity" [ngbNavItem]="'LICENSES'" [destroyOnHide]="true">
            <a ngbNavLink>{{ 'Licenses' | transloco }}</a>
            <ng-template ngbNavContent>
              <app-event-licences />
            </ng-template>
          </li>
        </ul>

        <div [ngbNavOutlet]="nav"></div>
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-event-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppEntityEditModule,
    BiComponent,
    AppEventEditFormComponent,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    NgbNavOutlet,
    EventLicencesComponent,
  ],
})
export class EventEditComponent {
  #eventsService = inject(EventsService);

  entity = injectEditEntity({
    get$: (id) => this.#eventsService.getSingle$(id),
  });

  onDelete = injectOnDelete((it: number) => this.#eventsService.delete$(it).subscribe());
  onSubmit = injectOnSubmit({entityService: this.#eventsService});

  selectedOrganisationId = injectQueryParams('orgId', {
    transform: numberAttribute,
  });

  tabControls = injectTabControls<'DATA' | 'LICENSES'>({
    onlyEditingTabs: ['LICENSES'],
    defaultTab: 'DATA',
    isCreating: computed(() => this.entity() === 'CREATE'),
  });
}
