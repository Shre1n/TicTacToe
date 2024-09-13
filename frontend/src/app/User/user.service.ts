import { Injectable } from '@angular/core';
import { UserDto, UserState } from './interfaces/userDto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {BehaviorSubject, map, mergeMap, Observable, of, Timestamp} from 'rxjs';
import { SocketService } from '../Socket/socket.service';
import { ApiEndpoints } from '../api-endpoints';
import { ToastService } from '../Notifications/toast-menu/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user?: UserDto | undefined;

  private userLoadedSubject = new BehaviorSubject<boolean>(false);
  userDataLoaded: Observable<boolean> = this.userLoadedSubject.asObservable();

  queueWaitingTime?: Date;

  constructor(private http: HttpClient, private socketService: SocketService, private toastService: ToastService) { }

  profilePicturePipe() {
    return mergeMap((user: UserDto, _) => user.profilePictureId ? this.http.get(`${ApiEndpoints.AVATAR}/${user.profilePictureId}`, {responseType: 'arraybuffer'})
      .pipe(map(pic => {
        return {...user, profilePictureUrl: URL.createObjectURL(new Blob([pic]))}
      })) : of(user));
  }

  setElapsedTimeInQueue(){
    this.http.get<Date>(ApiEndpoints.USERWAITINGTIME).subscribe({
      next: (elapsedTime: Date) => {
        this.queueWaitingTime = elapsedTime;
      }, error: (err: HttpErrorResponse) => {
        this.toastService.show('error', "Error", "Something went wrong.");
      }
    });
    return this.queueWaitingTime;
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
        this.toastService.show('error', "HTTP Error", "Error while loading userdata!");
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
}
