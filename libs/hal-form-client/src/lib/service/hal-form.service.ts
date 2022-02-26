import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { ContentTypeEnum } from '../domain/content-type.enum';
import { Link } from '../domain/link';
import { IResource, Resource } from '../domain/resource';
import { Template } from '../domain/template';
import { ROOT_RESOURCE_URL } from '../hal-form-client.module';
import { submitToTemplateOrThrowPipe } from '../utils/rxjs.utils';

@Injectable({
  providedIn: 'root',
})
export class HalFormService {
  private _rootResource: BehaviorSubject<Resource> = new BehaviorSubject<Resource>(new Resource({}));

  constructor(protected readonly httpClient: HttpClient, @Inject(ROOT_RESOURCE_URL) protected _rootUrl = '') {}

  initialize(): Observable<Resource> {
    return this.httpClient
      .get<Resource>(this._rootUrl, {
        headers: { Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
        observe: 'response',
      })
      .pipe(
        first(),
        tap((response) => {
          if (!response.headers.get('Content-type')?.includes(ContentTypeEnum.APPLICATION_JSON_HAL_FORMS)) {
            console.warn(`Provided url ${this._rootUrl} is not Hal Form Compliant`);
            if (!response.headers.get('Content-type')?.includes(ContentTypeEnum.APPLICATION_JSON_HAL)) {
              console.warn(`Provided url ${this._rootUrl} is not Hal Compliant`);
            }
          }
        }),
        map((response) => {
          this.setRootResource(response.body || {});
          return this._rootResource.value;
        }),
        catchError((err) => {
          console.error('Hal Form Client Initialization Error', err);
          return EMPTY;
        }),
      );
  }

  public setRootResource(resource: IResource) {
    this._rootResource.next(new Resource(resource));
  }

  public getResource(): Observable<Resource> {
    return this._rootResource.asObservable();
  }

  public getResourceOnce(): Observable<Resource> {
    return this.getResource().pipe(first());
  }

  public hasLink(link: string = 'self'): Observable<boolean> {
    return this.getResource().pipe(map((resource) => resource.hasLink(link)));
  }

  public getLink(link: string = 'self'): Observable<Link | null> {
    return this.getResource().pipe(map((resource) => resource.getLink(link)));
  }

  public getLinkOrThrow(link: string = 'self', errorMessage?: string | Error): Observable<Link> {
    return this.getResource().pipe(map((resource) => resource.getLinkOrThrow(link, errorMessage)));
  }

  public getTemplate(template: string = 'self'): Observable<Template | null> {
    return this.getResource().pipe(map((resource) => resource.getTemplate(template)));
  }

  public getTemplateOrThrow(template: string = 'self'): Observable<Template> {
    return this.getResource().pipe(map((resource) => resource.getTemplateOrThrow(template)));
  }

  public submitToTemplateOrThrow(
    templateName: string,
    payload?: any,
    params?: any,
    observe: 'body' | 'events' | 'response' = 'body',
  ): Observable<Resource> {
    return this.getResource().pipe(submitToTemplateOrThrowPipe(templateName, payload, params, observe));
  }

  public isAllowedTo(template: string = 'self'): Observable<boolean> {
    return this.getResource().pipe(map((resource) => resource.isAllowedTo(template)));
  }

  public hasEmbedded(embedded: string = 'self'): Observable<boolean> {
    return this.getResource().pipe(map((resource) => resource.hasEmbedded(embedded)));
  }

  public hasEmbeddedObject(embedded: string = 'self'): Observable<boolean> {
    return this.getResource().pipe(map((resource) => resource.hasEmbeddedObject(embedded)));
  }

  public hasEmbeddedCollection(embedded: string = 'self'): Observable<boolean> {
    return this.getResource().pipe(map((resource) => resource.hasEmbeddedCollection(embedded)));
  }

  public getEmbedded<T = Resource>(embedded: string = 'self'): Observable<T | T[] | null> {
    return this.getResource().pipe(map((resource) => resource.getEmbedded<T>(embedded)));
  }

  public getEmbeddedObject<T = Resource>(embedded: string = 'self'): Observable<T> {
    return this.getResource().pipe(map((resource) => resource.getEmbeddedObject<T>(embedded)));
  }

  public getEmbeddedCollection<T = Resource>(embedded: string = 'self'): Observable<T[]> {
    return this.getResource().pipe(map((resource) => resource.getEmbeddedCollection<T>(embedded)));
  }
}
