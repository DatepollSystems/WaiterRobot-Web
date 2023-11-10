import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';

@Component({
  selector: 'app-organisations',
  template: '<entities-layout-component showNav="false" />',
  imports: [AsyncPipe, RouterLink, RouterLinkActive, DfxTr, BiComponent, AppEntitiesLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OrganisationsComponent {}
