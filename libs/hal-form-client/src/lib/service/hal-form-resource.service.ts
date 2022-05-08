import { Injectable } from '@angular/core';
import { IResource, Resource } from '../domain/resource';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Link } from '../domain/link';
import { Template } from '../domain/template';

@Injectable({ providedIn: 'root' })
export class HalFormResourceService {
  protected readonly _rootResource: BehaviorSubject<Resource> = new BehaviorSubject<Resource>(new Resource({}));

  public setResource(iResource?: IResource) {
    this._rootResource.next(new Resource(iResource));
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

  public hasTemplate(template?: string): Observable<boolean> {
    return this.getResource().pipe(map((resource) => resource.hasTemplate(template)));
  }
}
