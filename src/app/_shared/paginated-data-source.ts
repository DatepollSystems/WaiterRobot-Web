import {DataSource} from '@angular/cdk/table';
import {NgbPaginator, NgbSort, Sort} from 'dfx-bootstrap-table';
import {BehaviorSubject, combineLatest, merge, Observable, of, Subject, Subscription, switchMap} from 'rxjs';
import {GetPaginatedFn, PaginationResponse} from './services/services.interface';

/**
 * Interface that matches the required API parts of the MatPaginator.
 * Decoupled so that users can depend on either the legacy or MDC-based paginator.
 */
export interface NgbTableDataSourcePaginator {
  pageChange: Subject<number>;
  page: number;
  pageSize: number;
  collectionSize: number;
  initialized: Observable<void>;
}

/** Shared base class with MDC-based implementation. */
export class _PaginatedDataSource<T, P extends NgbTableDataSourcePaginator = NgbTableDataSourcePaginator> extends DataSource<T> {
  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly _renderData = new BehaviorSubject<T[]>([]);

  /** Stream that emits when a new page is fetched from the server. */
  private readonly _data: BehaviorSubject<PaginationResponse<T> | undefined> = new BehaviorSubject<PaginationResponse<T> | undefined>(
    undefined,
  );

  /**
   * Subscription to the changes that should trigger an update to the table's rendered rows, such
   * as filtering, sorting, pagination, or base data changes.
   */
  _renderChangesSubscription: Subscription | null = null;

  private readonly _fn: GetPaginatedFn<T>;

  constructor(service: GetPaginatedFn<T>) {
    super();
    this._fn = service;
    this._updateChangeSubscription();
  }

  get data(): PaginationResponse<T> | undefined {
    return this._data.value;
  }

  /**
   * Instance of the MatPaginator component used by the table to control what page of the data is
   * displayed. Page changes emitted by the MatPaginator will trigger an update to the
   * table's rendered data.
   *
   * Note that the data source uses the paginator's properties to calculate which page of data
   * should be displayed. If the paginator receives its properties as template inputs,
   * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the paginator's view has been
   * initialized before assigning it to this data source.
   */
  get paginator(): P {
    return this._paginator;
  }

  set paginator(paginator: P) {
    this._paginator = paginator;
    this._updateChangeSubscription();
  }

  private _paginator!: P;

  /**
   * Instance of the MatSort directive used by the table to control its sorting. Sort changes
   * emitted by the MatSort will trigger an update to the table's rendered data.
   */
  get sort(): NgbSort | undefined {
    return this._sort;
  }

  set sort(sort: NgbSort | undefined) {
    this._sort = sort;
    this._updateChangeSubscription();
  }

  private _sort: NgbSort | undefined;

  /**
   * Filter term that should be used to filter out objects from the data array. To override how
   * data objects match to this filter string, provide a custom function for filterPredicate.
   */
  get filter(): string {
    return this._filter.value;
  }

  set filter(filter: string) {
    this._filter.next(filter);
    // Normally the `filteredData` is updated by the re-render
    // subscription, but that won't happen if it's inactive.
    if (!this._renderChangesSubscription) {
      this._updateChangeSubscription();
    }
  }

  /** Stream that emits when a new filter string is set on the data source. */
  private readonly _filter = new BehaviorSubject<string>('');

  /**
   * Subscribe to changes that should trigger an update to the table's rendered rows. When the
   * changes occur, process the current state of the filter, sort, and pagination along with
   * the provided base data and send it to the table for rendering.
   */
  _updateChangeSubscription(): void {
    // Sorting and/or pagination should be watched if MatSort and/or MatPaginator are provided.
    // The events should emit whenever the component emits a change or initializes, or if no
    // component is provided, a stream with just a null event should be provided.
    // The `sortChange` and `pageChange` acts as a signal to the combineLatests below so that the
    // pipeline can progress to the next step. Note that the value from these streams are not used,
    // they purely act as a signal to progress in the pipeline.
    const sortChange: Observable<Sort | null | void> = this._sort ? merge(this._sort.sortChange, this._sort.initialized) : of(null);
    const pageChange: Observable<number | null | void> = this._paginator
      ? merge(this._paginator.pageChange, this._paginator.initialized)
      : of(null);

    const paginatedData = combineLatest([this._filter, sortChange, pageChange]).pipe(
      switchMap(([query]) => {
        let sort = undefined;
        const active = this.sort?.active;
        const direction = this.sort?.direction;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!(!active || !direction || direction === '')) {
          sort = `${active},${direction}`;
        }
        return this._fn({
          page: this.paginator?.page ? this.paginator.page - 1 : undefined,
          size: this.paginator?.pageSize,
          sort,
          query,
        });
      }),
    );
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = paginatedData.subscribe((response) => {
      this._data.next(response);
      this._renderData.next(response.data);
    });
  }

  /**
   * Used by the MatTable. Called when it connects to the data source.
   * @docs-private
   */
  connect(): BehaviorSubject<T[]> {
    if (!this._renderChangesSubscription) {
      this._updateChangeSubscription();
    }

    return this._renderData;
  }

  /**
   * Used by the MatTable. Called when it disconnects from the data source.
   * @docs-private
   */
  disconnect(): void {
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = null;
  }
}

export class PaginatedDataSource<T> extends _PaginatedDataSource<T, NgbPaginator> {}
