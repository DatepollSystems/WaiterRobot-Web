import {NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-question-title">{{ 'ABOUT_SIGNIN_FAILED_PASSWORD_CHANGE_INFO' | tr }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.close(undefined)"></button>
    </div>
    <div class="modal-body">
      <div class="mb-3">
        <form #f="ngForm">
          <div class="form-group">
            <label for="newPassword">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW' | tr }}</label>
            <input
              ngModel
              class="form-control bg-dark text-white mb-1"
              type="password"
              id="newPassword"
              (ngModelChange)="newPasswordsChange($event, undefined)"
              #newPasswordModel="ngModel"
              [minlength]="6"
              required
              name="newPassword"
              placeholder="{{ 'PASSWORD' | tr }}"
            />
            <small *ngIf="newPasswordModel.invalid" class="text-danger">
              {{ 'HOME_USERS_PASSWORD_INCORRECT' | tr }}
            </small>
          </div>

          <div class="form-group">
            <label for="newPasswordAgain">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW_AGAIN' | tr }}</label>
            <input
              ngModel
              class="form-control bg-dark text-white mb-1"
              type="password"
              id="newPasswordAgain"
              (ngModelChange)="newPasswordsChange(undefined, $event)"
              #newPasswordAgainModel="ngModel"
              [minlength]="6"
              required
              name="newPasswordAgain"
              placeholder="{{ 'PASSWORD' | tr }}"
            />

            <div *ngIf="newPasswordAgainModel.invalid">
              <small class="text-danger">
                {{ 'HOME_USERS_PASSWORD_INCORRECT' | tr }}
              </small>
            </div>
            <div *ngIf="!newPasswordsMatch">
              <small class="text-danger">
                {{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD_NEW_DONT_MATCH' | tr }}
              </small>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close(undefined)">{{ 'CLOSE' | tr }}</button>
      <button
        type="button"
        class="btn btn-outline-success"
        [disabled]="f.invalid || !f || !newPasswordsMatch"
        (click)="activeModal.close(newPassword)"
      >
        {{ 'ABOUT_SIGNIN' | tr }}
      </button>
    </div>
  `,
  selector: 'app-account-not-activated-modal',
  standalone: true,
  imports: [DfxTr, NgIf, FormsModule],
})
export class AppPasswordChangeDialogComponent {
  newPasswordsMatch = false;
  newPassword = '';
  newPasswordAgain = '';

  constructor(public activeModal: NgbActiveModal) {}

  newPasswordsChange(password: string | undefined, passwordAgain: string | undefined): void {
    if (password) {
      this.newPassword = password;
    }
    if (passwordAgain) {
      this.newPasswordAgain = passwordAgain;
    }
    if (this.newPassword.trim().length > 0 && this.newPasswordAgain.trim().length > 0) {
      this.newPasswordsMatch = this.newPassword === this.newPasswordAgain;
    }
  }
}
