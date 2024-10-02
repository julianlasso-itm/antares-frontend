import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth-google.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './login.screen.html',
  styleUrl: './login.screen.scss',
})
export class LoginScreen {
  profile: Record<string, unknown>;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  constructor() {
    this.profile = {};
    this.iconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/icons/google.svg'
      )
    );
  }

  ngOnInit(): void {
    this.profile = this.authService.getProfile();
    if (this.profile) {
      this.router.navigate(['/dashboard']);
    }
  }

  signIn(): void {
    this.authService.login();
  }
}
