import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input, ViewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {combineLatest, filter, of, startWith, switchMap} from 'rxjs';

import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {notNullAndUndefined} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {getActivatedRouteIdParam} from '../../../_shared/services/getActivatedRouteIdParam';
import {injectConfirmDialog} from '../../../_shared/ui/question-dialog/question-dialog.component';
import {GetOrganisationResponse, OrganisationUserResponse} from '../../../_shared/waiterrobot-backend';
import {OrganisationsUsersService} from '../_services/organisations-users.service';
import {OrganisationUserAddModalComponent} from './organisation-user-add-modal.component';

@Component({
  template: `
    <div class="d-flex flex-column flex-md-row gap-3 mb-3 justify-content-between">
      <form class="col-12 col-md-6">
        <div class="input-group">
          <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
          <button
            class="btn btn-outline-secondary"
            type="button"
            ngbTooltip="{{ 'CLEAR' | tr }}"
            placement="bottom"
            (click)="filter.reset()"
            *ngIf="(filter.value?.length ?? 0) > 0"
          >
            <bi name="x-circle-fill" />
          </button>
        </div>
      </form>

      <button class="col-12 col-md-3 col-lg-2 btn btn-secondary" type="button" (click)="onOrgUserAdd()">
        <bi name="save" />
        {{ 'ADD_3' | tr }}
      </button>
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
            <a class="btn btn-sm m-1 btn-outline-success text-white" ngbTooltip="{{ 'EDIT' | tr }}">
              <bi name="pencil-square" />
            </a>
          </td>
        </ng-container>

        <ng-container ngbColumnDef="actions">
          <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
          <td *ngbCellDef="let organisationUser" ngb-cell>
            <button
              type="button"
              class="btn btn-sm m-1 btn-outline-danger text-white"
              ngbTooltip="{{ 'DELETE' | tr }}"
              (click)="onOrgUserDelete(organisationUser)"
              *ngIf="myUserEmailAddress !== organisationUser.email_address"
            >
              <bi name="trash" />
            </button>
          </td>
        </ng-container>

        <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
        <tr *ngbRowDef="let organisationUser; columns: columnsToDisplay" ngb-row></tr>
      </table>
    </div>
  `,
  selector: 'app-organisation-edit-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgbTooltip, NgIf, BiComponent, DfxTableModule, DfxSortModule, DfxTr, NgSub, AsyncPipe],
})
export class OrganisationEditUsersComponent {
  modal = inject(NgbModal);
  confirmDialog = injectConfirmDialog();
  route = inject(ActivatedRoute);

  organisationsUsersService = inject(OrganisationsUsersService);

  entities$ = getActivatedRouteIdParam().pipe(switchMap((id) => this.organisationsUsersService.getByOrganisationId$(id)));
  filter = new FormControl('');
  columnsToDisplay = ['name', 'email', 'actions'];
  @ViewChild(NgbSort, {static: true}) sort: NgbSort | undefined;
  dataSource$ = combineLatest([this.filter.valueChanges.pipe(startWith(''), filter(notNullAndUndefined)), this.entities$]).pipe(
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
