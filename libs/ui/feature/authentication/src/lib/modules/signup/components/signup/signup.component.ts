import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '@app/ui/shared/app';
import { setTemplateValidatorsPipe } from '@app/ui/shared/common';
import { SignupInput } from '@app/ui/shared/domain';
import { translate } from '@ngneat/transloco';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  public readonly TRANSLOCO_SCOPE = 'authentication.signup';
  public readonly signupForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
  });

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly toasterService: ToasterService,
  ) {
    this.authService.getSignupTemplate().pipe(first(), setTemplateValidatorsPipe(this.signupForm)).subscribe();
  }

  public onSubmit(): void {
    this.authService.signup(this.signupForm.value as SignupInput)?.subscribe({
      next: () => {
        this.toasterService.showToast({
          title: translate(`${this.TRANSLOCO_SCOPE}.toast.success.title`),
          message: translate(`${this.TRANSLOCO_SCOPE}.toast.success.message`),
        });
        this.router.navigate(['/auth', 'login']);
      },
    });
  }
}
