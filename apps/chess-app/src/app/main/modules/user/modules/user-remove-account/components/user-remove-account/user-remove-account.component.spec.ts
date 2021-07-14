import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Resource } from '@chess-lite/hal-form-client';
import { of } from 'rxjs';
import { stubUserServiceProvider } from '../../../../services/user.service.stub';
import { UserRemoveAccountComponent } from './user-remove-account.component';

const mockRouteData = { data: of({ user: new Resource({}) }) };

describe('UserRemoveAccountComponent', () => {
  let component: UserRemoveAccountComponent;
  let fixture: ComponentFixture<UserRemoveAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatCardModule],
      declarations: [UserRemoveAccountComponent],
      providers: [stubUserServiceProvider, { provide: ActivatedRoute, useValue: mockRouteData }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRemoveAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
