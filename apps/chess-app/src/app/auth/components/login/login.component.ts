import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { setFormValidatorsPipe } from '../../../core/utils/form.utils';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'chess-lite-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;

  public loginError = false;

  constructor(
    public readonly loginService: LoginService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loginService.getLoginTemplate().pipe(first(), setFormValidatorsPipe(this.loginForm)).subscribe();
  }

  public submitLogin(): void {
    this.loginService.login(this.loginForm.value)?.subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(['']);
        } else {
          this._setError(true);
        }
      },
      error: () => this._setError(true),
    });
  }

  private _setError(hasError: boolean) {
    this.loginError = hasError;
    this.cdr.markForCheck();
  }
}
