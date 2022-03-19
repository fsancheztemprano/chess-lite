import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CardViewHeaderService, setTemplateValidatorsPipe, ToasterService } from '@app/ui/shared';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class SignupComponent implements OnDestroy {
  public signupForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
  });

  public signupSuccess = false;
  public signupError = false;

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly headerService: CardViewHeaderService,
    private readonly toasterService: ToasterService,
  ) {
    this.headerService.setHeader({ title: 'Sign Up' });
    this.authService.getSignupTemplate().pipe(first(), setTemplateValidatorsPipe(this.signupForm)).subscribe();
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  public onSubmit(): void {
    this.authService.signup(this.signupForm.value)?.subscribe({
      next: () => this.setStatus(true),
      error: () => this.setStatus(false),
    });
  }

  private setStatus(status: boolean) {
    if (status) {
      this.toasterService.showToast({
        title: 'Activation Token Sent',
        message: 'Please check your email and follow the link to activate your account so you can login.',
      });
    } else {
      this.toasterService.showToast({
        title: 'Please check your info or try again later',
      });
    }
    this.signupSuccess = status;
    this.signupError = !status;
    this.cdr.markForCheck();
  }

  public onSignupSuccess() {
    if (this.signupSuccess) {
      this.router.navigate(['/auth', 'login']);
    }
  }
}
