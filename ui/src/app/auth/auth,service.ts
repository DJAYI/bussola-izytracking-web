import { inject, Injectable } from "@angular/core";
import { User } from "./models/user.interface";
import { HttpClient } from "@angular/common/http";
import { LoginCredentials, LoginResponse } from "./models/login.interface";
import { environment } from "../../environments/environment.development";
import { Observable, tap } from "rxjs";
import { ApiResponse } from "../utils/api-response.interface";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}auth`;
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    login(credentials: LoginCredentials) {
        return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials, {
            withCredentials: true
        });
    }

    /**
     * Logs out the user and redirects to login page.
     * Use this for user-initiated logout.
     */
    logout(): void {
        this.clearSession().subscribe({
            complete: () => this.router.navigate(['/auth/login']),
            error: () => this.router.navigate(['/auth/login'])
        });
    }

    /**
     * Clears the session without redirecting.
     * Used by the interceptor when refresh token expires.
     */
    clearSession(): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/logout`, {}, {
            withCredentials: true
        }).pipe(
            tap({
                error: (error) => console.error('Logout request failed:', error)
            })
        );
    }

    getCurrentSession() {
        return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`, {
            withCredentials: true
        });
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