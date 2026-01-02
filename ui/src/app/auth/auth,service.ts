import { inject, Injectable } from "@angular/core";
import { User } from "./models/user.interface";
import { HttpClient } from "@angular/common/http";
import { LoginCredentials, LoginResponse } from "./models/login.interface";
import { environment } from "../../environments/environment.development";
import { Observable } from "rxjs";
import { ApiResponse } from "../utils/api-response.interface";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    apiUrl = `${environment.apiUrl}auth`;

    currentUser: User | null = null
    accessToken: string | null = null;

    constructor() { }

    private http = inject(HttpClient);


    login(credentials: LoginCredentials) {
        return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials, {
            withCredentials: true
        })
    }

    getAccessToken(): string | null {
        return globalThis.localStorage.getItem('accessToken');
    }

    setAccessToken(token: string): void {
        globalThis.localStorage.setItem('accessToken', token);
    }

    logout(): void {
        this.http.post(`${this.apiUrl}/logout`, {}, {
            withCredentials: true
        }).subscribe({
            next: () => {
                this.currentUser = null;
                this.accessToken = null;
                globalThis.localStorage.removeItem('accessToken');
            },
            error: (error) => {
                console.error('Logout failed', error);
            }
        });
    }

    getCurrentSession() {
        return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`, {
            withCredentials: true
        })
    }

    refresh(): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/refresh`, {}, {
            withCredentials: true
        });
    }
}