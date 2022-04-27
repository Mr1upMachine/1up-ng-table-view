import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
} from '@angular/cdk/coercion';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  Output,
  Inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { auditTime, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { CollectionViewer } from './data-sources/collection-viewer';
import {
  TableDataSource,
  TablePageMetadata,
} from './data-sources/table-data-source';
import { TABLE_COLUMN_TYPES } from './table-column-types-token';

// TODO determine what belongs here vs in the TableDataSource

@Component({
  selector: 'table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableViewComponent<T>
  implements CollectionViewer<TablePageMetadata>, OnDestroy
{
  readonly defaultCurrentPage = 0;
  readonly defaultPageSize = 5;

  protected _dataSource?: TableDataSource<T>;
  _data?: Observable<readonly T[]>;

  private readonly destroyEvent = new Subject<void>();

  readonly currentPageControl = new FormControl(this.defaultCurrentPage);
  readonly pageSizeControl = new FormControl(this.defaultPageSize);
  readonly searchControl = new FormControl('');
  readonly displayColumnInputControl = new FormControl('');

  // Getters can be removed once strongly typed forms are added
  private get searchValue(): string {
    return this.searchControl.value;
  }

  // TODO add filter
  private tableViewFormSubmit = new Subject<void>();

  @Input()
  set currentPage(value: NumberInput) {
    this.currentPageControl.setValue(coerceNumberProperty(value));
  }
  get currentPage(): number {
    return this.currentPageControl.value;
  }
  @Output() currentPageChange: Observable<number> =
    this.tableViewFormSubmit.pipe(map(() => this.currentPage));

  @Input()
  set pageSize(value: NumberInput) {
    this.pageSizeControl.setValue(coerceNumberProperty(value));
  }
  get pageSize(): number {
    return this.pageSizeControl.value;
  }
  @Output() pageSizeChange: Observable<number> =
    this.pageSizeControl.valueChanges.pipe(
      map((size) => coerceNumberProperty(size)),
      tap(() => {
        this.currentPage = 0;
      })
    );

  @Input()
  set search(value: string) {
    this.searchControl.setValue(value);
  }
  get search(): string {
    return this.searchControl.value;
  }
  @Output() searchChange: Observable<string> = this.tableViewFormSubmit.pipe(
    map(() => this.search)
  );

  @Input()
  set canSearch(value: BooleanInput) {
    this._canSearch = coerceBooleanProperty(value);
  }
  get canSearch(): boolean {
    return this._canSearch;
  }
  protected _canSearch: boolean = true;

  @Input()
  set canFilter(value: BooleanInput) {
    this._canFilter = coerceBooleanProperty(value);
  }
  get canFilter(): boolean {
    return this._canFilter;
  }
  protected _canFilter: boolean = true;

  readonly _pageSizeOptions = new BehaviorSubject<readonly number[]>([]);

  // Part of the "CollectionViewer" interface. This Observable lets the data source know that the view needs more data to parse.
  viewChange: Observable<TablePageMetadata> = merge(
    this.tableViewFormSubmit.pipe(
      startWith(null),
      map(() => {
        return {
          currentPage: this.currentPage,
          search: this.searchValue,
        };
      })
    ),
    this.pageSizeChange.pipe(
      map(() => {
        return {
          currentPage: 0,
          search: '',
        };
      })
    )
  ).pipe(
    map((meta) => {
      const size = this.pageSize;
      const start = meta.currentPage * size;
      const end = start + size;

      return {
        ...meta,
        size,
        start,
        end,
        // TODO add filter
      };
    }),
    auditTime(5)
  );

  @Input()
  set dataSource(value: TableDataSource<T>) {
    if (this._dataSource) {
      this._dataSource.disconnect(this);
      this.destroyEvent.next();
    }

    this._dataSource = value;
    this._data = value.connect(this);

    value
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroyEvent))
      .subscribe((value) => {
        this._pageSizeOptions.next(value);
      });

    value
      .getDisplayedColumns()
      .pipe(
        takeUntil(this.destroyEvent),
        map((displayedColumns) => displayedColumns.join(', '))
      )
      .subscribe((columnList) => {
        this.displayColumnInputControl.setValue(columnList);
      });
  }
  get dataSource(): TableDataSource<T> {
    if (!this._dataSource) {
      throw new Error('A TableDataSource must be defined');
    }

    return this._dataSource;
  }

  constructor(
    @Inject(TABLE_COLUMN_TYPES)
    public readonly columnTypes: unknown[]
  ) {}

  ngOnDestroy() {
    if (!this._dataSource) {
      return;
    }

    this._dataSource.disconnect(this);
    this.destroyEvent.next();
    this.destroyEvent.complete();
    this.tableViewFormSubmit.complete();
  }

  updateDisplayedColumns(displayedColumns: string) {
    const formattedColumns = displayedColumns
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value);
    this.dataSource.setDisplayedColumns(formattedColumns);
  }

  firstPage() {
    this.currentPage = 0;
    this.submit();
  }

  prevPage() {
    if (this.currentPage <= 0) {
      return;
    }

    this.currentPage = this.currentPage - 1;
    this.submit();
  }

  nextPage() {
    this.currentPage = this.currentPage + 1;
    this.submit();
  }

  lastPage() {
    // TODO
    this.submit();
  }

  setPageSize(size: string | number) {
    this.firstPage();
    this.pageSize = coerceNumberProperty(size);
    this.submit();
  }

  submit() {
    this.tableViewFormSubmit.next();
  }
}
