import { NgModule } from '@angular/core';
import { ToObservablePipe } from './to-observable.pipe';

@NgModule({
  declarations: [ToObservablePipe],
  exports: [ToObservablePipe],
})
export class ToObservableModule {}
