import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { StubCoreCardViewComponent, StubFormErrorComponent } from '@app/ui/shared/common';
import { getTranslocoModule } from '@app/ui/testing';
import { stubActivationTokenServiceProvider } from '../../../../services/activation-token.service.stub';
import { TokenRequestComponent } from './token-request.component';

describe('TokenRequestComponent', () => {
  let component: TokenRequestComponent;
  let fixture: ComponentFixture<TokenRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        getTranslocoModule(),
      ],
      declarations: [TokenRequestComponent, StubFormErrorComponent, StubCoreCardViewComponent],
      providers: [stubActivationTokenServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
