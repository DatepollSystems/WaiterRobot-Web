import { NgModule } from '@angular/core';

import { BootstrapIconsModule } from 'ng-bootstrap-icons';
import {
  BoxArrowLeft,
  FileLock,
  Gear,
  GearWideConnected,
  PeopleFill,
  PlusCircle,
  Check2Square,
  Clipboard,
  Save, Trash, PencilSquare, XCircleFill, BagFill, CaretRight
} from 'ng-bootstrap-icons/icons';

// Select some icons (use an object, not an array)
const icons = {
  PeopleFill,
  GearWideConnected,
  FileLock,
  BoxArrowLeft,
  Gear,
  PlusCircle,
  Check2Square,
  Clipboard,
  Save,
  Trash,
  PencilSquare,
  XCircleFill,
  BagFill,
  CaretRight
};

@NgModule({
  imports: [
    BootstrapIconsModule.pick(icons)
  ],
  exports: [
    BootstrapIconsModule
  ]
})
export class IconsModule { }
