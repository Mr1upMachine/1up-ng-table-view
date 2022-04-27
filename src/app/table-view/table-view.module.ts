import { PortalModule } from '@angular/cdk/portal';
import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TableViewComponent } from './table-view.component';
import { ToObservableModule } from '../core/to-observable.module';
import { ToColumnPortalPipe } from './to-column-portal.pipe';
import { TABLE_VIEW_DEFAULT_COLUMN_TYPES } from './table-view-default-column-types';
import { TABLE_COLUMN_TYPES } from './table-column-types-token';

@NgModule({
  imports: [
    CdkTableModule,
    CommonModule,
    PortalModule,
    ReactiveFormsModule,
    ToObservableModule,
  ],
  declarations: [TableViewComponent, ToColumnPortalPipe],
  exports: [TableViewComponent],
  providers: [
    {
      provide: TABLE_COLUMN_TYPES,
      useValue: TABLE_VIEW_DEFAULT_COLUMN_TYPES,
    },
  ],
})
export class TableViewModule {}
