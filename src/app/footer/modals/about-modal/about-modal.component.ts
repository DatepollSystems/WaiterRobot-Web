import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EnvironmentHelper} from '../../../_helper/EnvironmentHelper';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.css'],
})
export class AboutModalComponent {
  frontendVersion = EnvironmentHelper.getWebversion();

  timeoutHandler: any;

  constructor(private modalService: NgbModal) {}

  open(content: any): void {
    this.modalService.open(content, {ariaLabelledBy: 'About modal'});
  }

  mouseup(): void {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = undefined;
    }
  }

  mousedown(): void {
    this.timeoutHandler = setTimeout(() => {
      this.timeoutHandler = undefined;
      console.log('you have found me');
    }, 1000 * 5);
  }
}
