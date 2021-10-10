import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { InformationDialogService } from './information-dialog.service';

describe('InformationDialogService', () => {
  let service: InformationDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
    });
    service = TestBed.inject(InformationDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
