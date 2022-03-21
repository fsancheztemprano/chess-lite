import { Injectable } from '@angular/core';
import {
  GlobalSettings,
  GlobalSettingsChangedMessage,
  GlobalSettingsChangedMessageDestination,
  GlobalSettingsRelations,
  GlobalSettingsUpdateInput,
} from '@app/domain';
import { MessageService, ToasterService } from '@app/ui/shared';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsService {
  private _globalSettings: BehaviorSubject<GlobalSettings> = new BehaviorSubject<GlobalSettings>(
    new GlobalSettings({}),
  );

  private _globalSettingsChanges = new Subscription();

  constructor(
    private readonly administrationService: AdministrationService,
    private readonly messageService: MessageService,
    private readonly toasterService: ToasterService,
  ) {}

  getGlobalSettings(): Observable<GlobalSettings> {
    return this._globalSettings.asObservable();
  }

  setGlobalSettings(globalSettings: GlobalSettings): void {
    this._globalSettings.next(globalSettings);
  }

  public initialize(): Observable<GlobalSettings> {
    this._globalSettingsChanges.unsubscribe();
    return this._initializeGlobalSettings().pipe(tap(() => this._subscribeToGlobalSettingsChanges()));
  }

  public deactivate(): void {
    this._globalSettingsChanges.unsubscribe();
    this.setGlobalSettings(new GlobalSettings({}));
  }

  private _fetchGlobalSettings(): Observable<GlobalSettings> {
    return this.administrationService
      .getLinkOrThrow(GlobalSettingsRelations.GLOBAL_SETTINGS_REL)
      .pipe(switchMap((link) => link.follow()));
  }

  private _initializeGlobalSettings(): Observable<GlobalSettings> {
    return this._fetchGlobalSettings().pipe(tap((globalSettings) => this.setGlobalSettings(globalSettings)));
  }

  private _subscribeToGlobalSettingsChanges() {
    this._globalSettingsChanges = this.messageService
      .subscribeToMessages<GlobalSettingsChangedMessage>(new GlobalSettingsChangedMessageDestination())
      .pipe(switchMap(() => this._initializeGlobalSettings()))
      .subscribe(() => this.toasterService.showToast({ title: `Global Settings were updated.` }));
  }

  canUpdateGlobalSettings() {
    return this.getGlobalSettings().pipe(
      map((globalSettings) => globalSettings.isAllowedTo(GlobalSettingsRelations.GLOBAL_SETTINGS_UPDATE_REL)),
    );
  }

  updateGlobalSettings(body: GlobalSettingsUpdateInput) {
    return this.getGlobalSettings().pipe(
      first(),
      switchMap((globalSettings) =>
        globalSettings.submitToTemplateOrThrow(GlobalSettingsRelations.GLOBAL_SETTINGS_UPDATE_REL, { body }),
      ),
    );
  }
}
