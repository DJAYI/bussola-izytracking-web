import { inject, Injectable } from "@angular/core";
import { User } from "./models/user.interface";
import { HttpClient } from "@angular/common/http";
import { LoginCredentials } from "./models/login.interface";
import { environment } from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    apiUrl = `${environment.apiUrl}auth`;
    currentUser: User | null = null

    constructor() { }

    private http = inject(HttpClient);


    login(credentials: LoginCredentials) {
        return this.http.post<User>(`${this.apiUrl}/login`, credentials)
    }
}