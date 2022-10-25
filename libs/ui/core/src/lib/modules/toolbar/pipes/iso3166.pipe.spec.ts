import { Iso3166Pipe } from './iso3166.pipe';

describe('Iso3166Pipe', () => {
  let pipe: Iso3166Pipe;

  beforeEach(() => (pipe = new Iso3166Pipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "gb" for "en"', () => {
    expect(pipe.transform('en')).toEqual('gb');
  });

  it('should return "es" for "es"', () => {
    expect(pipe.transform('es')).toEqual('es');
  });

  it.each(['de', 'fr', 'it', 'pl', 'ar', 'jp', 'cn', '', null, undefined])(
    'should return "en" as fallback (%p)',
    (unsupported) => {
      expect(pipe.transform(unsupported as never)).toEqual('en');
    },
  );
});
