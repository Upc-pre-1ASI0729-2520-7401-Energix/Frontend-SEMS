import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environments';
import { NotificationEntity } from '../domain/model/notifications.entity';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;


  constructor(private http: HttpClient) {
  }

  getNotifications(): Observable<NotificationEntity[]> {
    return this.http.get<NotificationEntity[]>(this.apiUrl);
  }


  markAsRead(notification: NotificationEntity): Observable<NotificationEntity> {
    return this.http.patch<NotificationEntity>(`${this.apiUrl}/${notification.id}`, {isRead: true});
  }
}
