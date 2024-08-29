import { Injectable } from '@angular/core';
import { UserDto, UserState } from './interfaces/userDto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, mergeMap, Observable, of } from 'rxjs';
import { SocketService } from '../Socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user?: UserDto | undefined;

  private userLoadedSubject = new BehaviorSubject<boolean>(false);
  userDataLoaded: Observable<boolean> = this.userLoadedSubject.asObservable();

  constructor(private http: HttpClient, private socketService: SocketService) { }

  profilePicturePipe() {
    return mergeMap((user: UserDto, _) => user.profilePictureId ? this.http.get(`/api/user/avatar/${user.profilePictureId}`, {responseType: 'arraybuffer'})
      .pipe(map(pic => {
        return {...user, profilePictureUrl: URL.createObjectURL(new Blob([pic]))}
      })) : of(user));
  }

  loadUserData() {
    this.http.get<UserDto>(`/api/user/me`).pipe(this.profilePicturePipe()).subscribe({
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
    return this.http.get<Response>(`/api/user/me`).pipe(map((response: Response) => response.ok), catchError((_) => of(false)));
  }

  isAdmin() {
    return this.isAuthenticated() && this.user?.isAdmin;
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
}
