import {NgIf} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {AEntityWithName} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AbstractSelectableModelService} from '../services/abstract-model.service';
import {AppIconsModule} from './icons.module';

@Component({
  template: `
    <button
      *ngIf="selectedEntity?.id !== entity?.id"
      type="button"
      class="btn btn-sm btn-outline-primary text-white"
      (click)="onSelect(entity); $event.stopPropagation()"
      attr.aria-label="{{ 'SELECT' | tr }}"
      ngbTooltip="{{ 'SELECT' | tr }}"
      placement="start"
      container="body">
      <i-bs name="check2-square"></i-bs>
    </button>
    <button
      *ngIf="selectedEntity?.id === entity?.id"
      type="button"
      class="btn btn-sm btn-primary"
      (click)="onSelect(undefined); $event.stopPropagation()"
      attr.aria-label="{{ 'CLEAR_SELECTION' | tr }}"
      ngbTooltip="{{ 'CLEAR_SELECTION' | tr }}"
      placement="start"
      container="body">
      <i-bs name="x-circle-fill"></i-bs>
    </button>
  `,
  selector: 'selectable-button',
  standalone: true,
  imports: [NgIf, DfxTr, AppIconsModule, NgbTooltipModule],
})
export class AppSelectableButtonComponent {
  @Input() selectedEntity?: AEntityWithName<string | number> | undefined;

  @Input() selectedEntityService!: AbstractSelectableModelService<any>;

  @Input() entity?: AEntityWithName<string | number> | undefined;

  @Output() selectEntity = new EventEmitter<any>();

  onSelect(entity: any | undefined): void {
    this.selectedEntityService.setSelected(entity);
    this.selectEntity.next(entity);
  }
}
