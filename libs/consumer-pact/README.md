# Consumer Pact

## Running pact tests

Run `nx test consumer-pact` to execute the unit tests.

## Test Example

```typescript
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { firstValueFrom } from 'rxjs';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';

const provider: Pact = pactForResource('test');

describe('Test Resource Pacts', () => {
  let httpClient: HttpClient;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });
    httpClient = TestBed.inject(HttpClient);
  });

  describe('Endpoint Interactions', () => {
    it('sync test example', (done) => {
      const interaction: InteractionObject = {
        state: 'stateless',
        uponReceiving: 'sync request',
        withRequest: {
          method: HTTPMethods.GET,
          path: '/api/sync',
        },
        willRespondWith: {
          status: 200,
          body: {
            msg: 'Hello',
          },
        },
      };
      provider.addInteraction(interaction).then(() => {
        httpClient.get('/api/sync').subscribe((response: { msg?: string }) => {
          expect(response).toBeTruthy();
          expect(response.msg).toBe((<JsonObject>interaction.willRespondWith.body).msg);
          done();
        });
      });
    });

    it('async test example', async () => {
      const interaction: InteractionObject = {
        state: 'async stateless',
        uponReceiving: 'request',
        withRequest: {
          method: HTTPMethods.GET,
          path: '/api/async',
        },
        willRespondWith: {
          status: 200,
          body: {
            msg: 'Hello',
          },
        },
      };
      await provider.addInteraction(interaction);

      const response: { msg?: string } = await firstValueFrom(httpClient.get('/api/async'));

      expect(response).toBeTruthy();
      expect(response.msg).toBe((<JsonObject>interaction.willRespondWith.body).msg);
    });
  });
});
```
