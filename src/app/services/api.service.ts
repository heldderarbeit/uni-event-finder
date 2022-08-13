import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
import { Profile } from '../models/profile.model';
import { UniEvent } from '../models/uni-event.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  eventReq: { event: UniEvent | null } = {
    event: null
  };

  profileReq: { profile: Profile | null } = {
    profile: null
  };

  userReq: { user: User | null } = {
    user: null
  };

  constructor(private http: HttpClient, private authService: AuthService) { }

  postEvent(data: UniEvent) {
    this.eventReq.event = data;
    return this.http.post<any>("https://thawing-ravine-87621.herokuapp.com/api/event/", this.eventReq);
  }
  getEvent() {
    return this.http.get<{ events: UniEvent[] }>("https://thawing-ravine-87621.herokuapp.com/api/event/");
  }

  putEvent(data: UniEvent, id: string) {
    this.eventReq.event = data;
    return this.http.put("https://thawing-ravine-87621.herokuapp.com/api/event/" + id, this.eventReq);
  }
  deleteEvent(id: string) {
    return this.http.delete<any>("https://thawing-ravine-87621.herokuapp.com/api/event/" + id);
  }

  postProfile(data:Profile){
    this.profileReq.profile=data;
    if(data._id && data.user){
      this.profileReq.profile.is_International = String(this.profileReq.profile.is_International);
      this.profileReq.profile.need_Job = String(this.profileReq.profile.need_Job);
      return this.http.put<any>("https://thawing-ravine-87621.herokuapp.com/api/profile/" + data.user, this.profileReq);
    }else{
      return this.http.post<any>("https://thawing-ravine-87621.herokuapp.com/api/profile/", this.profileReq);
    }
    
  }
  
  getSuggestedEvents(lokuserID: string): Observable<{ events: UniEvent[] }> {
    return this.getUserProfile(lokuserID).pipe(
      mergeMap((res) => {
        let eventReqParams = new HttpParams();
        let userInterests = res.profile.interest_List.join(",");
        
        eventReqParams = eventReqParams.append("category", userInterests);
        return this.http.get<{ events: UniEvent[] }>("https://thawing-ravine-87621.herokuapp.com/api/event/", { params: eventReqParams });
      }));
  }

  getUserProfile(userID: string): Observable<{ profile: Profile }> {
    return this.http.get<{ profile: Profile }>("https://thawing-ravine-87621.herokuapp.com/api/profile/" + userID);
  }


  createUser(data:User){
    this.userReq.user=data;
    return this.http.post<any>("https://thawing-ravine-87621.herokuapp.com/api/users/", this.userReq);
  }
}
