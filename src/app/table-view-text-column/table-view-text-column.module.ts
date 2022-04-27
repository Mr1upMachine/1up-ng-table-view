import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableViewTextColumnComponent } from './table-view-text-column.component';
import { ToObservableModule } from '../core/to-observable.module';

@NgModule({
  imports: [CommonModule, ToObservableModule],
  declarations: [TableViewTextColumnComponent],
  exports: [TableViewTextColumnComponent],
})
export class TableViewTextColumnModule {}
