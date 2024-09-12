import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { ApiEndpoints } from '../../../../api-endpoints';
import {ProfileDto} from "../../interfaces/profile.dto";
import {UserStatsDto} from "../../interfaces/user-stats.dto";
import {MatchDto} from "../../../../Game/interfaces/matchDto";
import {UserDto} from "../../../interfaces/userDto";
import {UserService} from "../../../user.service";
import { ToastService } from '../../../../Notifications/toast-menu/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerContentService {

  public stats?: UserStatsDto
  public matchhistory: MatchDto[] = []

  constructor(private http: HttpClient,private userService: UserService, private toastService: ToastService) {}

  onUpload(file: File | null) {
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('title', 'my nice avatar');

      this.http.post<UserDto>(ApiEndpoints.USERAVATAR, formData).pipe(this.userService.profilePicturePipe()).subscribe({
        next: (response: UserDto) => {
          this.userService.setUserData(response)
          alert('Your image uploaded successfully!');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 422) {
            alert('Unsupported file type!');
          }else {
            alert('Error uploading the image!');
          }
        }
      });
    } else {
      alert('Please select a file!');
    }
  }

  getinfo(){
    this.http.get<ProfileDto>(ApiEndpoints.USERPROFILE).subscribe({
     next: (response: ProfileDto) => {
       this.stats = response.stats;
       this.matchhistory = response.matchHistory;
     },
      error: (err: HttpErrorResponse) => {
       console.error(err);
       this.toastService.show('error', 'Http Error!', 'Error while loading profile');
      }
    })
  }
}
