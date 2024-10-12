import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import {
  customClassTooltip,
  tooltipsProps,
} from '../../../template/tooltips.props';
import { NotificationsModalComponent } from './notifications-modal/notifications-modal.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatDialogModule,
    NgxTippyModule,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  private readonly dialog = inject(MatDialog);
  customClassTooltip = customClassTooltip;
  tooltipsProps = tooltipsProps;

  constructor() {}

  openDialog() {
    this.dialog.open(NotificationsModalComponent, {
      position: { top: '64px', right: '64px' },
      autoFocus: false,
      hasBackdrop: true,
      width: '400px',
    });
  }
}
