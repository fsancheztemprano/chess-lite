import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { first } from 'rxjs/operators';
import { HeaderService } from '../../../core/services/header.service';
import { setTemplateValidatorsPipe } from '../../../shared/utils/forms/rxjs/set-template-validators.rxjs.pipe';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class LoginComponent implements OnDestroy {
  public loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  public loginSuccess = false;
  public loginError = false;

  constructor(
    public readonly loginService: LoginService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly headerService: HeaderService,
  ) {
    this.headerService.setHeader({ title: 'Login' });
    this.loginService.getLoginTemplate().pipe(first(), setTemplateValidatorsPipe(this.loginForm)).subscribe();
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  public onSubmit(): void {
    this.loginService.login(this.loginForm.value)?.subscribe({
      next: (user) => this.setStatus(!!user),
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
