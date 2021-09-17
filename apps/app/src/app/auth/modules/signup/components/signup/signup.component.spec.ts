import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { stubHeaderServiceProvider } from '../../../../../core/services/header.service.stub';
import { StubFormErrorComponent } from '../../../../../shared/components/form-error/form-error.component.stub';
import { stubSignupServiceProvider } from '../../../../services/signup.service.stub';
import { SignupComponent } from './signup.component';

const MaterialModules = [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule];

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ...MaterialModules, NoopAnimationsModule, ReactiveFormsModule],
      declarations: [SignupComponent, StubFormErrorComponent],
      providers: [stubSignupServiceProvider, stubHeaderServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
