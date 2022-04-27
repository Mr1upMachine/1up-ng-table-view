import { TableViewTextColumnComponent } from '../table-view-text-column/table-view-text-column.component';
import { TableViewTextColumnModule } from '../table-view-text-column/table-view-text-column.module';

export const TABLE_VIEW_DEFAULT_COLUMN_TYPES: any[] = [
  {
    type: 'text',
    component: TableViewTextColumnComponent,
    module: TableViewTextColumnModule,
  },
];
