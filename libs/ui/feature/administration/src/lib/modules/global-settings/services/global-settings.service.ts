import { Injectable } from '@angular/core';
import { MessageService } from '@app/ui/shared/app';
import {
  GlobalSettings,
  GlobalSettingsChangedMessage,
  GlobalSettingsRelations,
  GlobalSettingsUpdateInput,
  WEBSOCKET_REL,
} from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';
import { Link } from '@hal-form-client';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

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
  ) {}

  get globalSettings$(): Observable<GlobalSettings> {
    return this._globalSettings.asObservable();
  }

  public initialize(): Observable<GlobalSettings> {
    return this._initializeGlobalSettings().pipe(
      tap((globalSettings: GlobalSettings) => this._subscribeToGlobalSettingsChanges(globalSettings)),
    );
  }

  public tearDown(): void {
    this._globalSettingsChanges?.unsubscribe();
    this._globalSettings.next(new GlobalSettings({}));
  }

  public canUpdateGlobalSettings() {
    return this.globalSettings$.pipe(
      map((globalSettings: GlobalSettings) =>
        globalSettings.hasTemplate(GlobalSettingsRelations.GLOBAL_SETTINGS_UPDATE_REL),
      ),
    );
  }

  public updateGlobalSettings(body: GlobalSettingsUpdateInput) {
    return this.globalSettings$.pipe(
      first(),
      switchMap((globalSettings: GlobalSettings) =>
        globalSettings.affordTemplate({ template: GlobalSettingsRelations.GLOBAL_SETTINGS_UPDATE_REL, body }),
      ),
    );
  }

  private _initializeGlobalSettings(): Observable<GlobalSettings> {
    return this.administrationService
      .getLinkOrThrow(GlobalSettingsRelations.GLOBAL_SETTINGS_REL)
      .pipe(switchMap((link: Link) => link.follow()))
      .pipe(tap((globalSettings) => this._globalSettings.next(globalSettings)));
  }

  private _subscribeToGlobalSettingsChanges(globalSettings: GlobalSettings) {
    this._globalSettingsChanges?.unsubscribe();
    if (globalSettings.hasLink(WEBSOCKET_REL)) {
      this._globalSettingsChanges = this.messageService
        .multicast<GlobalSettingsChangedMessage>(globalSettings.getLink(WEBSOCKET_REL)!.href)
        .pipe(switchMap(() => this._initializeGlobalSettings()))
        .subscribe();
    }
  }
}
