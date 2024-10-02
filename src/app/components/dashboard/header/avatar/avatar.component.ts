import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, MatDividerModule, MatTooltipModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() logOut: () => void;
  private readonly dialog = inject(MatDialog);

  constructor() {
    this.logOut = () => {};
  }

  openDialogProfile() {
    this.dialog.open(ProfileModalComponent, {
      autoFocus: false,
      width: '700px',
      disableClose: true,
    });
  }
}
