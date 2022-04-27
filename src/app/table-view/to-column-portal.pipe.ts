import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Inject, Injector, Pipe, PipeTransform } from '@angular/core';
import { TABLE_COLUMN_TYPES } from './table-column-types-token';
import { TABLE_VIEW_COLUMN } from './table-view-column-token';
import { TABLE_VIEW_ROW } from './table-view-row-token';

@Pipe({
  name: 'toColumnPortal',
})
export class ToColumnPortalPipe implements PipeTransform {
  constructor(
    @Inject(TABLE_COLUMN_TYPES) private readonly columnTypes: any[],
    private readonly injector: Injector
  ) {}

  transform<CL extends { type: string }, R, CP>(value: {
    column: CL;
    row: R;
  }): ComponentPortal<ComponentType<CP>> {
    const column = this.columnTypes.find(
      (columnTypes) => columnTypes.type === value.column.type
    );

    if (!column) {
      return;
    }

    const injector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: TABLE_VIEW_COLUMN,
          useValue: value.column,
        },
        {
          provide: TABLE_VIEW_ROW,
          useValue: value.row,
        },
      ],
    });

    return new ComponentPortal(column.component, null, injector);
  }
}
