import {Component, input} from '@angular/core';
import {BiComponent} from 'dfx-bootstrap-icons';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslocoPipe} from '@jsverse/transloco';
import {injectTableFilter} from '@home-shared/list/inject-table-filter';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <div class="input-group action-search">
      <input class="form-control form-control-sm" type="text" [formControl]="filter().control" [placeholder]="'SEARCH' | transloco" />
      @if (filter().isActive()) {
        <button
          class="btn btn-sm btn-outline-secondary"
          type="button"
          placement="bottom"
          [ngbTooltip]="'CLEAR' | transloco"
          (click)="filter().reset()"
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
  standalone: true,
})
export class ListFilterComponent {
  filter = input.required<ReturnType<typeof injectTableFilter>>();
}
