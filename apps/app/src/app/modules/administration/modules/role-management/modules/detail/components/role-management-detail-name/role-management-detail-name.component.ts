import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Role, RoleManagementRelations } from '@app/domain';
import { submitToTemplateOrThrowPipe } from '@hal-form-client';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToasterService } from '../../../../../../../../core/services/toaster.service';
import { setTemplateValidators } from '../../../../../../../../shared/utils/forms/validators/set-template.validators';

@UntilDestroy()
@Component({
  selector: 'app-role-management-detail-name',
  templateUrl: './role-management-detail-name.component.html',
  styleUrls: ['./role-management-detail-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleManagementDetailNameComponent implements OnInit {
  @Input() role!: Observable<Role>;

  form = new FormGroup({
    name: new FormControl(''),
  });

  constructor(private readonly toasterService: ToasterService) {}

  ngOnInit(): void {
    this.role?.pipe(untilDestroyed(this)).subscribe((user) => {
      setTemplateValidators(this.form, user.getTemplate(RoleManagementRelations.ROLE_UPDATE_REL));
      this.form.patchValue(user);
    });
  }

  onSubmit() {
    this.role
      .pipe(first(), submitToTemplateOrThrowPipe(RoleManagementRelations.ROLE_UPDATE_REL, this.form.value))
      .subscribe({
        next: () => this.toasterService.showToast({ title: 'Role updated successfully' }),
        error: () => this.toasterService.showErrorToast({ title: 'An error has occurred' }),
      });
  }
}
