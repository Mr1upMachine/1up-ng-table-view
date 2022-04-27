import { Observable } from 'rxjs';

// TODO redo the types for this file

/**
 * T = Row data
 * CK = column key string literal union
 */
export type TableColumn<T, CK extends string = string> =
  | TextTableColumn<T, CK>
  | ButtonTableColumn<T, CK>;

/** CK = column key string literal union */
interface BaseTableColumn<CK extends string> {
  key: CK;
  header: string | Observable<string>;
}

/**
 * T = Row data
 * CK = column key string literal union
 */
interface TextTableColumn<T, CK extends string> extends BaseTableColumn<CK> {
  type: 'text';
  cell: (row: T) => string | Observable<string>;
}

/**
 * T = Row data
 * CK = column key string literal union
 */
interface ButtonTableColumn<T, CK extends string> extends BaseTableColumn<CK> {
  type: 'button';
  cell: (row: T) => string | Observable<string>;
  click: (row: T) => void;
}
