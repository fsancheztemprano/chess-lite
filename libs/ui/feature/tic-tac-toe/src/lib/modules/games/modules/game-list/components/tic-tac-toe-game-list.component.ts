import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Breakpoint, BreakpointFilter } from '@app/ui/shared/core';
import { TicTacToeService } from '@app/ui/shared/feature/tic-tac-toe';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TicTacToeGameListFilterService } from '../../../services/tic-tac-toe-game-list-filter.service';
import { TicTacToeGameListDatasource } from './tic-tac-toe-game-list.datasource';

@UntilDestroy()
@Component({
  selector: 'app-tic-tac-toe-game-list',
  templateUrl: './tic-tac-toe-game-list.component.html',
  styleUrls: ['./tic-tac-toe-game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicTacToeGameListComponent implements OnInit {
  private readonly service: TicTacToeService = inject(TicTacToeService);
  private readonly filterService: TicTacToeGameListFilterService = inject(TicTacToeGameListFilterService);
  public readonly datasource: TicTacToeGameListDatasource = new TicTacToeGameListDatasource(this.service);
  public readonly reactiveColumns: BreakpointFilter[] = [
    { value: 'status' },
    { value: 'isPrivate', breakpoint: Breakpoint.S },
    { value: 'playerX' },
    { value: 'playerO' },
    { value: 'lastActivityAt', breakpoint: Breakpoint.S },
    { value: 'edit' },
  ];

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    paginator.page.pipe(untilDestroyed(this)).subscribe((page) => (this.datasource.page = page));
  }

  @ViewChild(MatSort) set sort(matSort: MatSort) {
    matSort.sortChange.pipe(untilDestroyed(this)).subscribe((sort) => (this.datasource.sort = sort));
  }

  ngOnInit(): void {
    this.filterService.filter$.pipe(untilDestroyed(this)).subscribe((filters) => (this.datasource.filters = filters));
  }
}
