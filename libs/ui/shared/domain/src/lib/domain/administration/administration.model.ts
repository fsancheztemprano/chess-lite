import { Resource } from '@hal-form-client';

export class ServiceLogs extends Resource {
  timestamp?: Date;
  logs?: string;
}
