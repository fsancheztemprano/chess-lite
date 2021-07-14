import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { first } from 'rxjs/operators';
import { matchingControlsValidators, setTemplateValidatorsPipe } from '../../../core/utils/form.utils';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'chess-lite-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class SignupComponent implements OnInit {
  public signupForm = new FormGroup(
    {
      username: new FormControl(''),
      password: new FormControl(''),
      password2: new FormControl(''),
      email: new FormControl(''),
      firstname: new FormControl(''),
      lastname: new FormControl(''),
    },
    [matchingControlsValidators('password', 'password2')],
  );

  public signupSuccess = false;
  public signupError = false;
  public signupErrorAnimation = false;

  constructor(
    public readonly signupService: SignupService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.signupService.getSignupTemplate().pipe(first(), setTemplateValidatorsPipe(this.signupForm)).subscribe();
  }

  public onSubmit(): void {
    this.signupService.signup(this.signupForm.value)?.subscribe({
      next: (user) => {
        if (user) {
          this.signupSuccess = true;
        } else {
          this.setError(true);
        }
      },
      error: () => this.setError(true),
    });
  }

  public setError(hasError: boolean) {
    this.signupError = hasError;
    this.signupErrorAnimation = hasError;
    this.cdr.markForCheck();
  }

  public onSignupSuccess() {
    if (this.signupSuccess) {
      this.router.navigate(['']);
    }
  }
}
