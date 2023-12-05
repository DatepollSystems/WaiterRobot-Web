import {Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {Observable, switchMap} from 'rxjs';

import {AbstractModelEditComponent} from '../../../_shared/form/abstract-model-edit.component';
import {AppEntityEditModule} from '../../../_shared/form/app-entity-edit.module';
import {injectOnDelete} from '../../../_shared/form/edit';
import {injectOnSubmit} from '../../../../_shared/form';
import {GetUserResponse, IdAndNameResponse} from '../../../../_shared/waiterrobot-backend';
import {injectIdParam$} from '../../../_shared/services/injectActivatedRouteIdParam';
import {OrganisationsUsersService} from '../../../organisations/_services/organisations-users.service';
import {OrganisationsService} from '../../../organisations/_services/organisations.service';
import {UsersOrganisationsService} from '../services/users-organisations.service';
import {UsersService} from '../services/users.service';
import {UserEditFormComponent} from './user-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} "{{ entity.firstname }} {{ entity.surname }}"</h1>
        <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

        <scrollable-toolbar>
          <back-button />
          <div *isEditing="entity">
            <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
              <bi name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>
        </scrollable-toolbar>

        <hr />

        <app-user-edit-form
          #form
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
          (userOrganisations)="orgUserChange($event)"
          [user]="entity"
          [organisations]="organisations()"
          [selectedOrganisations]="selectedOrganisations()"
        />
      </div>
    } @else {
      <app-spinner-row />
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

  selectedOrganisations = toSignal(injectIdParam$().pipe(switchMap((id) => this.usersOrganisationsService.getByUserId$(id))), {
    initialValue: [],
  });

  organisations = toSignal(inject(OrganisationsService).getAll$(), {initialValue: []});

  orgUserChange(organisations: IdAndNameResponse[]): void {
    const user = this.entity();

    if (!user || user === 'CREATE') {
      return;
    }

    const selectedOrganisations = this.selectedOrganisations().slice();
    console.log(organisations);
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
