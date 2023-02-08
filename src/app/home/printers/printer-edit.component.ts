import {NgForOf, NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditComponent} from '../../_shared/ui/abstract-model-edit.component';
import {AppBtnModelEditConfirmComponent} from '../../_shared/ui/app-btn-model-edit-confirm.component';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/app-spinner-row.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';

import {EventModel} from '../events/_models/event.model';

import {EventsService} from '../events/_services/events.service';
import {PrinterModel} from './_models/printer.model';
import {PrintersService} from './_services/printers.service';

@Component({
  template: `
    <div [hidden]="isEditing && !entityLoaded">
      <h1 *ngIf="isEditing && entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *ngIf="!isEditing">{{ 'ADD_2' | tr }}</h1>

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
        <ul ngbNav #nav="ngbNav" [(activeId)]="activeTab" class="nav-tabs mt-3 bg-dark" (navChange)="setTabId($event.nextId)">
          <li [ngbNavItem]="1">
            <a ngbNavLink>{{ 'DATA' | tr }}</a>
            <ng-template ngbNavContent>
              <div class="d-flex flex-column flex-md-row gap-4 mb-4">
                <div class="col form-group">
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
                    maxlength="120"
                    placeholder="{{ 'NAME' | tr }}"
                    [ngModel]="isEditing ? entity?.name : null" />

                  <small *ngIf="nameModel.invalid" class="text-danger">
                    {{ 'HOME_PRINTER_NAME_INCORRECT' | tr }}
                  </small>
                </div>

                <div class="col form-group">
                  <label for="name">{{ 'HOME_PRINTER_NAME' | tr }}</label>
                  <input
                    ngModel
                    class="form-control bg-dark text-white"
                    required
                    type="text"
                    id="printerName"
                    name="printerName"
                    #printerNameModel="ngModel"
                    minlength="1"
                    maxlength="70"
                    placeholder="{{ 'NAME' | tr }}"
                    [ngModel]="isEditing ? entity?.printerName : undefined" />

                  <small *ngIf="printerNameModel.invalid" class="text-danger">
                    {{ 'HOME_PRINTER_NAME_NAME_INCORRECT' | tr }}
                  </small>
                </div>
              </div>

              <div class="d-flex flex-column flex-md-row gap-4">
                <div class="col-12 col-md-6 form-group">
                  <label for="eventId">{{ 'NAV_EVENTS' | tr }}</label>
                  <div class="input-group">
                    <span class="input-group-text bg-dark text-white" id="eventId-addon"><i-bs name="diagram-3"></i-bs></span>
                    <select
                      class="form-select bg-dark text-white"
                      [ngModel]="isEditing ? entity?.eventId : selectedEvent ? selectedEvent.id : undefined"
                      #selectEventModel="ngModel"
                      id="eventId"
                      name="eventId"
                      required>
                      <option [ngValue]="undefined" disabled>{{ 'HOME_PRINTER_SELECT_EVENT_DEFAULT' | tr }}</option>
                      <option [ngValue]="event.id" *ngFor="let event of this.events; trackById">
                        {{ event.name }}
                      </option>
                    </select>
                  </div>
                  <small *ngIf="selectEventModel.invalid" class="text-danger">
                    {{ 'HOME_PRINTER_SELECT_EVENT_INCORRECT' | tr }}
                  </small>
                </div>
              </div>
            </ng-template>
          </li>
          <li [ngbNavItem]="2" *ngIf="isEditing">
            <a ngbNavLink>{{ 'STATISTICS' | tr }}</a>
            <ng-template ngbNavContent> Coming soon...</ng-template>
          </li>
        </ul>

        <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
      </form>
    </div>

    <app-spinner-row [show]="isEditing && !entityLoaded"></app-spinner-row>
  `,
  selector: 'app-printer-edit',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavOutlet,
    NgbNavContent,
    DfxTrackById,
    DfxTr,
    AppIconsModule,
    AppBtnModelEditConfirmComponent,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
  ],
})
export class PrinterEditComponent extends AbstractModelEditComponent<PrinterModel> {
  override redirectUrl = '/home/printers/mediators';
  override onlyEditingTabs = [2];

  selectedEvent?: EventModel;
  events: EventModel[];

  constructor(printersService: PrintersService, eventsService: EventsService) {
    super(printersService);

    this.selectedEvent = eventsService.getSelected();
    this.events = eventsService.getAll();

    this.unsubscribe(
      eventsService.getSelected$.subscribe((it) => (this.selectedEvent = it)),
      eventsService.allChange.subscribe((it) => (this.events = it))
    );
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    this.redirectUrl = '/home/printers/event/' + model.eventId;

    return super.addCustomAttributesBeforeCreateAndUpdate(model);
  }
}
