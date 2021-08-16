import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { stubCoreServiceProvider } from '../../../../../../../../core/services/core.service.stub';

import { UserManagementTableComponent } from './user-management-table.component';
import { stubUserManagementTableDatasourceProvider } from './user-management-table.datasource.stub';

describe('UserManagementTableComponent', () => {
  let component: UserManagementTableComponent;
  let fixture: ComponentFixture<UserManagementTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UserManagementTableComponent],
        imports: [
          NoopAnimationsModule,
          MatPaginatorModule,
          MatSortModule,
          MatTableModule,
          RouterTestingModule,
          MatIconModule,
        ],
        providers: [stubUserManagementTableDatasourceProvider, stubCoreServiceProvider],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
