import {Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {Observable, filter, forkJoin, switchMap} from 'rxjs';

import {APIType} from '../../../api';
import {AppEntityEditModule} from '../../../forms/form/app-entity-edit.module';
import {injectEditEntity, injectOnDelete} from '../../../forms/form/edit';
import {UserEditForm} from '../../../forms/user-edit-form';
import {injectIdParam$} from '../../../services/injectActivatedRouteIdParam';
import {OrganisationsUsersService} from '../../../services/organisations/organisations-users.service';
import {OrganisationsService} from '../../../services/organisations/organisations.service';
import {UsersOrganisationsService} from '../../../services/users/users-organisations.service';
import {UsersService} from '../../../services/users/users.service';
import {injectOnSubmit} from '../../../util/form';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | transloco }} "{{ entity.firstname }} {{ entity.surname }}"</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />
          <div *isEditing="entity">
            <button class="btn btn-sm btn-outline-danger" (mousedown)="onDelete(entity.id)" type="button">
              <bi name="trash" />
              {{ 'DELETE' | transloco }}
            </button>
          </div>
        </scrollable-toolbar>

        <hr />

        <user-edit-form
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
  selector: 'user-edit-page',
  imports: [AppEntityEditModule, UserEditForm],
})
export class UserEditPage {
  #usersService = inject(UsersService);

  entity = injectEditEntity({
    get$: (id) => this.#usersService.getSingle$(id),
  });

  onDelete = injectOnDelete((it: number) => this.#usersService.delete$(it).subscribe());
  onSubmit = injectOnSubmit({entityService: this.#usersService});

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

  organisations = toSignal(inject(OrganisationsService).getAll$(), {
    initialValue: [],
  });

  orgUserChange(organisations: APIType['IdAndNameResponse'][]): void {
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

    forkJoin(todos).subscribe();
  }
}
