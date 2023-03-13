import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TicTacToeRepository } from '../../../../store/tic-tac-toe.repository';

@Component({
  selector: 'app-tic-tac-toe-home-sidebar',
  templateUrl: './tic-tac-toe-home-sidebar.component.html',
  styleUrls: ['./tic-tac-toe-home-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TicTacToeHomeSidebarComponent implements OnInit {
  protected readonly repository = inject(TicTacToeRepository);
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'myTurns',
      type: 'toggle',
      props: {
        label: 'My Turns',
        appearance: 'outline',
      },
    },
    {
      key: 'newGames',
      type: 'toggle',
      props: {
        label: 'New Games',
        appearance: 'outline',
      },
    },
  ];

  ngOnInit(): void {
    this.repository.notifications$.subscribe((notifications) => (this.model = { ...notifications }));
  }
}
