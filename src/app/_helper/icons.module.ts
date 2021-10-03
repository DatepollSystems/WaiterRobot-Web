import {NgModule} from '@angular/core';

import {BootstrapIconsModule} from 'ng-bootstrap-icons';
import {
  BoxArrowLeft,
  FileLock,
  Gear,
  GearWideConnected,
  PeopleFill,
  PlusCircle,
  Check2Square,
  Clipboard,
  Save,
  Trash,
  PencilSquare,
  XCircleFill,
  BagFill,
  CaretRight,
  PersonBadge,
  People,
  CalendarEventFill,
  Building,
  UpcScan,
  ColumnsGap,
  Diagram3,
} from 'ng-bootstrap-icons/icons';

// Select some icons (use an object, not an array)
const icons = {
  People,
  PeopleFill,
  CalendarEventFill,
  Building,
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
  CaretRight,
  PersonBadge,
  UpcScan,
  ColumnsGap,
  Diagram3,
};

@NgModule({
  imports: [BootstrapIconsModule.pick(icons)],
  exports: [BootstrapIconsModule],
})
export class IconsModule {}
