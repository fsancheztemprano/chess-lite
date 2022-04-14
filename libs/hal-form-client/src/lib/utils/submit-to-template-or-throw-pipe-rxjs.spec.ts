import { of } from 'rxjs';
import { Resource } from '../domain/resource';
import { submitToTemplateOrThrowPipe } from './submit-to-template-or-throw-pipe-rxjs';

describe('SubmitToTemplateOrThrow', () => {
  it('should throw if doesnt have the template', (done) => {
    const resource = Resource.of();
    const spyInstance = jest.spyOn(resource, 'getTemplateOrThrow');
    of(resource)
      .pipe(submitToTemplateOrThrowPipe())
      .subscribe({
        error: (error) => {
          expect(error.message).toBe('Can not find template: default');
          expect(spyInstance).toHaveBeenCalled();
          done();
        },
      });
  });
});
