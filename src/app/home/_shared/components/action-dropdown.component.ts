import {Component} from '@angular/core';
import {StopPropagationDirective} from '@home-shared/stop-propagation';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div ngbDropdown class="d-inline-block" stopPropagation placement="left-top" container="body">
      <button type="button" class="btn btn-sm btn-outline-secondary" id="actionDropdown" ngbDropdownToggle>
        <bi name="three-dots" />
      </button>
      <div ngbDropdownMenu aria-labelledby="actionDropdown">
        <ng-content />
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgbDropdown, StopPropagationDirective, NgbDropdownToggle, BiComponent, NgbDropdownMenu],
  selector: 'app-action-dropdown',
})
export class ActionDropdownComponent {}
