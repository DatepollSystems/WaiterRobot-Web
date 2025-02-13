import {Component, input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';

import type {TableFilter} from '@home-shared/list/inject-table-filter';

@Component({
  template: `
    @let _filter = filter();
    <div class="input-group action-search">
      <input class="form-control form-control-sm" [formControl]="_filter.control" [placeholder]="'SEARCH' | transloco" type="text" />
      @if (_filter.isActive()) {
        <button
          class="btn btn-sm btn-outline-secondary"
          [ngbTooltip]="'CLEAR' | transloco"
          (click)="_filter.reset()"
          type="button"
          placement="bottom"
        >
          <bi name="x-circle-fill" />
        </button>
      }
    </div>
  `,
  styles: `
    .action-search {
      min-width: 200px;
      max-width: 250px;
    }
  `,
  selector: 'app-list-filter',
  imports: [BiComponent, ReactiveFormsModule, TranslocoPipe, NgbTooltip],
})
export class ListFilterComponent {
  filter = input.required<TableFilter>();
}
