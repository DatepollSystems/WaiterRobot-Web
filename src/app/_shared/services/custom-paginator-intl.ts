import {Injectable} from '@angular/core';

import {NgbPaginatorIntl} from 'dfx-bootstrap-table';

@Injectable({
  providedIn: 'root',
})
export class CustomPaginatorIntl extends NgbPaginatorIntl {
  itemsPerPageLabel = 'Einträge pro Seite:';
  nextPageLabel = 'Nächste Seite';
  previousPageLabel = 'Vorherige Seite';
  firstPageLabel = 'Erste Seite';
  lastPageLabel = 'Letzte Seite';

  getRangeLabel: (page: number, pageSize: number, length: number) => string = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 of ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} von ${length}`;
  };
}
