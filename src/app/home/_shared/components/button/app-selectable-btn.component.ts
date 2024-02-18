import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {PlacementArray} from '@ng-bootstrap/ng-bootstrap/util/positioning';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    @if (selectedId !== entityId) {
      <button
        type="button"
        class="btn btn-sm btn-outline-primary text-body-emphasis"
        container="body"
        [attr.aria-label]="'SELECT' | tr"
        [ngbTooltip]="'SELECT' | tr"
        [placement]="placement"
        (click)="selectedChange.next(entityId); $event.stopPropagation()"
      >
        <bi name="check2-square" />
      </button>
    } @else {
      <button
        type="button"
        class="btn btn-sm btn-primary"
        container="body"
        [attr.aria-label]="'CLEAR_SELECTION' | tr"
        [ngbTooltip]="'CLEAR_SELECTION' | tr"
        [placement]="placement"
        (click)="selectedChange.next(undefined); $event.stopPropagation()"
      >
        <bi name="x-circle-fill" />
      </button>
    }
  `,
  selector: 'selectable-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DfxTr, BiComponent, NgbTooltipModule],
})
export class AppSelectableBtnComponent {
  @Input({required: true}) entityId!: number;

  @Input() selectedId?: number;

  @Output() readonly selectedChange = new EventEmitter<number | undefined>();

  @Input() placement: PlacementArray = 'right';
}
