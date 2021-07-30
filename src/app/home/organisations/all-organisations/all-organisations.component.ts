import {Component, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {Subscription} from 'rxjs';

import {compare, SortableHeader, SortEvent} from '../../../_helper/table-sortable';

import {SessionsService} from '../../../_services/sessions.service';
import {SessionsModel} from '../../../_models/sessions';
import {OrganisationsModel} from '../../../_models/organisations';
import {OrganisationsService} from '../../../_services/organisations.service';
import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-all-organisations',
  templateUrl: './all-organisations.component.html',
  styleUrls: ['./all-organisations.component.scss']
})
export class AllOrganisationsComponent implements OnDestroy {
  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader> | undefined;
  filter = new FormControl('');

  organisations: OrganisationsModel[];
  organisationsCopy: OrganisationsModel[];
  organisationsSubscription: Subscription;

  constructor(private organisationsService: OrganisationsService) {
    this.organisations = this.organisationsService.getAll();
    this.organisationsCopy = this.organisations.slice();
    this.organisationsSubscription = this.organisationsService.allChange.subscribe(value => {
      this.organisations = value;
      this.organisationsCopy = this.organisations.slice();
    });

    this.filter.valueChanges.subscribe(value => {
      if (value == null) {
        this.organisationsCopy = this.organisations.slice();
        return;
      }
      value = value.trim().toLowerCase();
      this.organisationsCopy = [];
      for (const org of this.organisations) {
        if (org.id == value
          || org.name.trim().toLowerCase().includes(value)
          || org.street.trim().toLowerCase().includes(value)
          || org.postal_code.trim().toLowerCase().includes(value)
          || org.city.trim().toLowerCase().includes(value)
          || org.country_code.trim().toLowerCase().includes(value)
          || org.street_number.trim().toLowerCase().includes(value)) {
          this.organisationsCopy.push(org);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.organisationsSubscription.unsubscribe();
  }

  onSelect(organisationId: number) {
    this.organisationsService.changeSelected(organisationId);
  }

  onDelete(id: number) {
    this.organisationsService.delete(id);
  }

  onSort({column, direction}: SortEvent): boolean | void {
    if (this.headers == null) {
      return;
    }

    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.organisationsCopy = this.organisations.slice();
    } else {
      this.organisationsCopy = [...this.organisations].sort((a, b) => {
        // @ts-ignore
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
