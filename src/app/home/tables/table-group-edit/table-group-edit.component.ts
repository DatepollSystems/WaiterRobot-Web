import {NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppBtnModelEditConfirmComponent} from '../../../_shared/ui/form/app-btn-model-edit-confirm.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {EventModel} from '../../events/_models/event.model';
import {EventsService} from '../../events/_services/events.service';
import {TableGroupModel} from '../_models/table-group.model';
import {TableGroupsService} from '../_services/table-groups.service';

@Component({
  template: `
    <div [hidden]="isEditing && !entityLoaded">
      <h1 *ngIf="isEditing && entity">{{ 'EDIT_2' | tr }} "{{ entity.name }}"</h1>
      <h1 *ngIf="!isEditing">{{ 'HOME_TABLE_GROUPS_ADD' | tr }}</h1>

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
                <div class="form-group col">
                  <label for="name">{{ 'NAME' | tr }}</label>
                  <input
                    ngModel
                    class="form-control bg-dark text-white"
                    required
                    type="text"
                    id="name"
                    name="name"
                    #nameModel="ngModel"
                    minlength="1"
                    maxlength="60"
                    placeholder="{{ 'NAME' | tr }}"
                    [ngModel]="isEditing ? entity?.name : null" />

                  <small *ngIf="nameModel.invalid" class="text-danger">
                    {{ 'HOME_TABLE_GROUP_NAME_INCORRECT' | tr }}
                  </small>
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
  selector: 'app-table-group-edit',
  standalone: true,
  imports: [
    NgIf,
    AppBtnToolbarComponent,
    AppBtnModelEditConfirmComponent,
    DfxTr,
    AppIconsModule,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    FormsModule,
    NgbNavOutlet,
    AppSpinnerRowComponent,
  ],
})
export class TableGroupEditComponent extends AbstractModelEditComponent<TableGroupModel> {
  override redirectUrl = '/home/tables/groups/all';

  selectedEvent?: EventModel;

  constructor(tableGroupsService: TableGroupsService, eventsService: EventsService) {
    super(tableGroupsService);

    this.selectedEvent = eventsService.getSelected();
    this.unsubscribe(eventsService.getSelected$.subscribe((it) => (this.selectedEvent = it)));
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.eventId = this.selectedEvent!.id;
    return model;
  }
}
