import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { _getPropertyValidators } from '../../../core/utils/form.utils';
import { AuthService } from '../../services/auth.service';

@UntilDestroy()
@Component({
  selector: 'chess-lite-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  public loginError = false;

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
    this._subscribeToLoginTemplate();
  }

  private _subscribeToLoginTemplate() {
    this.authService
      .getLoginTemplate()
      .pipe(untilDestroyed(this))
      .subscribe((template) => {
        this.loginForm.controls.username.setValidators(_getPropertyValidators(template, 'username'));
        this.loginForm.controls.password.setValidators(_getPropertyValidators(template, 'password'));
        this.loginForm.updateValueAndValidity();
      });
  }

  public submitLogin(): void {
    this.authService.login(this.loginForm.value)?.subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(['']);
        } else {
          this.setError(true);
        }
      },
      error: () => this.setError(true),
    });
  }

  setError(hasError: boolean) {
    this.loginError = hasError;
    this.cdr.markForCheck();
  }
}
