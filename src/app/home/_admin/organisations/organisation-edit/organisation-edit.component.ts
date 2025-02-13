import {Component, inject} from '@angular/core';

import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectEditEntity, injectOnDelete} from '@home-shared/form/edit';

import {injectOnSubmit} from '@shared/form';

import {OrganisationsService} from '../_services/organisations.service';
import {AppOrganisationEditFormComponent} from './organisation-edit-form.component';

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

        <div class="mt-1"></div>

        <app-organisation-edit-form
          #form
          [organisation]="entity"
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-organisation-edit',
  imports: [AppEntityEditModule, AppOrganisationEditFormComponent],
})
export class OrganisationEditComponent {
  #organisationsService = inject(OrganisationsService);

  entity = injectEditEntity({
    get$: (id) => this.#organisationsService.getSingle$(id),
  });

  onSubmit = injectOnSubmit({entityService: this.#organisationsService});
  onDelete = injectOnDelete((it: number) => this.#organisationsService.delete$(it).subscribe());
}
