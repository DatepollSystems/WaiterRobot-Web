import {Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectOnDelete} from '@home-shared/form/edit';
import {injectIdParam$} from '@home-shared/services/injectActivatedRouteIdParam';

import {injectOnSubmit} from '@shared/form';
import {GetUserResponse, IdAndNameResponse} from '@shared/waiterrobot-backend';

import {filter, Observable, switchMap} from 'rxjs';
import {OrganisationsUsersService} from '../../../organisations/_services/organisations-users.service';
import {OrganisationsService} from '../../../organisations/_services/organisations.service';
import {UsersOrganisationsService} from '../services/users-organisations.service';
import {UsersService} from '../services/users.service';
import {UserEditFormComponent} from './user-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | transloco }} "{{ entity.firstname }} {{ entity.surname }}"</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />
          <div *isEditing="entity">
            <button type="button" class="btn btn-sm btn-outline-danger" (mousedown)="onDelete(entity.id)">
              <bi name="trash" />
              {{ 'DELETE' | transloco }}
            </button>
          </div>
        </scrollable-toolbar>

        <hr />

        <app-user-edit-form
          #form
          [user]="entity"
          [organisations]="organisations()"
          [selectedOrganisations]="selectedOrganisations()"
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
          (userOrganisations)="orgUserChange($event)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-user-edit',
  imports: [AppEntityEditModule, UserEditFormComponent],
  standalone: true,
})
export class UserEditComponent extends AbstractModelEditComponent<GetUserResponse> {
  onDelete = injectOnDelete((it: number) => this.usersService.delete$(it).subscribe());
  onSubmit = injectOnSubmit({entityService: this.usersService});

  constructor(private usersService: UsersService) {
    super(usersService);
  }

  usersOrganisationsService = inject(UsersOrganisationsService);
  organisationsUsersService = inject(OrganisationsUsersService);

  selectedOrganisations = toSignal(
    injectIdParam$().pipe(
      filter((id) => !Number.isNaN(id)),
      switchMap((id) => this.usersOrganisationsService.getByUserId$(id)),
    ),
    {
      initialValue: [],
    },
  );

  organisations = toSignal(inject(OrganisationsService).getAll$(), {initialValue: []});

  orgUserChange(organisations: IdAndNameResponse[]): void {
    const user = this.entity();

    if (!user || user === 'CREATE') {
      return;
    }

    const selectedOrganisations = this.selectedOrganisations().slice();
    const todos: Observable<unknown>[] = [];
    for (const organisation of organisations) {
      let contains = false;
      for (const org of selectedOrganisations) {
        if (organisation.id === org.id) {
          contains = true;
          break;
        }
      }
      if (!contains) {
        todos.push(this.organisationsUsersService.create$(organisation.id, user.emailAddress, {role: 'ADMIN'}));
      }
    }

    for (const org of selectedOrganisations) {
      let toDelete = true;
      for (const organisation of organisations) {
        if (org.id === organisation.id) {
          toDelete = false;
          break;
        }
      }
      if (toDelete) {
        todos.push(this.organisationsUsersService.delete$(org.id, user.emailAddress));
      }
    }

    for (const todo of todos) {
      todo.subscribe();
    }
  }
}
