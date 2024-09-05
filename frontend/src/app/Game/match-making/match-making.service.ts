import { Injectable } from '@angular/core';
import { map, mergeMap,  of, OperatorFunction } from 'rxjs';
import { MatchUpDto } from '../interfaces/MatchUpDto';
import { ApiEndpoints } from '../../api-endpoints';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MatchMakingService {

  constructor(private http: HttpClient) { }

  profilePicturePipe(): OperatorFunction<MatchUpDto, MatchUpDto> {
    return mergeMap((matchUp: MatchUpDto, _) => matchUp.opponent.profilePictureId ? this.http.get(`${ApiEndpoints.AVATAR}/${matchUp.opponent.profilePictureId}`, {responseType: 'arraybuffer'})
      .pipe(map((pic): MatchUpDto => {
        const fullOpponent = { ...matchUp.opponent, profilePictureUrl: URL.createObjectURL(new Blob([pic]))};
        return { ...matchUp, opponent: fullOpponent};
      })) : of(matchUp));
  }
}
