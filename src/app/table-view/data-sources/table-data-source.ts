import { Observable, BehaviorSubject } from 'rxjs';
import { TableColumn } from '../table-column';
import { DataSource } from './data-source';

export interface TablePageMetadata {
  readonly start: number; // inclusive
  readonly end: number; // exclusive
  readonly currentPage: number;
  readonly size: number;
  readonly search?: string;
}

/**
 * T = Data type
 * U = Column Keys
 */
export abstract class TableDataSource<
  T,
  U extends string = string
> extends DataSource<T, TablePageMetadata> {
  readonly defaultPageSizeOptions: readonly number[] = [5, 10, 20];

  abstract columns: readonly TableColumn<T>[];

  private readonly pageSizeOptions = new BehaviorSubject<readonly number[]>(
    this.defaultPageSizeOptions
  );
  private readonly displayedColumns = new BehaviorSubject<readonly U[]>([]);

  setPageSizeOptions(columns: readonly number[]): void {
    this.pageSizeOptions.next(columns);
  }

  getPageSizeOptions(): Observable<readonly number[]> {
    return this.pageSizeOptions.asObservable();
  }

  setDisplayedColumns(columns: readonly U[]): void {
    this.displayedColumns.next(columns);
  }

  getDisplayedColumns(): Observable<readonly U[]> {
    return this.displayedColumns.asObservable();
  }
}
