import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchService } from '@app/ui/shared/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  constructor(public readonly searchService: SearchService) {}
}
