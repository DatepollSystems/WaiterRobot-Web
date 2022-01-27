import {Component, Input} from '@angular/core';
import {AEntityWithName} from 'dfx-helper';

import {AbstractSelectableModelService} from '../../_services/models/abstract-model.service';

@Component({
  selector: 'selectable-button',
  template: `
    <button
      *ngIf="selectedEntity?.id != entity?.id"
      type="button"
      class="btn btn-sm btn-outline-primary text-white"
      (click)="onSelect(entity)"
      attr.aria-label="{{ 'SELECT' | tr }}"
      ngbTooltip="{{ 'SELECT' | tr }}">
      <i-bs name="check2-square"></i-bs>
    </button>
    <button
      *ngIf="selectedEntity?.id == entity?.id"
      type="button"
      class="btn btn-sm btn-primary text-white"
      (click)="onSelect(undefined)"
      attr.aria-label="{{ 'CLEAR_SELECTION' | tr }}"
      ngbTooltip="{{ 'CLEAR_SELECTION' | tr }}">
      <i-bs name="x-circle-fill"></i-bs>
    </button>
  `,
})
export class SelectableButtonComponent {
  @Input()
  selectedEntity: AEntityWithName<string | number> | undefined;

  @Input()
  selectedEntityService: AbstractSelectableModelService<any> | undefined = undefined;

  @Input()
  entity: AEntityWithName<string | number> | undefined;

  constructor() {}

  onSelect(entity: any | undefined): void {
    this.selectedEntityService?.setSelected(entity);
  }
}
