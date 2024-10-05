import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth-google.service';
import { AuthStorageService } from '../../services/auth-storage.service';
import { ButtonAddService } from '../../services/button-add.service';
import { MenuService } from '../../services/menu.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { ModalStateService } from '../../services/modal-state.service';
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
  private readonly modalStateService = inject(ModalStateService);
  private readonly buttonAddService = inject(ButtonAddService);
  public profile: Record<string, unknown>;
  public title: Signal<string>;
  private storageService: Subscription;
  private titleService: Subscription;
  private buttonAddVisibleService: Subscription;
  private buttonAddActionService: Subscription;
  private modalStateVisibleService: Subscription;
  readonly buttonAddVisible: WritableSignal<boolean>;
  readonly buttonAddAction: WritableSignal<Function>;
  blurEffect: WritableSignal<boolean>;

  constructor() {
    this.profile = {};
    this.title = signal('');
    this.blurEffect = signal(false);
    this.storageService = new Subscription();
    this.titleService = new Subscription();
    this.buttonAddVisible = signal(false);
    this.buttonAddAction = signal(() => {});
    this.buttonAddVisibleService = new Subscription();
    this.buttonAddActionService = new Subscription();
    this.modalStateVisibleService = new Subscription();
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

    this.buttonAddVisibleService = this.buttonAddService.visible$.subscribe({
      next: (visible: boolean) => {
        this.buttonAddVisible.set(visible);
      },
    });

    this.buttonAddActionService = this.buttonAddService.action$.subscribe({
      next: (action: Function) => {
        this.buttonAddAction.set(action);
      },
    });

    this.modalStateVisibleService = this.modalStateService.state$.subscribe({
      next: (visible: boolean) => {
        this.blurEffect.set(visible);
      },
    });

    this.blurEffect.set(this.modalStateService.state);
  }

  ngOnDestroy(): void {
    this.storageService.unsubscribe();
    this.titleService.unsubscribe();
    this.buttonAddVisibleService.unsubscribe();
    this.buttonAddActionService.unsubscribe();
    this.modalStateVisibleService.unsubscribe();
  }

  showData(): void {
    this.profile = this.authService.getProfile();
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
