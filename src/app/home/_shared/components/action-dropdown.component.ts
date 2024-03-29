import {Component} from '@angular/core';
import {NgbDropdown, NgbDropdownAnchor, NgbDropdownMenu} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';
import {StopPropagationDirective} from 'dfx-helper';

@Component({
  template: `
    <div #dropdown="ngbDropdown" ngbDropdown class="d-inline-block" stopPropagation placement="left-top" container="body">
      <button type="button" class="btn btn-sm btn-outline-secondary" id="actionDropdown" ngbDropdownAnchor (mousedown)="dropdown.toggle()">
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
