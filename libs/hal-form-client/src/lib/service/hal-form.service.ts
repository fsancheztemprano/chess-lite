import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { ContentTypeEnum } from '../domain/content-type.enum';
import { Link } from '../domain/link';
import { Resource } from '../domain/resource';
import { Template } from '../domain/template';
import { ROOT_RESOURCE_URL } from '../hal-form-client.module';

@Injectable({
  providedIn: 'root',
})
export class HalFormService {
  private _rootResource: BehaviorSubject<Resource> = new BehaviorSubject<Resource>(new Resource({}));

  constructor(protected readonly httpClient: HttpClient, @Inject(ROOT_RESOURCE_URL) protected _rootUrl: string) {}

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
          this._rootResource.next(new Resource(response.body || {}));
          return this._rootResource.value;
        }),
        catchError((err) => {
          console.error('Hal Form Client Initialization Error', err);
          return EMPTY;
        }),
      );
  }

  protected setRootResource(resource: Resource) {
    this._rootResource.next(resource);
  }

  public get rootResource(): Observable<Resource> {
    return this._rootResource.asObservable();
  }

  public hasLink(link: string = 'self'): Observable<boolean> {
    return this.rootResource.pipe(map((resource) => resource.hasLink(link)));
  }

  public getLink(link: string = 'self'): Observable<Link | null> {
    return this.rootResource.pipe(map((resource) => resource.getLink(link)));
  }

  public getTemplate(template: string = 'self'): Observable<Template | null> {
    return this.rootResource.pipe(map((resource) => resource.getTemplate(template)));
  }

  public isAllowedTo(template: string = 'self'): Observable<boolean> {
    return this.rootResource.pipe(map((resource) => resource.isAllowedTo(template)));
  }

  public hasEmbedded(embedded: string = 'self'): Observable<boolean> {
    return this.rootResource.pipe(map((resource) => resource.hasEmbedded(embedded)));
  }

  public hasEmbeddedObject(embedded: string = 'self'): Observable<boolean> {
    return this.rootResource.pipe(map((resource) => resource.hasEmbeddedObject(embedded)));
  }

  public hasEmbeddedCollection(embedded: string = 'self'): Observable<boolean> {
    return this.rootResource.pipe(map((resource) => resource.hasEmbeddedCollection(embedded)));
  }

  public getEmbeddedObject(embedded: string = 'self'): Observable<Resource> {
    return this.rootResource.pipe(map((resource) => resource.getEmbeddedObject(embedded)));
  }

  public getEmbeddedCollection(embedded: string = 'self'): Observable<Resource[]> {
    return this.rootResource.pipe(map((resource) => resource.getEmbeddedCollection(embedded)));
  }

  public getEmbedded(embedded: string = 'self'): Observable<Resource | Resource[] | null> {
    return this.rootResource.pipe(map((resource) => resource.getEmbedded(embedded)));
  }
}
