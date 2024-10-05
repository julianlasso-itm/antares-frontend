import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth-google.service';
import { AuthStorageService } from '../../services/auth-storage.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { MenuService } from '../../services/menu.service';
import { HeaderComponent } from './header/header.component';
import { MenuIconComponent } from './menu-icon/menu-icon.component';
import { MenuComponent } from './menu/menu.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatDividerModule,
    MenuIconComponent,
    MenuComponent,
    HeaderComponent,
    MatButtonModule,
    MatIconModule,
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly authStorageService = inject(AuthStorageService);
  private readonly menuService = inject(MenuService);
  private readonly router = inject(Router);
  public profile: Record<string, unknown>;
  public title: Signal<string>;
  private storageService: Subscription;
  private titleService: Subscription;

  constructor() {
    this.profile = {};
    this.title = signal('');
    this.storageService = new Subscription();
    this.titleService = new Subscription();
  }

  ngOnInit(): void {
    this.titleService = this.menuService.title$.subscribe((title) => {
      this.title = signal(title);
    });
    this.storageService = this.authStorageService
      .getItemObservable()
      .subscribe({
        next: (data: Map<string, string>) => {
          if (data.has('id_token_claims_obj')) {
            this.showData();
          }
        },
      });
    this.showData();
  }

  ngOnDestroy(): void {
    this.storageService.unsubscribe();
    this.titleService.unsubscribe();
  }

  showData(): void {
    this.profile = this.authService.getProfile();
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  token(): void {
    console.log(this.authService.getToken());
  }
}
