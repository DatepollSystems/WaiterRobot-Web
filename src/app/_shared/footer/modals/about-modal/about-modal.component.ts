import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EnvironmentHelper} from '../../../../_helper/EnvironmentHelper';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.css'],
})
export class AboutModalComponent {
  frontendVersion = EnvironmentHelper.getWebVersion();

  clicker = 0;
  timeoutHandler: any | undefined;

  constructor(private modalService: NgbModal) {}

  open(content: any): void {
    this.modalService.open(content, {ariaLabelledBy: 'About modal'});
  }

  mouseup(): void {
    if (this.timeoutHandler) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = undefined;
    }
  }

  mousedown(): void {
    this.timeoutHandler = setTimeout(() => {
      this.timeoutHandler = undefined;
      console.log(
        '                      /^--^\\     /^--^\\     /^--^\\\n' +
          '                      \\____/     \\____/     \\____/\n' +
          '                     /      \\   /      \\   /      \\\n' +
          '                    |        | |        | |        |\n' +
          '                     \\__  __/   \\__  __/   \\__  __/\n' +
          '|^|^|^|^|^|^|^|^|^|^|^|^\\ \\^|^|^|^/ /^|^|^|^|^\\ \\^|^|^|^|^|^|^|^|^|^|^|^|\n' +
          '| | | | | | | | | | | | |\\ \\| | |/ /| | | | | | \\ \\ | | | | | | | | | | |\n' +
          '########################/ /######\\ \\###########/ /#######################\n' +
          '| | | | | | | | | | | | \\/| | | | \\/| | | | | |\\/ | | | | | | | | | | | |\n' +
          '|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|\n'
      );
      console.log('Secret source cats love you!');
    }, 1000 * 5);
  }

  clicked(): void {
    this.clicker++;
    setTimeout(() => {
      this.clicker = 0;
    }, 1000 * 3);
    if (this.clicker > 6) {
      document.getElementById('body')?.classList.add('tilt');
    }
  }
}
