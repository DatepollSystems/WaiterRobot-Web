import {booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  template: `
    <button class="btn btn-sm btn-success" form="ngForm" (click)="this.submit.emit()" [disabled]="_valid === 'INVALID'">
      @if (editing) {
        <span>
          <bi name="save" />
          {{ 'SAVE' | tr }}
        </span>
      } @else {
        <span>
          <bi name="plus-circle" />
          {{ 'ADD' | tr }}
        </span>
      }
      <ng-content />
    </button>
  `,
  selector: 'app-model-edit-save-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppModelEditSaveBtn {
  @Input({transform: booleanAttribute}) editing = false;

  @Input()
  set valid(it: 'VALID' | 'INVALID' | null) {
    this._valid = it ?? 'INVALID';
  }
  _valid: 'VALID' | 'INVALID' = 'INVALID';

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  submit = new EventEmitter<void>();
}
