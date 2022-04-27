import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TABLE_VIEW_COLUMN } from '../table-view/table-view-column-token';
import { TABLE_VIEW_ROW } from '../table-view/table-view-row-token';

@Component({
  templateUrl: './table-view-button-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableViewButtonColumnComponent {
  constructor(
    @Inject(TABLE_VIEW_COLUMN)
    public readonly column: any,
    @Inject(TABLE_VIEW_ROW)
    public readonly row: any
  ) {}

  onClick() {
    this.column.click(this.row);
  }
}
