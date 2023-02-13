import {AfterViewInit, Component, Inject, inject, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IHasID, loggerOf} from 'dfts-helper';
import {NgbPaginator, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {combineLatest, filter, Observable, of, startWith, switchMap, tap} from 'rxjs';
import {HasGetAll, notNullAndUndefined} from '../services/abstract-entity.service';

@Component({
  template: '',
})
export abstract class AbstractModelsListV2Component<EntityType extends IHasID<EntityType['id']>> implements AfterViewInit {
  protected lumber = loggerOf('AModelsListComponentV2');

  // Table stuff
  @ViewChild(NgbSort, {static: true}) sort?: NgbSort;
  @ViewChild(NgbPaginator, {static: true}) paginator?: NgbPaginator;
  protected abstract columnsToDisplay: string[];
  protected sortingDataAccessors?: Map<string, (it: EntityType) => any>;
  public filter = new FormControl('');

  protected modal = inject(NgbModal);

  dataSource$: Observable<NgbTableDataSource<EntityType>> = of(new NgbTableDataSource<EntityType>());

  protected entities?: NgbTableDataSource<EntityType>;

  protected constructor(@Inject(null) protected entitiesService: HasGetAll<EntityType>) {}

  ngAfterViewInit(): void {
    this.dataSource$ = this.getDataSource(this.entitiesService.getAll$());
  }

  protected getDataSource(entitiesStream: Observable<EntityType[]>): Observable<NgbTableDataSource<EntityType>> {
    return combineLatest([this.filter.valueChanges.pipe(startWith(''), filter(notNullAndUndefined)), entitiesStream]).pipe(
      switchMap(([filterTerm, all]) => {
        const dataSource = new NgbTableDataSource<EntityType>(all.slice());

        if (this.sortingDataAccessors) {
          dataSource.sortingDataAccessor = (item, property) => {
            const fun = this.sortingDataAccessors?.get(property);
            if (!fun) {
              return item[property as keyof EntityType];
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

        return of(dataSource);
      }),
      tap((dataSource) => (this.entities = dataSource))
    );
  }
}
