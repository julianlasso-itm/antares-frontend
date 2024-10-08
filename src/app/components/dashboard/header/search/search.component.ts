import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { SearchBarService } from '../../../../services/search-bar.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  private readonly _searchBarService = inject(SearchBarService);
  private _searchSubscription: Subscription;
  readonly placeholder: WritableSignal<string>;

  constructor() {
    this.placeholder = signal('');
    this._searchSubscription = new Subscription();
  }

  ngOnInit(): void {
    this._searchSubscription = this._searchBarService.placeholder$.subscribe({
      next: (placeholder) => this.placeholder.set(placeholder),
    });
  }

  ngOnDestroy(): void {
    this._searchSubscription.unsubscribe();
  }

  onSearch(search: string): void {
    this._searchBarService.search = search;
  }
}
