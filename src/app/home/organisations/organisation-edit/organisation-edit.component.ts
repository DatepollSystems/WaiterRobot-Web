import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {TypeHelper} from 'dfx-helper';

import {OrganisationsService} from '../../../_services/organisations.service';
import {OrganisationModel} from '../../../_models/organisation.model';
import {UserModel} from '../../../_models/user.model';
import {MyUserService} from '../../../_services/myUser.service';

@Component({
  selector: 'app-organisation-edit',
  templateUrl: './organisation-edit.component.html',
  styleUrls: ['./organisation-edit.component.scss']
})
export class OrganisationEditComponent implements OnDestroy {
  isEdit = false;
  active = 1;

  myUser: UserModel|null = null;
  myUserSubscription: Subscription;

  organisation: OrganisationModel | undefined;
  _organisationSubscription: Subscription | undefined;

  selectedOrganisation!: OrganisationModel | null;
  selectedOrganisationSubscription: Subscription | undefined;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private myUserService: MyUserService,
              private organisationsService: OrganisationsService) {
    this.myUser = this.myUserService.getUser();
    this.myUserSubscription = this.myUserService.userChange.subscribe(user => {
      this.myUser = user;
    });

    this.route.queryParams.subscribe((params => {
      if (params?.tab != null) {
        this.active = TypeHelper.stringToNumber(params?.tab);
      }
    }));

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          console.log('Org to open: ' + id);
          this.organisation = this.organisationsService.getSingle(TypeHelper.stringToNumber(id));
          this._organisationSubscription = this.organisationsService.singleChange.subscribe((value: OrganisationModel) => {
            this.organisation = value;
          });
          this.isEdit = true;

          this.selectedOrganisation = this.organisationsService.getSelected();
          this.selectedOrganisationSubscription = this.organisationsService.selectedChange.subscribe((value: OrganisationModel|null) => {
            this.selectedOrganisation = value;
          });
        } else {
          this.isEdit = false;
          console.log('Create new org');

          // Tab 3 is the statistics tab which does not exist on create organisation
          if (this.active == 3) {
            this.active = 1;
          }
        }
      } else {
        console.log('No org to open');
      }
    });
  }

  ngOnDestroy(): void {
    this.myUserSubscription.unsubscribe();
    this._organisationSubscription?.unsubscribe();
    this.selectedOrganisationSubscription?.unsubscribe();
  }

  onNavChange($event: any) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {tab: $event.nextId},
        queryParamsHandling: 'merge',
      }).then();
  }

  onSelect(organisation: OrganisationModel | null) {
    this.organisationsService.setSelected(organisation);
  }

  onSave(f: NgForm) {
    let org = f.form.value;
    console.log(org);
    if (this.isEdit && this.organisation?.id != null) {
      org.id = this.organisation?.id;
      this.organisationsService.update(org);
    } else {
      this.organisationsService.create(org);
    }
    this.router.navigateByUrl('/home/organisations/all').then();
  }

  delete(organisationId: number) {
    this.organisationsService.delete(organisationId);
    this.router.navigateByUrl('/home/organisations/all').then();
  }
}
