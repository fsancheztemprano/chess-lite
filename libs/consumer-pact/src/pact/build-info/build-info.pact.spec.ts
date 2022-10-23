import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { defaultTemplate } from '@app/ui/testing';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { BuildInfoService } from '../../../../ui/feature/home/src/lib/modules/build-info/services/build-info.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { GetBuildInfoPact } from './build.info.pact';

const provider: Pact = pactForResource('buildInfo');

describe('Build Info Pacts', () => {
  let service: BuildInfoService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });

    service = TestBed.inject(BuildInfoService);
    TestBed.inject(HalFormService).setResource({
      _links: {
        self: {
          href: '/api',
        },
        'build-info': {
          href: '/api/build-info',
        },
      },
      _templates: { ...defaultTemplate },
    });
  });

  describe('Get Build Info', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetBuildInfoPact.successful;
      provider.addInteraction(interaction).then(() => {
        service.getBuildInfo().subscribe((response) => {
          expect(response).toMatchObject(interaction.willRespondWith.body);
          done();
        });
      });
    });
  });
});
