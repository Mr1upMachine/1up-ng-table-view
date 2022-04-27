import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { PeriodicElement } from '../types/periodic-elements';

interface PeriodicElementsApiParams {
  readonly page: number;
  readonly size: number;
  readonly searchText?: string;
  readonly filter?: readonly string[];
}

@Injectable({ providedIn: 'root' })
export class PeriodicElementsApiService {
  constructor(private readonly httpClient: HttpClient) {}

  getElements(
    params?: PeriodicElementsApiParams
  ): Observable<readonly PeriodicElement[]> {
    let api = this.httpClient.get<PeriodicElement[]>(
      '/assets/periodic-elements.json'
    );

    // Normally, the params would be passed in as HttpParams above. But since this is just a demo, I am manipulating the data based on params here.
    if (params) {
      if (params.searchText) {
        api = api.pipe(
          map((elements) =>
            elements.filter((data) =>
              Object.values(data).some((value) =>
                `${value}`
                  .toLowerCase()
                  .includes((params.searchText || '').toLowerCase())
              )
            )
          )
        );
      }
      if (params.filter) {
        // TODO
      }

      api = api.pipe(
        map((elements) => {
          const start = params.page * params.size;
          const end = start + params.size;
          return elements.slice(start, end);
        })
      );
    }

    return api.pipe(
      tap((elements) => {
        console.log('Elements requested via HTTP', elements);
      })
    );
  }
}
