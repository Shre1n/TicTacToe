export interface UserDto {
  username: string,
  profilePictureId: number;
  profilePictureUrl?: string;
  elo: number;
  state?: UserState;
  isAdmin: boolean;
}

export enum UserState {
  Ready = 'ready',
  Waiting = 'waiting',
  Playing = 'playing',
}
