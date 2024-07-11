import {booleanAttribute, ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';

import {BiComponent, provideBi, withSize} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-success btn-lg d-inline-flex align-items-center gap-2" type="submit" [disabled]="!valid()">
        @if (creating()) {
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
  providers: [provideBi(withSize('20'))],
})
export class AppModelEditSaveBtn {
  creating = input.required<boolean, boolean | string>({transform: booleanAttribute});

  valid = input(false);
}
