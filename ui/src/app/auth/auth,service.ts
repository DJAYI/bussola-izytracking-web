import { inject, Injectable } from "@angular/core";
import { User } from "./models/user.interface";
import { HttpClient } from "@angular/common/http";
import { LoginCredentials, LoginResponse } from "./models/login.interface";
import { environment } from "../../environments/environment.development";
import { Observable } from "rxjs";
import { ApiResponse } from "../utils/api-response.interface";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    apiUrl = `${environment.apiUrl}auth`;


    private http = inject(HttpClient);
    private router = inject(Router);


    login(credentials: LoginCredentials) {
        return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials, {
            withCredentials: true
        })
    }


    logout(): void {

        this.http.post(`${this.apiUrl}/logout`, {}, {
            withCredentials: true
        }).subscribe({
            next: () => {
                this.router.navigate(['/auth/login']);
            },
            error: (error) => {
                this.router.navigate(['/auth/login']);
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

    getUsernameByUserId(userId: string): Observable<ApiResponse<string>> {
        return this.http.get<ApiResponse<string>>(`${environment.apiUrl}users/${userId}/username`, {
            withCredentials: true
        });
    }
}