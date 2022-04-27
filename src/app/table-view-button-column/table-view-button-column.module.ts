import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableViewButtonColumnComponent } from './table-view-button-column.component';
import { ToObservableModule } from '../core/to-observable.module';

@NgModule({
  imports: [CommonModule, ToObservableModule],
  declarations: [TableViewButtonColumnComponent],
  exports: [TableViewButtonColumnComponent],
})
export class TableViewButtonColumnModule {}
