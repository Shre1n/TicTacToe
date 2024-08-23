export interface UserDto {
  username: string,
  profilePictureId: number;
  elo: number;
  state?: UserState;



}

export enum UserState {
  Ready = 'ready',
  Waiting = 'waiting',
  Playing = 'playing',
}
