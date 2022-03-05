import { withUuid } from './pact.utils';

describe('Pact Utils Tests', () => {
  it('should replace uuid with regex and uuid', () => {
    const actual = withUuid('/api/{uuid}');
    expect(actual.data.generate).toBe('/api/ce118b6e-d8e1-11e7-9296-cec278b6b50a');
    expect(actual.data.matcher.s).toBe('^\\/api\\/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$');
  });
});
