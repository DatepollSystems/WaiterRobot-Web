import {AsyncPipe, NgIf} from '@angular/common';
import {Component} from '@angular/core';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {CreateUserDto, GetUserResponse, UpdateUserDto} from '../../../_shared/waiterrobot-backend';
import {UsersService} from '../services/users.service';
import {UserEditFormComponent} from './user-edit-form.component';
import {UserEditOrganisationsComponent} from './user-edit-organisations.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} "{{ entity.firstname }} {{ entity.surname }}"</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <btn-toolbar>
        <back-button />
        <app-model-edit-save-btn
          *ngIf="(activeTab$ | async) === 'DATA'"
          (submit)="form?.submit()"
          [valid]="valid()"
          [editing]="entity !== 'CREATE'"
        />

        <div *isEditing="entity">
          <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
            <bi name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>
      </btn-toolbar>

      <ul
        ngbNav
        #nav="ngbNav"
        [activeId]="activeTab$ | async"
        [destroyOnHide]="false"
        class="nav-tabs bg-dark"
        (navChange)="navigateToTab($event.nextId)"
      >
        <li [ngbNavItem]="'DATA'">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <app-user-edit-form
              #form
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [user]="entity"
            />
          </ng-template>
        </li>
        <li [ngbNavItem]="'ORGS'" *isEditing="entity">
          <a ngbNavLink>{{ 'NAV_ORGANISATIONS' | tr }}</a>
          <ng-template ngbNavContent>
            <app-user-edit-organisations [user]="entity" />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-user-edit',
  imports: [AsyncPipe, NgIf, DfxTr, NgbNavModule, AppFormModule, BiComponent, UserEditFormComponent, UserEditOrganisationsComponent],
  standalone: true,
})
export class UserEditComponent extends AbstractModelEditComponent<CreateUserDto, UpdateUserDto, GetUserResponse, 'DATA' | 'ORGS'> {
  defaultTab = 'DATA' as const;
  onlyEditingTabs = ['ORGS' as const];

  constructor(usersService: UsersService) {
    super(usersService);
  }
}
