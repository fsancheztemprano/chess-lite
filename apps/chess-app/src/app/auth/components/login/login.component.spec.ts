import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { stubStubHalFormServiceProvider } from '@chess-lite/hal-form-client/testing';
import { stubStubAuthServiceProvider } from '../../services/auth.service.stub';
import { LoginComponent } from './login.component';

const MaterialModules = [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule];

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, ...MaterialModules, NoopAnimationsModule],
      declarations: [LoginComponent],
      providers: [stubStubHalFormServiceProvider, stubStubAuthServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
