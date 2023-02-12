import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {AComponent} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AppIconsModule} from '../icons.module';

@Component({
  template: `
    <button class="btn btn-sm btn-success" form="ngForm" (click)="this.submit.emit()" [disabled]="_formValid === 'INVALID'">
      <span *ngIf="_editing">
        <i-bs name="save"></i-bs>
        {{ 'SAVE' | tr }}
      </span>
      <span *ngIf="!_editing">
        <i-bs name="plus-circle"></i-bs>
        {{ 'ADD' | tr }}
      </span>
      <ng-content></ng-content>
    </button>
  `,
  selector: 'app-model-edit-save-btn',
  standalone: true,
  imports: [NgIf, DfxTr, AppIconsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppModelEditSaveBtn extends AComponent {
  @Input() set editing(it: BooleanInput) {
    this._editing = coerceBooleanProperty(it);
  }
  _editing = false;

  cdr = inject(ChangeDetectorRef);

  @Input()
  set formValid(it: 'VALID' | 'INVALID') {
    this._formValid = it;
    this.cdr.detectChanges();
  }
  _formValid: 'VALID' | 'INVALID' = 'INVALID';

  @Output()
  submit = new EventEmitter<void>();
}
