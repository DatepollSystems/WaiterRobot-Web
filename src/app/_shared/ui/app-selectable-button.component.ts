import {AsyncPipe, NgIf} from '@angular/common';
import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {IHasID, UndefinedOr} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';
import {AppIconsModule} from './icons.module';
import {HasGetSelected} from '../services/abstract-entity.service';
import {Observable} from 'rxjs';

@Component({
  template: `
    <ng-container *ngIf="selectedEntity$ | async as _selectedEntity">
      <button
        *ngIf="_selectedEntity?.id !== entity?.id; else deselect"
        type="button"
        class="btn btn-sm btn-outline-primary text-white"
        (click)="onSelect(entity); $event.stopPropagation()"
        attr.aria-label="{{ 'SELECT' | tr }}"
        ngbTooltip="{{ 'SELECT' | tr }}"
        placement="start"
        container="body"
      >
        <i-bs name="check2-square" />
      </button>
      <ng-template #deselect>
        <button
          type="button"
          class="btn btn-sm btn-primary"
          (click)="onSelect(undefined); $event.stopPropagation()"
          attr.aria-label="{{ 'CLEAR_SELECTION' | tr }}"
          ngbTooltip="{{ 'CLEAR_SELECTION' | tr }}"
          placement="start"
          container="body"
        >
          <i-bs name="x-circle-fill" />
        </button>
      </ng-template>
    </ng-container>
  `,
  selector: 'selectable-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, DfxTr, AppIconsModule, NgbTooltipModule, AsyncPipe],
})
export class AppSelectableButtonComponent implements AfterViewInit {
  @Input() entity?: IHasID<string | number>;

  @Input() selectedEntityService!: HasGetSelected<IHasID<string | number>>;

  @Output() selectEntity = new EventEmitter<any>();

  onSelect(entity?: IHasID<string | number>): void {
    this.selectedEntityService.setSelected(entity);
    this.selectEntity.next(entity);
  }

  ngAfterViewInit(): void {
    this.selectedEntity$ = this.selectedEntityService.getSelected$;
  }

  selectedEntity$?: Observable<UndefinedOr<IHasID<string | number>>>;
}
