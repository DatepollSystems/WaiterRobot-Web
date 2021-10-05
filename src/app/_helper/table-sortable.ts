/* tslint:disable:component-selector component-class-suffix directive-selector no-host-metadata-property directive-class-suffix */
import {Directive, EventEmitter, Input, NgModule, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = {asc: 'desc', desc: '', '': 'asc'};
export const compare = (v1: any, v2: any) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.sortable-header]': 'true',
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class SortableHeader {
  @Input() sortable: string = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@NgModule({
  declarations: [SortableHeader],
  imports: [CommonModule],
  exports: [SortableHeader],
})
export class SortableHeaderModule {}
