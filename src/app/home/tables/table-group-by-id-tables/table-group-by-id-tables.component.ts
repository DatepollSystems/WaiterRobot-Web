import {Component} from '@angular/core';
import {AbstractModelsListByIdComponent} from '../../../_shared/ui/abstract-models-list-by-id.component';
import {TableGroupModel} from '../_models/table-group.model';

import {TableModel} from '../_models/table.model';
import {TableGroupsService} from '../_services/table-groups.service';

import {TablesService} from '../_services/tables.service';
import {AppPrintTableQrCodesModalComponent} from '../_ui/app-print-table-qr-codes-modal';

@Component({
  selector: 'app-table-group-by-id-tables',
  templateUrl: './table-group-by-id-tables.component.html',
  styleUrls: ['./table-group-by-id-tables.component.scss'],
})
export class TableGroupByIdTablesComponent extends AbstractModelsListByIdComponent<TableModel, TableGroupModel> {
  override columnsToDisplay = ['name', 'seats', 'actions'];
  override getAllParam = 'groupId';

  constructor(tablesService: TablesService, tableGroupsService: TableGroupsService) {
    super(tablesService, tableGroupsService);

    this.setSelectable();
  }

  printSelectedTables(): void {
    const modalRef = this.modal.open(AppPrintTableQrCodesModalComponent, {
      ariaLabelledBy: 'app-tables-qr-codes-title',
      size: 'lg',
    });
    modalRef.componentInstance.tables = this.selection?.selected.sort(function (a, b) {
      return a.groupName.localeCompare(b.groupName) || a.tableNumber - b.tableNumber;
    });
  }
}
