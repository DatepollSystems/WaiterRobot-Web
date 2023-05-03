import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {IHasID, UndefinedOr} from 'dfts-helper';
import {HasGetSelected, NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {EMPTY, Observable} from 'rxjs';
import {AppIconsModule} from './icons.module';

@Component({
  template: `
    <ng-container *ngSub="selectedEntity$ as _selectedEntity">
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
  imports: [NgIf, DfxTr, AppIconsModule, NgbTooltipModule, NgSub],
})
export class AppSelectableButtonComponent {
  @Input() entity?: IHasID<string | number>;

  @Input() set selectedEntityService(it: HasGetSelected<IHasID<string | number>>) {
    this._selectedEntityService = it;
    this.selectedEntity$ = this._selectedEntityService.getSelected$;
  }

  _selectedEntityService!: HasGetSelected<IHasID<string | number>>;

  onSelect(entity?: IHasID<string | number>): void {
    this._selectedEntityService.setSelected(entity);
  }

  selectedEntity$: Observable<UndefinedOr<IHasID<string | number>>> = EMPTY;
}
