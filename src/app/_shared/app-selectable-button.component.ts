import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {AEntityWithName} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {AbstractSelectableModelService} from '../_services/models/abstract-model.service';
import {IconsModule} from './icons.module';

@Component({
  selector: 'selectable-button',
  template: `
    <button
      *ngIf="selectedEntity?.id !== entity?.id"
      type="button"
      class="btn btn-sm btn-outline-primary text-white"
      (click)="onSelect(entity)"
      attr.aria-label="{{ 'SELECT' | tr }}"
      ngbTooltip="{{ 'SELECT' | tr }}"
      placement="end">
      <i-bs name="check2-square"></i-bs>
    </button>
    <button
      *ngIf="selectedEntity?.id === entity?.id"
      type="button"
      class="btn btn-sm btn-primary text-white"
      (click)="onSelect(undefined)"
      attr.aria-label="{{ 'CLEAR_SELECTION' | tr }}"
      ngbTooltip="{{ 'CLEAR_SELECTION' | tr }}"
      placement="end">
      <i-bs name="x-circle-fill"></i-bs>
    </button>
  `,
  standalone: true,
  imports: [CommonModule, DfxTranslateModule, IconsModule, NgbTooltipModule],
})
export class AppSelectableButtonComponent {
  @Input() selectedEntity?: AEntityWithName<string | number> | undefined;

  @Input() selectedEntityService!: AbstractSelectableModelService<any>;

  @Input() entity?: AEntityWithName<string | number> | undefined;

  @Input() onClickFunc?: (entity: any | undefined) => void;

  onSelect(entity: any | undefined): void {
    this.selectedEntityService.setSelected(entity);
    if (this.onClickFunc) {
      this.onClickFunc(entity);
    }
  }
}
