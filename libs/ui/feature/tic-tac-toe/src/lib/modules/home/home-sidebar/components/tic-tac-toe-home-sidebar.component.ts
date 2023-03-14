import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ToasterService } from '@app/ui/shared/app';
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
  private readonly toastService: ToasterService = inject(ToasterService);
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
    this.repository.notifications$.subscribe((notifications) => (this.model = { ...notifications }));
  }

  test() {
    this.toastService.showLinkToast({
      title: 'Game Request',
      message: `You have a new game request from {{playerX}}`,
      link: './tic-tac-toe/game/{{id}}',
      linkSelf: true,
    });
  }
}
