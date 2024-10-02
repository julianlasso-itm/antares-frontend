import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'angular',
      sanitizer.bypassSecurityTrustResourceUrl('icons/angular.svg')
    );
    iconRegistry.addSvgIcon(
      'nodejs',
      sanitizer.bypassSecurityTrustResourceUrl('icons/node-js.svg')
    );
    iconRegistry.addSvgIcon(
      'mongodb',
      sanitizer.bypassSecurityTrustResourceUrl('icons/mongodb.svg')
    );
  }
}
