import {booleanAttribute, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-success btn-lg d-inline-flex gap-2" type="submit" [disabled]="!valid">
        @if (creating) {
          <bi name="plus-circle" />
          <span>
            {{ 'ADD' | transloco }}
          </span>
        } @else {
          <bi name="save" />
          <span>
            {{ 'SAVE' | transloco }}
          </span>
        }
        <ng-content />
      </button>
    </div>
  `,
  selector: 'app-model-edit-save-btn',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BiComponent, TranslocoPipe],
})
export class AppModelEditSaveBtn {
  @Input({transform: booleanAttribute, required: true}) creating!: boolean;

  @Input()
  valid = false;
}
