export {};

declare global {
  type WSPayload = {
    roomId: string;
    connectionId: string;
    players?: string[];
  };

  type WSData = {
    roomId: string;
    connectionId: string;
  };
}
