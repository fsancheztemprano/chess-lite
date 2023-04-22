import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TicTacToeRepository } from '../../../../store/tic-tac-toe.repository';

@UntilDestroy()
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
        label: 'tic-tac-toe.home.sidebar.my-turns.label',
        translate: true,
        appearance: 'outline',
      },
    },
    {
      key: 'newGames',
      type: 'toggle',
      props: {
        label: 'tic-tac-toe.home.sidebar.new-games.label',
        translate: true,
        appearance: 'outline',
      },
    },
  ];

  ngOnInit(): void {
    this.repository.notifications$
      .pipe(untilDestroyed(this))
      .subscribe((notifications) => (this.model = { ...notifications }));
  }
}
