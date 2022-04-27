import { Observable } from 'rxjs';
import { CollectionViewer } from './collection-viewer';

/**
 * T = Data
 * M = Page metadata
 * CV = Collection viewer (default being the CollectionViewer)
 */
export abstract class DataSource<
  T,
  M extends object,
  CV extends CollectionViewer<M> = CollectionViewer<M>
> {
  /**
   * Connects a collection viewer (such as a data-table) to this data source. Note that
   * the stream provided will be accessed during change detection and should not directly change
   * values that are bound in template views.
   * @param collectionViewer The component that exposes a view over the data provided by this
   *     data source.
   * @returns Observable that emits a new value when the data changes.
   */
  abstract connect(collectionViewer: CV): Observable<readonly T[]>;

  /**
   * Disconnects a collection viewer (such as a data-table) from this data source. Can be used
   * to perform any clean-up or tear-down operations when a view is being destroyed.
   *
   * @param collectionViewer The component that exposes a view over the data provided by this
   *     data source.
   */
  abstract disconnect(collectionViewer: CV): void;
}
