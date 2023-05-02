import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input, ViewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {notNullAndUndefined} from 'dfts-helper';
import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {AComponent, NgSub} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {combineLatest, filter, of, startWith, switchMap} from 'rxjs';
import {getActivatedRouteIdParam} from '../../../_shared/services/getActivatedRouteIdParam';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {QuestionDialogComponent} from '../../../_shared/ui/question-dialog/question-dialog.component';
import {GetOrganisationResponse, OrganisationUserResponse} from '../../../_shared/waiterrobot-backend';
import {OrganisationsUsersService} from '../_services/organisations-users.service';
import {OrganisationUserAddModalComponent} from './organisation-user-add-modal.component';

@Component({
  template: `
    <div class="d-flex flex-column flex-md-row gap-3 mb-3 justify-content-between">
      <form class="col-12 col-md-6">
        <div class="input-group">
          <input class="form-control ml-2 bg-dark text-white" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
          <button
            class="btn btn-outline-secondary"
            type="button"
            ngbTooltip="{{ 'CLEAR' | tr }}"
            placement="bottom"
            (click)="filter.reset()"
            *ngIf="(filter.value?.length ?? 0) > 0"
          >
            <i-bs name="x-circle-fill" />
          </button>
        </div>
      </form>

      <button class="col-12 col-md-3 col-lg-2 btn btn-secondary" type="button" (click)="onOrgUserAdd()">
        <i-bs name="save" />
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
              <i-bs name="pencil-square" />
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
              <i-bs name="trash" />
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
  imports: [ReactiveFormsModule, NgbTooltip, NgIf, AppIconsModule, DfxTableModule, DfxSortModule, DfxTr, NgSub, AsyncPipe],
})
export class OrganisationEditUsersComponent extends AComponent {
  modal = inject(NgbModal);
  route = inject(ActivatedRoute);

  organisationsUsersService = inject(OrganisationsUsersService);

  entities$ = getActivatedRouteIdParam().pipe(switchMap((id) => this.organisationsUsersService.getByParent$(id)));
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
    startWith(new NgbTableDataSource<OrganisationUserResponse>())
  );

  @Input() organisation!: GetOrganisationResponse;

  @Input() myUserEmailAddress?: string;

  onOrgUserDelete(model: OrganisationUserResponse): void {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        this.organisationsUsersService.delete$(model.organisationId, model.emailAddress).subscribe();
      }
    });
  }

  onOrgUserAdd(): void {
    const modalRef = this.modal.open(OrganisationUserAddModalComponent, {ariaLabelledBy: 'modal-title-org-user-add', size: 'lg'});
    modalRef.componentInstance.entity = this.organisation;
  }
}
