import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { ContentTypeEnum } from '../domain/content-type.enum';
import { Link } from '../domain/link';
import { IResource, Resource } from '../domain/resource';
import { AffordanceOptions, Template } from '../domain/template';
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
        tap({
          next: (response) => {
            if (!response.headers.get('Content-type')?.includes(ContentTypeEnum.APPLICATION_JSON_HAL_FORMS)) {
              console.warn(`Provided url ${this._rootUrl} is not Hal Form Compliant`);
              if (!response.headers.get('Content-type')?.includes(ContentTypeEnum.APPLICATION_JSON_HAL)) {
                console.warn(`Provided url ${this._rootUrl} is not Hal Compliant`);
              }
            }
          },
          error: (error) => {
            this.setRootResource(new Resource({}));
            console.error('Hal Form Client Initialization Error', error);
          },
        }),
        map((response) => {
          this.setRootResource(response.body || {});
          return this._rootResource.value;
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

  public hasLink(link?: string): Observable<boolean> {
    return this.getResource().pipe(map((resource) => resource.hasLink(link)));
  }

  public getLink(link?: string): Observable<Link | null> {
    return this.getResource().pipe(map((resource) => resource.getLink(link)));
  }

  public getLinkOrThrow(link?: string, errorMessage?: string | Error): Observable<Link> {
    return this.getResource().pipe(map((resource) => resource.getLinkOrThrow(link, errorMessage)));
  }

  public hasEmbedded(embedded: string): Observable<boolean> {
    return this.getResource().pipe(map((resource) => resource.hasEmbedded(embedded)));
  }

  public hasEmbeddedObject(embedded: string): Observable<boolean> {
    return this.getResource().pipe(map((resource) => resource.hasEmbeddedObject(embedded)));
  }

  public hasEmbeddedCollection(embedded: string): Observable<boolean> {
    return this.getResource().pipe(map((resource) => resource.hasEmbeddedCollection(embedded)));
  }

  public getEmbedded<T = Resource>(embedded: string): Observable<T | T[] | null> {
    return this.getResource().pipe(map((resource) => resource.getEmbedded<T>(embedded)));
  }

  public getEmbeddedObject<T = Resource>(embedded: string): Observable<T> {
    return this.getResource().pipe(map((resource) => resource.getEmbeddedObject<T>(embedded)));
  }

  public getEmbeddedCollection<T = Resource>(embedded: string): Observable<T[]> {
    return this.getResource().pipe(map((resource) => resource.getEmbeddedCollection<T>(embedded)));
  }

  public getTemplate(template?: string): Observable<Template | null> {
    return this.getResource().pipe(map((resource) => resource.getTemplate(template)));
  }

  public getTemplateOrThrow(template?: string): Observable<Template> {
    return this.getResource().pipe(map((resource) => resource.getTemplateOrThrow(template)));
  }

  public submitToTemplateOrThrow(template?: string, options?: AffordanceOptions): Observable<Resource> {
    return this.getResource().pipe(submitToTemplateOrThrowPipe(template, options));
  }

  public isAllowedTo(template?: string): Observable<boolean> {
    return this.getResource().pipe(map((resource) => resource.isAllowedTo(template)));
  }
}
