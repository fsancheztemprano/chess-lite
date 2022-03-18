import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { TextInputDialogService } from './text-input-dialog.service';

describe('TextInputDialogService', () => {
  let service: TextInputDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [TextInputDialogService],
    });
    service = TestBed.inject(TextInputDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
