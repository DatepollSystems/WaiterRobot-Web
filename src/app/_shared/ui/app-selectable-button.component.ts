import {NgIf} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {AEntityWithName} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';

import {AbstractSelectableModelService} from '../services/abstract-model.service';
import {AppIconsModule} from './icons.module';

@Component({
  template: `
    <button
      *ngIf="selectedEntity?.id !== entity?.id; else deselect"
      type="button"
      class="btn btn-sm btn-outline-primary text-white"
      (click)="onSelect(entity); $event.stopPropagation()"
      attr.aria-label="{{ 'SELECT' | tr }}"
      ngbTooltip="{{ 'SELECT' | tr }}"
      placement="start"
      container="body">
      <i-bs name="check2-square"></i-bs>
    </button>
    <ng-template #deselect>
      <button
        type="button"
        class="btn btn-sm btn-primary"
        (click)="onSelect(undefined); $event.stopPropagation()"
        attr.aria-label="{{ 'CLEAR_SELECTION' | tr }}"
        ngbTooltip="{{ 'CLEAR_SELECTION' | tr }}"
        placement="start"
        container="body">
        <i-bs name="x-circle-fill"></i-bs>
      </button>
    </ng-template>
  `,
  selector: 'selectable-button',
  standalone: true,
  imports: [NgIf, DfxTr, AppIconsModule, NgbTooltipModule],
})
export class AppSelectableButtonComponent {
  @Input() selectedEntity?: AEntityWithName<string | number>;

  @Input() entity?: AEntityWithName<string | number>;

  @Input() selectedEntityService!: AbstractSelectableModelService<any>;

  @Output() selectEntity = new EventEmitter<any>();

  onSelect(entity?: any): void {
    this.selectedEntityService.setSelected(entity);
    this.selectEntity.next(entity);
  }
}
