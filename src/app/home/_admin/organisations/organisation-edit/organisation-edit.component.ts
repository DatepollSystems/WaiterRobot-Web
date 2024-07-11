import {Component} from '@angular/core';

import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectOnDelete} from '@home-shared/form/edit';
import {injectOnSubmit} from '@shared/form';
import {GetOrganisationResponse} from '@shared/waiterrobot-backend';

import {OrganisationsService} from '../_services/organisations.service';
import {AppOrganisationEditFormComponent} from './organisation-edit-form.component';
import {OrganisationUsersSettingsComponent} from './organisation-edit-users/organisation-users-settings.component';

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
              <button type="button" class="btn btn-sm btn-outline-danger" (mousedown)="onDelete(entity.id)">
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
  standalone: true,
  imports: [AppEntityEditModule, AppOrganisationEditFormComponent, OrganisationUsersSettingsComponent],
})
export class OrganisationEditComponent extends AbstractModelEditComponent<GetOrganisationResponse> {
  onSubmit = injectOnSubmit({entityService: this.organisationsService});
  onDelete = injectOnDelete((it: number) => this.organisationsService.delete$(it).subscribe());

  constructor(private organisationsService: OrganisationsService) {
    super(organisationsService);
  }
}
