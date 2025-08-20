import {Component, inject} from '@angular/core';

import {AppEntityEditModule} from '../../../forms/form/app-entity-edit.module';
import {injectEditEntity, injectOnDelete} from '../../../forms/form/edit';
import {OrganisationEditForm} from '../../../forms/organisation-edit-form';
import {OrganisationsService} from '../../../services/organisations/organisations.service';
import {injectOnSubmit} from '../../../util/form';

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

        <organisation-edit-form
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
  selector: 'organisation-edit-page',
  imports: [AppEntityEditModule, OrganisationEditForm],
})
export class OrganisationEditPage {
  #organisationsService = inject(OrganisationsService);

  entity = injectEditEntity({
    get$: (id) => this.#organisationsService.getSingle$(id),
  });

  onSubmit = injectOnSubmit({entityService: this.#organisationsService});
  onDelete = injectOnDelete((it: number) => this.#organisationsService.delete$(it).subscribe());
}
