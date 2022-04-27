import { Injectable } from '@angular/core';
import { Observable, Subject, switchMap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  TableDataSource,
  TablePageMetadata,
} from '../table-view/data-sources/table-data-source';
import { PeriodicElementsApiService } from '../api/periodic-elements-api.service';
import {
  PeriodicElement,
  PeriodicElementColumnKeys,
} from '../types/periodic-elements';
import { CollectionViewer } from '../table-view/data-sources/collection-viewer';
import { TableColumn } from '../table-view/table-column';

const COLUMN_DATA: readonly TableColumn<
  PeriodicElement,
  PeriodicElementColumnKeys
>[] = [
  {
    type: 'text',
    key: 'position',
    header: `Position`,
    cell: (row) => `${row.position}`,
  },
  {
    type: 'text',
    key: 'name',
    header: `Name`,
    cell: (row) => `${row.name}`,
  },
  {
    type: 'text',
    key: 'weight',
    header: `Weight`,
    cell: (row) => `${row.weight}`,
  },
  {
    type: 'button',
    key: 'symbol',
    header: `Symbol`,
    cell: (row) => `${row.symbol}`,
    click: (row) => {
      console.log('row:', row);
    },
  },
];

@Injectable({ providedIn: 'root' })
export class ExampleHttpTableDataSource extends TableDataSource<
  PeriodicElement,
  PeriodicElementColumnKeys
> {
  readonly columns: readonly TableColumn<PeriodicElement>[] = COLUMN_DATA;

  private readonly destroyEvent = new Subject<void>();

  constructor(private readonly apiService: PeriodicElementsApiService) {
    super();

    this.setPageSizeOptions([3, 5, 10, 15, 20, 50]);
  }

  // TODO add local caching of data for performance
  connect(
    collectionViewer: CollectionViewer<TablePageMetadata>
  ): Observable<readonly PeriodicElement[]> {
    return collectionViewer.viewChange.pipe(
      switchMap(({ search, currentPage, size }) => {
        return this.apiService.getElements({
          size,
          page: currentPage,
          searchText: search,
        });
      }),
      // cache
      takeUntil(this.destroyEvent)
    );
  }

  disconnect() {
    this.destroyEvent.next();
    this.destroyEvent.complete();
  }
}
