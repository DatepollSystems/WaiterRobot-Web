import {NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {NgbDatepickerModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {d_from} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';
import {AbstractModelEditComponent} from '../../_shared/ui/abstract-model-edit.component';
import {AppBtnModelEditConfirmComponent} from '../../_shared/ui/app-btn-model-edit-confirm.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/app-spinner-row.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {UserModel} from './_models/user.model';

import {UsersService} from './_services/users.service';

@Component({
  template: `
    <div [hidden]="isEditing && !entityLoaded">
      <h1 *ngIf="isEditing && entity">{{ 'EDIT_2' | tr }} "{{ entity.firstname }} {{ entity.surname }}"</h1>
      <h1 *ngIf="!isEditing">{{ 'ADD_2' | tr }}</h1>

      <btn-toolbar>
        <div>
          <button class="btn btn-sm btn-dark text-white" (click)="onGoBack()">{{ 'GO_BACK' | tr }}</button>
        </div>

        <app-btn-model-edit-confirm [form]="f" [editing]="isEditing"></app-btn-model-edit-confirm>

        <ng-container *ngIf="isEditing && entity">
          <div>
            <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
              <i-bs name="trash"></i-bs>
              {{ 'DELETE' | tr }}
            </button>
          </div>
        </ng-container>
      </btn-toolbar>

      <form id="ngForm" #f="ngForm" (ngSubmit)="onSave(f)">
        <ul
          ngbNav
          #nav="ngbNav"
          [(activeId)]="activeTab"
          [destroyOnHide]="false"
          class="nav-tabs bg-dark"
          (navChange)="setTabId($event.nextId)">
          <li [ngbNavItem]="1">
            <a ngbNavLink>{{ 'DATA' | tr }}</a>
            <ng-template ngbNavContent>
              <div class="row gy-2">
                <div class="form-group col-sm">
                  <label for="email">{{ 'EMAIL' | tr }}</label>
                  <input
                    ngModel
                    class="form-control bg-dark text-white"
                    required
                    type="email"
                    id="email"
                    email
                    name="emailAddress"
                    #emailModel="ngModel"
                    minlength="6"
                    maxlength="255"
                    placeholder="{{ 'EMAIL' | tr }}"
                    [ngModel]="isEditing ? entity?.emailAddress : null" />

                  <small *ngIf="emailModel.invalid" class="text-danger">
                    {{ 'HOME_USERS_EMAIL_INCORRECT' | tr }}
                  </small>
                </div>

                <div class="form-group col-sm">
                  <label for="firstname">{{ 'FIRSTNAME' | tr }}</label>
                  <input
                    ngModel
                    class="form-control bg-dark text-white"
                    required
                    type="text"
                    id="firstname"
                    name="firstname"
                    #firstnameModel="ngModel"
                    minlength="3"
                    maxlength="35"
                    placeholder="{{ 'FIRSTNAME' | tr }}"
                    [ngModel]="isEditing ? entity?.firstname : null" />

                  <small *ngIf="firstnameModel.invalid" class="text-danger">
                    {{ 'HOME_USERS_NAME_INCORRECT' | tr }}
                  </small>
                </div>

                <div class="form-group col-sm">
                  <label for="surname">{{ 'SURNAME' | tr }}</label>
                  <input
                    ngModel
                    class="form-control bg-dark text-white"
                    required
                    type="text"
                    id="surname"
                    name="surname"
                    #surnameModel="ngModel"
                    minlength="4"
                    maxlength="35"
                    placeholder="{{ 'SURNAME' | tr }}"
                    [ngModel]="isEditing ? entity?.surname : null" />
                  <small *ngIf="surnameModel.invalid" class="text-danger">
                    {{ 'HOME_USERS_SUR_NAME_INCORRECT' | tr }}
                  </small>
                </div>
              </div>

              <div class="row gy-2 mt-1">
                <div class="form-group col-sm">
                  <label for="birthday">{{ 'HOME_USERS_BIRTHDAY' | tr }}</label>
                  <div class="input-group">
                    <input
                      type="text"
                      ngbDatepicker
                      ngModel
                      class="form-control bg-dark text-white"
                      id="birthday"
                      required
                      #birthdayModel="ngModel"
                      #birthdayPicker="ngbDatepicker"
                      name="birthday"
                      placeholder="09.12.2021"
                      [ngModel]="isEditing ? entity?.birthday : null" />
                    <button class="btn btn-outline-light" (click)="birthdayPicker.toggle()" type="button">
                      <i-bs name="calendar-date"></i-bs>
                    </button>
                  </div>

                  <small *ngIf="birthdayModel.invalid" class="text-danger">
                    {{ 'HOME_USERS_BIRTHDAY_INCORRECT' | tr }}
                  </small>
                </div>

                <div class="form-group col-sm">
                  <label for="password">{{ 'PASSWORD' | tr }}</label>
                  <input
                    ngModel
                    class="form-control bg-dark text-white"
                    type="password"
                    id="password"
                    #passwordModel="ngModel"
                    [disabled]="!updatePassword && isEditing"
                    minlength="6"
                    [required]="!isEditing || updatePassword"
                    name="password"
                    placeholder="*******" />
                  <small *ngIf="passwordModel.invalid" class="text-danger">
                    {{ 'HOME_USERS_PASSWORD_INCORRECT' | tr }}
                  </small>

                  <div class="form-check form-switch mt-2" *ngIf="isEditing">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="updatePassword"
                      [(ngModel)]="updatePassword"
                      [ngModelOptions]="{standalone: true}" />
                    <label class="form-check-label" for="updatePassword">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD' | tr }}</label>
                  </div>
                </div>
              </div>

              <div class="d-flex flex-column flex-md-row gap-2 gap-md-4 mt-2">
                <div class="form-check">
                  <input
                    ngModel
                    class="form-check-input"
                    type="checkbox"
                    id="isAdmin"
                    [ngModel]="isEditing ? entity?.isAdmin : false"
                    name="isAdmin" />
                  <label class="form-check-label" for="isAdmin">
                    {{ 'HOME_USERS_ADMIN' | tr }}
                  </label>
                </div>

                <div class="form-check">
                  <input
                    ngModel
                    class="form-check-input"
                    type="checkbox"
                    id="activated"
                    [ngModel]="isEditing ? entity?.activated : false"
                    name="activated" />
                  <label class="form-check-label" for="activated">
                    {{ 'HOME_USERS_ACTIVATED' | tr }}
                  </label>
                </div>

                <div class="form-check" *ngIf="isEditing">
                  <input
                    ngModel
                    class="form-check-input"
                    type="checkbox"
                    id="forcePasswordChange"
                    [ngModel]="isEditing ? entity?.forcePasswordChange : false"
                    name="forcePasswordChange" />
                  <label class="form-check-label" for="forcePasswordChange">
                    {{ 'HOME_USERS_FORCE_PASSWORD_CHANGE' | tr }}
                  </label>
                </div>
              </div>
            </ng-template>
          </li>
          <li [ngbNavItem]="2">
            <a ngbNavLink>{{ 'NAV_ORGANISATIONS' | tr }}</a>
            <ng-template ngbNavContent> Coming soon...</ng-template>
          </li>
        </ul>

        <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
      </form>
    </div>

    <app-spinner-row [loading]="isEditing && !entityLoaded"></app-spinner-row>
  `,
  selector: 'app-user-edit',
  imports: [
    FormsModule,
    NgIf,
    NgbNavModule,
    NgbDatepickerModule,
    DfxTr,
    AppSpinnerRowComponent,
    AppBtnToolbarComponent,
    AppIconsModule,
    AppBtnModelEditConfirmComponent,
  ],
  standalone: true,
})
export class UserEditComponent extends AbstractModelEditComponent<UserModel> {
  override redirectUrl = '/home/users/all';

  updatePassword = false;

  constructor(usersService: UsersService) {
    super(usersService);
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    if (model.isAdmin) {
      model.role = 'ADMIN';
      this.lumber.info('addCustomAttribute', 'Model is admin detected');
    } else {
      model.role = 'USER';
      this.lumber.info('addCustomAttribute', 'Model is user detected');
    }
    model.birthday = d_from(model.birthday as string);

    if (!this.updatePassword && this.isEditing) {
      model.password = null;
    }

    return super.addCustomAttributesBeforeCreateAndUpdate(model);
  }
}
