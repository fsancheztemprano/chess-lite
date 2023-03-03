import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { setTemplateValidatorsPipe } from '@app/ui/shared/common';
import { LoginInput } from '@app/ui/shared/domain';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public loginForm = new FormGroup({
    username: new FormControl('admin'),
    password: new FormControl('123456'),
  });

  constructor(public readonly authService: AuthService, private readonly router: Router) {
    this.authService.getLoginTemplate().pipe(first(), setTemplateValidatorsPipe(this.loginForm)).subscribe();
  }

  public onSubmit(): void {
    this.authService.login(this.loginForm.value as LoginInput).subscribe({
      next: () => this.router.navigate(['']),
    });
  }
}
