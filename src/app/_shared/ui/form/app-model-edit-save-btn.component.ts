import {booleanAttribute, ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-success btn-lg d-inline-flex gap-2" type="submit" [disabled]="!valid">
        @if (creating) {
          <bi name="plus-circle" />
          <span>
            {{ 'ADD' | tr }}
          </span>
        } @else {
          <bi name="save" />
          <span>
            {{ 'SAVE' | tr }}
          </span>
        }
        <ng-content />
      </button>
    </div>
  `,
  selector: 'app-model-edit-save-btn',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BiComponent, DfxTr],
})
export class AppModelEditSaveBtn {
  @Input({transform: booleanAttribute, required: true}) creating!: boolean;

  @Input()
  valid = false;
}
