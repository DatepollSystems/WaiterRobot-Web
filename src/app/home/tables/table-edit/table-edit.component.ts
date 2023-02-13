import {NgForOf, NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {loggerOf, n_from, n_isNumeric} from 'dfts-helper';
import {DfxAutofocus, DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppBtnModelEditConfirmComponent} from '../../../_shared/ui/form/app-btn-model-edit-confirm.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';

import {NotificationService} from '../../../notifications/notification.service';

import {EventModel} from '../../events/_models/event.model';

import {EventsService} from '../../events/_services/events.service';
import {TableGroupModel} from '../_models/table-group.model';
import {TableModel} from '../_models/table.model';
import {TableGroupsService} from '../_services/table-groups.service';
import {TablesService} from '../_services/tables.service';

@Component({
  template: `
    <div [hidden]="isEditing && !entityLoaded">
      <h1 *ngIf="isEditing && entity">{{ 'EDIT_2' | tr }} "{{ entity.name }}"</h1>
      <h1 *ngIf="!isEditing">{{ 'HOME_TABLES_ADD' | tr }}</h1>

      <btn-toolbar>
        <div>
          <button class="btn btn-sm btn-dark text-white" (click)="onGoBack()">{{ 'GO_BACK' | tr }}</button>
        </div>

        <app-btn-model-edit-confirm [form]="f" [editing]="isEditing"></app-btn-model-edit-confirm>

        <ng-container *ngIf="isEditing && entity">
          <div>
            <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
              <i-bs name="trash"></i-bs>
              {{ 'DELETE' | tr }}
            </button>
          </div>
        </ng-container>
      </btn-toolbar>

      <form id="ngForm" #f="ngForm" (ngSubmit)="onSave(f)">
        <ul ngbNav #nav="ngbNav" [(activeId)]="activeTab" class="nav-tabs bg-dark" (navChange)="setTabId($event.nextId)">
          <li [ngbNavItem]="1">
            <a ngbNavLink>{{ 'DATA' | tr }}</a>
            <ng-template ngbNavContent>
              <div class="d-flex flex-column flex-md-row gap-4 mb-3">
                <div class="form-group col-12 col-md-3">
                  <label for="number">{{ 'NUMBER' | tr }}</label>
                  <!--              (keyup.enter)='onSave(f)'-->
                  <input
                    focus
                    ngModel
                    class="form-control bg-dark text-white"
                    required
                    type="number"
                    id="number"
                    name="number"
                    #numberModel="ngModel"
                    minlength="3"
                    placeholder="{{ 'NUMBER' | tr }}"
                    [ngModel]="isEditing ? entity?.tableNumber : null" />

                  <small *ngIf="numberModel.invalid" class="text-danger">
                    {{ 'HOME_TABLES_NUMBER_INCORRECT' | tr }}
                  </small>
                </div>

                <div class="form-group col-12 col-md-3">
                  <label for="seats">{{ 'SEATS' | tr }}</label>
                  <input
                    ngModel
                    class="form-control bg-dark text-white"
                    required
                    type="number"
                    id="seats"
                    name="seats"
                    #seatsModel="ngModel"
                    minlength="3"
                    placeholder="{{ 'SEATS' | tr }}"
                    [ngModel]="isEditing ? entity?.seats : null" />
                  <small *ngIf="seatsModel.invalid" class="text-danger">
                    {{ 'HOME_TABLES_SEATS_INCORRECT' | tr }}
                  </small>
                </div>

                <div class="form-group col">
                  <label for="selectTableGroup">{{ 'HOME_TABLE_GROUPS' | tr }}</label>
                  <div class="input-group">
                    <span class="input-group-text bg-dark text-white" id="selectTableGroup-addon1"><i-bs name="diagram-3"></i-bs></span>
                    <select
                      class="form-select bg-dark text-white"
                      id="selectTableGroup"
                      name="groupId"
                      [(ngModel)]="selectedTableGroup"
                      (ngModelChange)="selectTableGroup($event)"
                      required>
                      <option [ngValue]="undefined" disabled>{{ 'HOME_TABLES_GROUPS_DEFAULT' | tr }}</option>
                      <option [ngValue]="tableGroup.id" *ngFor="let tableGroup of this.tableGroups; trackById">
                        {{ tableGroup.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-check form-switch mt-2" *ngIf="!isEditing">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="continuousCreation"
                  [(ngModel)]="continuousCreation"
                  [ngModelOptions]="{standalone: true}" />
                <label class="form-check-label" for="continuousCreation">{{ 'CONTINUOUS_CREATION' | tr }}</label>
              </div>
            </ng-template>
          </li>
        </ul>

        <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
      </form>
    </div>

    <app-spinner-row [show]="isEditing && !entityLoaded"></app-spinner-row>
  `,
  selector: 'app-table-edit',
  standalone: true,
  imports: [
    NgIf,
    AppBtnToolbarComponent,
    AppBtnModelEditConfirmComponent,
    AppIconsModule,
    DfxTr,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    FormsModule,
    DfxAutofocus,
    NgbNavOutlet,
    AppSpinnerRowComponent,
    DfxTrackById,
    NgForOf,
  ],
})
export class TableEditComponent extends AbstractModelEditComponent<TableModel> {
  private log = loggerOf('TableEditComponent');
  override redirectUrl = '/home/tables/all';
  override continuousUsePropertyNames = ['groupId', 'seats'];

  selectedEvent?: EventModel;

  tableGroups: TableGroupModel[];
  selectedTableGroup?: number;

  constructor(
    tablesService: TablesService,
    eventsService: EventsService,
    tableGroupsService: TableGroupsService,
    private notificationService: NotificationService
  ) {
    super(tablesService);

    this.selectedEvent = eventsService.getSelected();
    this.tableGroups = tableGroupsService.getAll();
    this.unsubscribe(
      eventsService.getSelected$.subscribe((event) => {
        this.selectedEvent = event;
      }),
      tableGroupsService.allChange.subscribe((tableGroups) => {
        this.tableGroups = tableGroups;
      }),
      this.route.queryParams.subscribe((params) => {
        const id = params.group;
        if (n_isNumeric(id)) {
          this.selectedTableGroup = n_from(id);
          this.log.info('constructor', 'Selected table group: ' + id);
        }
      })
    );
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.eventId = this.selectedEvent!.id;
    return model;
  }

  override createAndUpdateFilter(model: any): boolean {
    if (!this.selectedTableGroup) {
      this.notificationService.twarning('HOME_TABLES_GROUPS_DEFAULT');
      return false;
    }
    return super.createAndUpdateFilter(model);
  }

  override onEntityEdit(model: TableModel): void {
    this.selectedTableGroup = model.groupId;
  }

  selectTableGroup(value: number): void {
    this.log.info('selectTableGroup', 'Selecting Table group', value);
  }
}
