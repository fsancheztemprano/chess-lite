import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  public showSearchInput = false;

  constructor(public readonly searchService: SearchService) {}
}
