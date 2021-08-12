import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { first } from 'rxjs/operators';
import { HeaderService } from '../../../core/services/header.service';
import { setTemplateValidatorsPipe } from '../../../shared/utils/forms/rxjs/set-template-validators.rxjs.pipe';
import { matchingControlsValidators } from '../../../shared/utils/forms/validators/matching-controls.validator';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class SignupComponent implements OnDestroy {
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

  constructor(
    public readonly signupService: SignupService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly headerService: HeaderService,
  ) {
    this.headerService.setHeader({ title: 'Sign Up' });
    this.signupService.getSignupTemplate().pipe(first(), setTemplateValidatorsPipe(this.signupForm)).subscribe();
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  public onSubmit(): void {
    this.signupService.signup(this.signupForm.value)?.subscribe({
      next: (user) => this.setStatus(!!user),
      error: () => this.setStatus(false),
    });
  }

  private setStatus(status: boolean) {
    this.signupSuccess = status;
    this.signupError = !status;
    this.cdr.markForCheck();
  }

  public onSignupSuccess() {
    if (this.signupSuccess) {
      this.router.navigate(['']);
    }
  }
}
