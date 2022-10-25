import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { Link } from '../domain/link';
import { IResource, Resource } from '../domain/resource';
import { Template } from '../domain/template';

@Injectable({ providedIn: 'root' })
export class HalFormResourceService {
  protected readonly _rootResource: BehaviorSubject<Resource> = new BehaviorSubject<Resource>(new Resource({}));

  public setResource(iResource?: IResource) {
    this._rootResource.next(new Resource(iResource));
  }

  public get resource$(): Observable<Resource> {
    return this._rootResource.asObservable();
  }

  public get resource(): Resource {
    return this._rootResource.getValue();
  }

  public get resourceOnce$(): Observable<Resource> {
    return this.resource$.pipe(take(1));
  }

  public hasLink(link?: string): Observable<boolean> {
    return this.resource$.pipe(map((resource) => resource.hasLink(link)));
  }

  public getLink(link?: string): Observable<Link | null> {
    return this.resource$.pipe(map((resource) => resource.getLink(link)));
  }

  public getLinkOrThrow(link?: string, errorMessage?: string | Error): Observable<Link> {
    return this.resource$.pipe(map((resource) => resource.getLinkOrThrow(link, errorMessage)));
  }

  public hasEmbedded(embedded: string): Observable<boolean> {
    return this.resource$.pipe(map((resource) => resource.hasEmbedded(embedded)));
  }

  public hasEmbeddedObject(embedded: string): Observable<boolean> {
    return this.resource$.pipe(map((resource) => resource.hasEmbeddedObject(embedded)));
  }

  public hasEmbeddedCollection(embedded: string): Observable<boolean> {
    return this.resource$.pipe(map((resource) => resource.hasEmbeddedCollection(embedded)));
  }

  public getEmbedded<T = Resource>(embedded: string): Observable<T | T[] | null> {
    return this.resource$.pipe(map((resource) => resource.getEmbedded<T>(embedded)));
  }

  public getEmbeddedObject<T = Resource>(embedded: string): Observable<T> {
    return this.resource$.pipe(map((resource) => resource.getEmbeddedObject<T>(embedded)));
  }

  public getEmbeddedCollection<T = Resource>(embedded: string): Observable<T[]> {
    return this.resource$.pipe(map((resource) => resource.getEmbeddedCollection<T>(embedded)));
  }

  public getTemplate(template?: string): Observable<Template | null> {
    return this.resource$.pipe(map((resource) => resource.getTemplate(template)));
  }

  public getTemplateOrThrow(template?: string): Observable<Template> {
    return this.resource$.pipe(map((resource) => resource.getTemplateOrThrow(template)));
  }

  public hasTemplate(template?: string): Observable<boolean> {
    return this.resource$.pipe(map((resource) => resource.hasTemplate(template)));
  }
}
