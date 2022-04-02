import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../app/model/user.model';
import {map, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

const AUTH_DATA = "auth_data";

@Injectable({
    providedIn: 'root'
})
export class AuthStore {

    private subject = new BehaviorSubject<User | null>(null);

    user$ : Observable<User | null> = this.subject.asObservable();

    isLoggedIn$ : Observable<boolean>;
    isLoggedOut$ : Observable<boolean>;

    constructor(private http: HttpClient) {

        this.isLoggedIn$ = this.user$.pipe(map(user => !!user));

        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

        const user = localStorage.getItem(AUTH_DATA);

        if (user) {
            this.subject.next(JSON.parse(user));
        }

    }


    signup(email:string, password:string): Observable<User> {
      return this.http.post<User>("http://localhost:3000/inscription", {email, password})
          .pipe(
              tap(user => {
                console.log(user)
              }),
              shareReplay()
          );
  }


    login(email:string, password:string): Observable<User> {
        return this.http.post<User>("/api/login", {email, password})
            .pipe(
                tap(user => {
                    this.subject.next(user);
                    localStorage.setItem(AUTH_DATA, JSON.stringify(user));
                }),
                shareReplay()
            );
    }

    logout() {
        this.subject.next(null);
        localStorage.removeItem(AUTH_DATA);
    }


}
