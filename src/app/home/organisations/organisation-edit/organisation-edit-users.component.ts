import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input, ViewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {combineLatest, filter, of, startWith, switchMap} from 'rxjs';

import {injectConfirmDialog} from '@home-shared/components/question-dialog.component';
import {injectIdParam$} from '@home-shared/services/injectActivatedRouteIdParam';
import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {GetOrganisationResponse, OrganisationUserResponse} from '@shared/waiterrobot-backend';

import {notNullAndUndefined} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {OrganisationsUsersService} from '../_services/organisations-users.service';
import {OrganisationUserAddModalComponent} from './organisation-user-add-modal.component';

@Component({
  template: `
    <div class="d-flex flex-column gap-2 pt-3">
      <div class="d-flex flex-column flex-md-row gap-3 justify-content-between">
        <div>
          <button class="btn btn-success" type="button" (click)="onOrgUserAdd()">
            <bi name="save" />
            {{ 'ADD_3' | tr }}
          </button>
        </div>
        <div>
          <div class="input-group">
            <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
            @if ((filter.value?.length ?? 0) > 0) {
              <button
                class="btn btn-outline-secondary"
                type="button"
                ngbTooltip="{{ 'CLEAR' | tr }}"
                placement="bottom"
                (click)="filter.reset()"
              >
                <bi name="x-circle-fill" />
              </button>
            }
          </div>
        </div>
      </div>

      <div class="table-responsive mt-3">
        <table ngb-table [hover]="true" [dataSource]="(dataSource$ | async) ?? []" ngb-sort>
          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
            <td *ngbCellDef="let organisationUser" ngb-cell>{{ organisationUser.firstname }} {{ organisationUser.surname }}</td>
          </ng-container>

          <ng-container ngbColumnDef="email">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'EMAIL' | tr }}</th>
            <td *ngbCellDef="let organisationUser" ngb-cell>{{ organisationUser.emailAddress }}</td>
          </ng-container>

          <ng-container ngbColumnDef="role">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ROLE' | tr }}</th>
            <td *ngbCellDef="let organisationUser" ngb-cell>
              {{ organisationUser.role }}
              <a class="btn btn-sm m-1 btn-outline-success" ngbTooltip="{{ 'EDIT' | tr }}">
                <bi name="pencil-square" />
              </a>
            </td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let organisationUser" ngb-cell>
              @if (myUserEmailAddress !== organisationUser.email_address) {
                <button
                  type="button"
                  class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
                  ngbTooltip="{{ 'DELETE' | tr }}"
                  (click)="onOrgUserDelete(organisationUser)"
                >
                  <bi name="trash" />
                </button>
              }
            </td>
          </ng-container>

          <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
          <tr *ngbRowDef="let organisationUser; columns: columnsToDisplay" ngb-row></tr>
        </table>
      </div>
    </div>
  `,
  selector: 'app-organisation-edit-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgbTooltip, BiComponent, DfxTableModule, DfxSortModule, DfxTr, AsyncPipe],
})
export class OrganisationEditUsersComponent {
  modal = inject(NgbModal);
  confirmDialog = injectConfirmDialog();

  organisationsUsersService = inject(OrganisationsUsersService);

  filter = new FormControl('');
  columnsToDisplay = ['name', 'email', 'actions'];
  @ViewChild(NgbSort, {static: true}) sort: NgbSort | undefined;
  dataSource$ = combineLatest([
    this.filter.valueChanges.pipe(startWith(''), filter(notNullAndUndefined)),
    injectIdParam$().pipe(switchMap((id) => this.organisationsUsersService.getByOrganisationId$(id))),
  ]).pipe(
    switchMap(([filterTerm, all]) => {
      const dataSource = new NgbTableDataSource(all);

      if (this.sort) {
        dataSource.sort = this.sort;
      }
      dataSource.filter = filterTerm ?? '';

      return of(dataSource);
    }),
    startWith(new NgbTableDataSource<OrganisationUserResponse>()),
  );

  @Input() organisation!: GetOrganisationResponse;

  @Input() myUserEmailAddress?: string;

  onOrgUserDelete(model: OrganisationUserResponse): void {
    void this.confirmDialog('DELETE_CONFIRMATION').then((result) => {
      if (result) {
        this.organisationsUsersService.delete$(model.organisationId, model.emailAddress).subscribe();
      }
    });
  }

  onOrgUserAdd(): void {
    const modalRef = this.modal.open(OrganisationUserAddModalComponent, {ariaLabelledBy: 'modal-title-org-user-add', size: 'lg'});
    modalRef.componentInstance.entity = this.organisation;
  }
}
