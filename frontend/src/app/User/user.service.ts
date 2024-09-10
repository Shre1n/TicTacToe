import { Injectable } from '@angular/core';
import { UserDto, UserState } from './interfaces/userDto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, map, mergeMap, Observable, of } from 'rxjs';
import { SocketService } from '../Socket/socket.service';
import { ApiEndpoints } from '../api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user?: UserDto | undefined;

  private userLoadedSubject = new BehaviorSubject<boolean>(false);
  userDataLoaded: Observable<boolean> = this.userLoadedSubject.asObservable();

  constructor(private http: HttpClient, private socketService: SocketService) { }

  profilePicturePipe() {
    return mergeMap((user: UserDto, _) => user.profilePictureId ? this.http.get(`${ApiEndpoints.AVATAR}/${user.profilePictureId}`, {responseType: 'arraybuffer'})
      .pipe(map(pic => {
        return {...user, profilePictureUrl: URL.createObjectURL(new Blob([pic]))}
      })) : of(user));
  }

  loadUserData() {
    this.http.get<UserDto>(ApiEndpoints.ME).pipe(this.profilePicturePipe()).subscribe({
      next: (user: UserDto) => {
        this.user = user;
        this.userLoadedSubject.next(true);
        this.socketService.connect();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.userLoadedSubject.next(true);
        }
      },
    });
  }

  isAuthenticated() {
    return this.http.get<UserDto>(ApiEndpoints.ME);
  }

  isAdmin() {
    return this.user?.isAdmin;
  }

  getUserState() {
    return this.user?.state ?? UserState.Ready;
  }

  setReady() {
    if (this.user)
      this.user.state = UserState.Ready;
  }

  setWaiting() {
    if (this.user)
      this.user.state = UserState.Waiting;
  }

  setPlaying() {
    if (this.user)
      this.user.state = UserState.Playing;
  }

  clear() {
    this.user = undefined;
  }

  setUserData(data: UserDto) {
    this.user = data;
  }

  getWaitingTime() {
    return this.http.get<number>(ApiEndpoints.USERWAITINGTIME);
  }
}
