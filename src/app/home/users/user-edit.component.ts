import {AsyncPipe, NgIf} from '@angular/common';
import {Component} from '@angular/core';

import {NgbDatepickerModule, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AbstractModelEditComponentV2} from '../../_shared/ui/form/abstract-model-edit.component-v2';
import {AppIsCreatingDirective} from '../../_shared/ui/form/app-is-creating.directive';
import {AppIsEditingDirective} from '../../_shared/ui/form/app-is-editing.directive';
import {AppModelEditSaveBtn} from '../../_shared/ui/form/app-model-edit-save-btn.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {CreateUserDto, GetUserResponse, UpdateUserDto} from '../../_shared/waiterrobot-backend';
import {UserEditFormComponent} from './user-edit-form.component';

import {UsersService} from './users.service';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} "{{ entity.firstname }} {{ entity.surname }}"</h1>
      <h1 *isCreating="entity">{{ 'ADD_2' | tr }}</h1>

      <btn-toolbar>
        <div>
          <button class="btn btn-sm btn-dark text-white" (click)="onGoBack('/home/users/all')">{{ 'GO_BACK' | tr }}</button>
        </div>

        <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid$ | async" [editing]="entity !== 'CREATE'" />

        <div *isEditing="entity">
          <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
            <i-bs name="trash"></i-bs>
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
        (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <app-user-edit-form
              #form
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [user]="entity"></app-user-edit-form>
          </ng-template>
        </li>
        <li [ngbNavItem]="'ORGS'">
          <a ngbNavLink>{{ 'NAV_ORGANISATIONS' | tr }}</a>
          <ng-template ngbNavContent> Coming soon...</ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-user-edit',
  imports: [
    AsyncPipe,
    NgIf,
    DfxTr,
    NgbDatepickerModule,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    NgbNavOutlet,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
    AppIconsModule,
    AppIsCreatingDirective,
    AppIsEditingDirective,
    AppModelEditSaveBtn,
    UserEditFormComponent,
  ],
  standalone: true,
})
export class UserEditComponent extends AbstractModelEditComponentV2<CreateUserDto, UpdateUserDto, GetUserResponse, 'DATA' | 'ORGS'> {
  defaultTab = 'DATA' as const;
  override redirectUrl = '/home/users/all';

  constructor(usersService: UsersService) {
    super(usersService);
  }
}
