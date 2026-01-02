import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, switchMap } from "rxjs";
import { environment } from "../../environments/environment.development";
import { ApiResponse } from "../utils/api-response.interface";
import { User } from "./models/user.interface";
import { UserCompany } from "./models/user-company.interface";

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private readonly apiUrl = environment.apiUrl;
    private readonly httpClient = inject(HttpClient);

    getAuthenticatedUser(): Observable<ApiResponse<User>> {
        return this.httpClient.get<ApiResponse<User>>(`${this.apiUrl}auth/me`);
    }

    getCompanyDetails(role: string): Observable<ApiResponse<UserCompany>> {
        const endpoint = role === 'AGENCY' ? 'agencies' : 'transport-providers';
        return this.httpClient.get<ApiResponse<UserCompany>>(`${this.apiUrl}${endpoint}/me`);
    }

    getFullProfile(): Observable<{ user: User; company: UserCompany }> {
        return this.getAuthenticatedUser().pipe(
            switchMap(({ data: user }) =>
                this.getCompanyDetails(user.role).pipe(
                    switchMap(({ data: company }) => [{ user, company }])
                )
            )
        );
    }
}
