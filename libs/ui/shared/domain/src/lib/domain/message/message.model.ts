// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ApplicationMessage {}

export interface MessageDestination {
  getDestination: () => string;
}

export const WEBSOCKET_REL = 'ws';
