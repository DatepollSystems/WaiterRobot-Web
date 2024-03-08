import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {PlacementArray} from '@ng-bootstrap/ng-bootstrap/util/positioning';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    @if (selectedId !== entityId) {
      <button
        type="button"
        class="btn btn-sm btn-outline-primary text-body-emphasis"
        container="body"
        [attr.aria-label]="'SELECT' | transloco"
        [ngbTooltip]="'SELECT' | transloco"
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
        [attr.aria-label]="'CLEAR_SELECTION' | transloco"
        [ngbTooltip]="'CLEAR_SELECTION' | transloco"
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
  imports: [TranslocoPipe, BiComponent, NgbTooltipModule],
})
export class AppSelectableBtnComponent {
  @Input({required: true}) entityId!: number;

  @Input() selectedId?: number;

  @Output() readonly selectedChange = new EventEmitter<number | undefined>();

  @Input() placement: PlacementArray = 'right';
}
