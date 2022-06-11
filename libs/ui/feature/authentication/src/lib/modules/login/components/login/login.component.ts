import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { setTemplateValidatorsPipe } from '@app/ui/shared/common';
import { LoginInput } from '@app/ui/shared/domain';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class LoginComponent {
  public loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  public loginSuccess = false;
  public loginError = false;

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.authService.getLoginTemplate().pipe(first(), setTemplateValidatorsPipe(this.loginForm)).subscribe();
  }

  public onSubmit(): void {
    this.authService.login(this.loginForm.value as LoginInput).subscribe({
      next: (session) => this.setStatus(!!session),
      error: () => this.setStatus(false),
    });
  }

  private setStatus(status: boolean) {
    this.loginSuccess = status;
    this.loginError = !status;
    this.cdr.markForCheck();
  }

  public onLoginSuccess(): void {
    if (this.loginSuccess) {
      this.router.navigate(['']);
    }
  }
}
