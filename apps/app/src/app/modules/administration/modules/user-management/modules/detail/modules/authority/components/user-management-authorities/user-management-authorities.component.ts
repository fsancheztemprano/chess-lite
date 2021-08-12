import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Authority, User, UserManagementRelations } from '@app/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { noop, Observable, startWith } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { ToasterService } from '../../../../../../../../../../shared/services/toaster.service';

@UntilDestroy()
@Component({
  selector: 'app-user-management-authorities',
  templateUrl: './user-management-authorities.component.html',
  styleUrls: ['./user-management-authorities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementAuthoritiesComponent implements OnInit {
  @Input() user$: Observable<User> | undefined;

  @Output() userChange = new EventEmitter<User>();

  public formArray = new FormArray([]);
  public form = new FormGroup({ authorities: this.formArray });

  constructor(private readonly route: ActivatedRoute, private readonly toasterService: ToasterService) {
    this.route.data
      .pipe(
        startWith({ authorities: [] }),
        map((data) => data.authorities),
      )
      .subscribe((authorities: Authority[]) => {
        this.formArray.clear();
        authorities.forEach((authority) => {
          this.formArray.push(
            new FormGroup({
              id: new FormControl(authority.id),
              name: new FormControl(authority.name),
              active: new FormControl(false),
            }),
          );
        });
      });
  }

  ngOnInit(): void {
    this.user$?.pipe(untilDestroyed(this)).subscribe((user) => {
      this.formArray.controls.forEach((control) => {
        const hasAuthority = user?.authorities?.some((authority) => authority === control.value.name);
        if (control.value.active != hasAuthority) {
          control.patchValue({ active: hasAuthority });
        }
      });
    });
  }

  onSubmit() {
    this.user$
      ?.pipe(
        first(),
        switchMap((user) =>
          user.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_REL, {
            authorityIds: this.formArray.value
              .filter((authority: { active: boolean }) => authority.active)
              .map((authority: { id: string }) => authority.id),
          }),
        ),
      )
      .subscribe({
        next: (user) => {
          this.userChange.emit(user);
          this.toasterService.showToast({ message: 'Authorities updated successfully' });
        },
        error: () => noop,
      });
  }
}
