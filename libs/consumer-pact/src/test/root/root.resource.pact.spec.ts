import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { GetRootResourcePacts } from './root.resource.pact';

const provider: Pact = pactForResource('root');

describe('Root Resource Pacts', () => {
  let service: HalFormService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule.forRoot('/api')],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });
    service = TestBed.inject(HalFormService);
  });

  describe('Root Resource', () => {
    it('as unauthorized', (done) => {
      provider.addInteraction(GetRootResourcePacts.getRootResource).then(() => {
        service.initialize().subscribe((resource) => {
          expect(resource).toBeTruthy();
          expect(resource).toMatchObject(GetRootResourcePacts.getRootResource.willRespondWith.body);
          done();
        });
      });
    });
  });
});
