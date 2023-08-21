import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {DfxTr} from 'dfx-translate';

import {AppIconsModule} from '../icons.module';

@Component({
  template: `
    <button class="btn btn-sm btn-success" form="ngForm" (click)="this.submit.emit()" [disabled]="_valid === 'INVALID'">
      <span *ngIf="_editing">
        <i-bs name="save" />
        {{ 'SAVE' | tr }}
      </span>
      <span *ngIf="!_editing">
        <i-bs name="plus-circle" />
        {{ 'ADD' | tr }}
      </span>
      <ng-content />
    </button>
  `,
  selector: 'app-model-edit-save-btn',
  standalone: true,
  imports: [NgIf, DfxTr, AppIconsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppModelEditSaveBtn {
  @Input() set editing(it: BooleanInput) {
    this._editing = coerceBooleanProperty(it);
  }
  _editing = false;

  @Input()
  set valid(it: 'VALID' | 'INVALID' | null) {
    this._valid = it ?? 'INVALID';
  }
  _valid: 'VALID' | 'INVALID' = 'INVALID';

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  submit = new EventEmitter<void>();
}
