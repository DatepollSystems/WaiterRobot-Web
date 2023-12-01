import {HttpErrorResponse} from '@angular/common/http';
import {AfterViewInit, Component, Inject, inject, signal, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';

import {catchError, combineLatest, debounceTime, map, Observable, of, startWith, switchMap, tap, throwError} from 'rxjs';

import {loggerOf} from 'dfts-helper';
import {NgbPaginator, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {HasGetAll} from 'dfx-helper';

@Component({
  template: '',
})
export abstract class AbstractModelsListComponent<EntityType> implements AfterViewInit {
  protected lumber = loggerOf('AModelsListComponentV2');

  protected router = inject(Router);

  // Table stuff
  @ViewChild(NgbSort) sort?: NgbSort;
  @ViewChild(NgbPaginator) paginator?: NgbPaginator;

  isLoading = signal(true);

  get columnsToDisplay(): string[] {
    return this._columnsToDisplay;
  }

  set columnsToDisplay(it: string[]) {
    this._columnsToDisplay = it;
  }

  _columnsToDisplay: string[] = [];

  protected sortingDataAccessors?: Map<string, (it: EntityType) => string | number>;
  public filter = new FormControl('');

  dataSource$: Observable<NgbTableDataSource<EntityType>> = of(new NgbTableDataSource<EntityType>());

  protected _dataSource: NgbTableDataSource<EntityType> = new NgbTableDataSource<EntityType>([]);

  protected constructor(@Inject(null) protected entitiesService: HasGetAll<EntityType>) {}

  ngAfterViewInit(): void {
    this.dataSource$ = this.getDataSource(this.entitiesService.getAll$());
  }

  protected getDataSource(entitiesStream: Observable<EntityType[]>): Observable<NgbTableDataSource<EntityType>> {
    return combineLatest([
      this.filter.valueChanges.pipe(
        startWith(''),
        map((it) => it ?? ''),
        debounceTime(250),
      ),
      entitiesStream.pipe(
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 404) {
            void this.router.navigateByUrl('/not-found');
          }
          return throwError(() => error);
        }),
      ),
    ]).pipe(
      switchMap(([filterTerm, all]) => {
        const dataSource = new NgbTableDataSource<EntityType>(all);

        if (this.sortingDataAccessors) {
          dataSource.sortingDataAccessor = (item, property) => {
            const fun = this.sortingDataAccessors?.get(property);
            if (!fun) {
              return item[property as keyof EntityType] as string | number;
            }
            return fun(item);
          };
        }
        if (this.sort) {
          dataSource.sort = this.sort;
        }
        if (this.paginator) {
          dataSource.paginator = this.paginator;
        }
        dataSource.filter = filterTerm ?? '';

        this.isLoading.set(false);

        return of(dataSource);
      }),
      tap((dataSource) => (this._dataSource = dataSource)),
      startWith(this._dataSource),
    );
  }
}
