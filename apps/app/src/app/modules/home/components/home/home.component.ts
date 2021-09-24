import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserChangedMessage, UserChangedMessageDestination, UsersListChangedMessageDestination } from '@app/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MessageService } from '../../../../core/services/message.service';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(private readonly messageService: MessageService) {
    messageService
      .subscribeToMessages<UserChangedMessage>(new UsersListChangedMessageDestination())
      .pipe(untilDestroyed(this))
      .subscribe((message: UserChangedMessage) => console.log(message));
    messageService
      .subscribeToMessages<UserChangedMessage>(
        new UserChangedMessageDestination('b1272ddf-2e43-4c4f-9eab-cb0d9fdb3bf6'),
      )
      .pipe(untilDestroyed(this))
      .subscribe((message: UserChangedMessage) => console.log(message));
  }
}
