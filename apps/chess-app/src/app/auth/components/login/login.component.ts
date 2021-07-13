import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { first } from 'rxjs/operators';
import { setTemplateValidatorsPipe } from '../../../core/utils/form.utils';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'chess-lite-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class LoginComponent implements OnInit {
  public loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  public loginSuccess = false;
  public loginError = false;
  public loginErrorAnimation = false;

  constructor(
    public readonly loginService: LoginService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginService.getLoginTemplate().pipe(first(), setTemplateValidatorsPipe(this.loginForm)).subscribe();
  }

  public onSubmit(): void {
    this.loginService.login(this.loginForm.value)?.subscribe({
      next: (user) => {
        if (user) {
          this.loginSuccess = true;
        } else {
          this.setError(true);
        }
      },
      error: () => this.setError(true),
    });
  }

  public setError(hasError: boolean) {
    this.loginError = hasError;
    this.loginErrorAnimation = hasError;
    this.cdr.markForCheck();
  }

  public onLoginSuccess() {
    if (this.loginSuccess) {
      this.router.navigate(['']);
    }
  }
}
