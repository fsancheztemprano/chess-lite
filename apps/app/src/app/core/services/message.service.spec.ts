import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';
import { stubRxStompServiceProvider } from './message.service.stub';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubRxStompServiceProvider],
    });
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
