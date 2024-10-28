import {Component} from '@angular/core';

import {NgbDropdown, NgbDropdownAnchor, NgbDropdownMenu} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';
import {StopPropagationDirective} from 'dfx-helper';

@Component({
  template: `
    <div class="d-inline-block" #dropdown="ngbDropdown" ngbDropdown stopPropagation placement="left-top" container="body">
      <button
        class="btn btn-sm btn-outline-secondary no-dots"
        id="actionDropdown"
        (mousedown)="dropdown.toggle()"
        type="button"
        ngbDropdownAnchor
      >
        <bi name="three-dots" />
      </button>
      <div ngbDropdownMenu aria-labelledby="actionDropdown">
        <ng-content />
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgbDropdown, StopPropagationDirective, BiComponent, NgbDropdownMenu, NgbDropdownAnchor],
  selector: 'app-action-dropdown',
})
export class ActionDropdownComponent {}
