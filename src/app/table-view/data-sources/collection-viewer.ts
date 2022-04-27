import { Observable } from 'rxjs';

/**
 * Interface for any component that provides a view of some data collection and wants to provide
 * information regarding the view and any changes made.
 */
export interface CollectionViewer<T extends object> {
  /**
   * A stream that emits whenever the `CollectionViewer` starts looking at a new portion of the
   * data.
   */
  viewChange: Observable<T>;
}
