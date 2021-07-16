import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EnvironmentHelper} from '../../../_helper/EnvironmentHelper';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.css']
})
export class AboutModalComponent {
  frontendVersion = EnvironmentHelper.getWebversion();

  constructor(private modalService: NgbModal) {
  }

  open(content: any): void {
    this.modalService.open(content, {ariaLabelledBy: 'About modal'});
  }
}
