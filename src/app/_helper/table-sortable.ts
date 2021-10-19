import {Directive, EventEmitter, HostListener, Input, NgModule, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = {asc: 'desc', desc: '', '': 'asc'};
export const compare = (v1: any, v2: any): number => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'th[sortable]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.sortable-header]': 'true',
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
  },
})
export class SortableHeaderDirective {
  @Input() sortable = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  @HostListener('click')
  rotate(): void {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@NgModule({
  declarations: [SortableHeaderDirective],
  imports: [CommonModule],
  exports: [SortableHeaderDirective],
})
export class SortableHeaderModule {}
