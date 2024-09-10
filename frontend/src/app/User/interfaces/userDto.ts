export interface UserDto {
  username: string,
  profilePictureId: number;
  profilePictureUrl?: string;
  elo: number;
  state?: UserState;
  isAdmin: boolean;
  waitingTime?: number;
}

export enum UserState {
  Ready = 'ready',
  Waiting = 'waiting',
  Playing = 'playing',
}
