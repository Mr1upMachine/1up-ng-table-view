import { Pipe, PipeTransform } from '@angular/core';
import { from, Observable, of } from 'rxjs';

@Pipe({
  name: 'toObservable',
})
export class ToObservablePipe implements PipeTransform {
  transform<T>(value: T | Observable<T>): Observable<T> {
    if (value instanceof Observable) {
      return value;
    } else if (value instanceof Promise) {
      return from(value);
    } else {
      return of(value);
    }
  }
}
