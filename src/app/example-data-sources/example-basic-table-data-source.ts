import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableColumn } from '../table-view/table-column';
import { CollectionViewer } from '../table-view/data-sources/collection-viewer';
import { TableDataSource, TablePageMetadata } from '../table-view/data-sources/table-data-source';

export class ExampleBasicTableDataSource<
  T,
  U extends string = string
> extends TableDataSource<T, U> {
  constructor(
    public readonly columns: readonly TableColumn<T, U>[],
    public readonly data: readonly T[]
  ) {
    super();
  }

  connect(
    collectionViewer: CollectionViewer<TablePageMetadata>
  ): Observable<T[]> {
    return collectionViewer.viewChange.pipe(
      map(({ search, start, end }) => {
        return (
          this.data
            // Search
            .filter((data) =>
              Object.values(data).some((value) =>
                `${value}`.toLowerCase().includes((search || '').toLowerCase())
              )
            )
            // Pagination
            .slice(start, end)
        );
      })
    );
  }

  // noop
  disconnect() {}
}
