import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {NgForm} from '@angular/forms';

import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {DfxTranslateModule} from 'dfx-translate';

import {AppIconsModule} from './icons.module';

@Component({
  template: `
    <div>
      <button class="btn btn-sm btn-success" form="ngForm" (click)="form?.ngSubmit?.emit()" [disabled]="!form || !form.valid">
        <span *ngIf="_editing">
          <i-bs name="save"></i-bs>
          {{ 'SAVE' | tr }}
        </span>
        <span *ngIf="!_editing">
          <i-bs name="plus-circle"></i-bs>
          {{ 'ADD' | tr }}
        </span>
      </button>
    </div>
  `,
  selector: 'app-btn-model-edit-confirm',
  standalone: true,
  imports: [NgIf, DfxTranslateModule, AppIconsModule],
})
export class AppBtnModelEditConfirmComponent {
  @Input() set editing(it: BooleanInput) {
    this._editing = coerceBooleanProperty(it);
  }
  _editing = false;

  @Input() form?: NgForm;
}
