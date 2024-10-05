import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-google.service';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(Router);
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  profile: Record<string, unknown>;

  constructor() {
    this.iconRegistry.addSvgIcon(
      'google',
      this.sanitizer.bypassSecurityTrustResourceUrl('icons/google.svg')
    );
    this.profile = {};
  }

  ngOnInit(): void {
    this.profile = this.authService.getProfile();
    if (this.profile) {
      this.route.navigate(['/dashboard']);
    }
  }

  signIn(): void {
    this.authService.login();
  }
}
