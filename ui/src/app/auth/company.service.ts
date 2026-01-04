import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, switchMap } from "rxjs";
import { environment } from "../../environments/environment.development";
import { ApiResponse } from "../utils/api-response.interface";
import { User } from "./models/user.interface";
import { UserCompany } from "./models/user-company.interface";
import { PaginatedResponse, PaginationParams } from "../utils/paginated-response.interface";
import { CreateCompanyRequest } from "./models/create-company.interface";
import { getEndpointForRole, UserRole } from "./models/role.enum";

export interface UpdateCompanyPayload {
    addressDetails: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    contactInformation: {
        email: string;
        phoneNumber: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private readonly apiUrl = environment.apiUrl;
    private readonly httpClient = inject(HttpClient);

    getAuthenticatedUser(): Observable<ApiResponse<User>> {
        return this.httpClient.get<ApiResponse<User>>(`${this.apiUrl}auth/me`);
    }

    getCompanyDetails(role: UserRole): Observable<ApiResponse<UserCompany>> {
        const endpoint = getEndpointForRole(role);
        return this.httpClient.get<ApiResponse<UserCompany>>(`${this.apiUrl}${endpoint}/me`);
    }

    updateCompanyDetails(role: UserRole, payload: UpdateCompanyPayload): Observable<ApiResponse<UserCompany>> {
        const endpoint = getEndpointForRole(role);
        return this.httpClient.put<ApiResponse<UserCompany>>(`${this.apiUrl}${endpoint}/me`, payload);
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

    getListOfCompanies(companyType: UserRole, params: PaginationParams): Observable<ApiResponse<PaginatedResponse<UserCompany>>> {
        const endpoint = getEndpointForRole(companyType);

        return this.httpClient.get<ApiResponse<PaginatedResponse<UserCompany>>>(`${this.apiUrl}${endpoint}`, {
            params: {
                page: params.page,
                size: params.size,
                sortDirection: params.sortDirection || 'asc'
            }
        });
    }

    createCompany(companyType: UserRole, payload: CreateCompanyRequest): Observable<ApiResponse<UserCompany>> {
        const endpoint = getEndpointForRole(companyType);
        return this.httpClient.post<ApiResponse<UserCompany>>(`${this.apiUrl}${endpoint}`, payload);
    }

    getCompanyById(companyType: UserRole, id: string): Observable<ApiResponse<UserCompany>> {
        const endpoint = getEndpointForRole(companyType);
        return this.httpClient.get<ApiResponse<UserCompany>>(`${this.apiUrl}${endpoint}/${id}`);
    }

    updateCompanyById(companyType: UserRole, id: string, payload: UpdateCompanyPayload): Observable<ApiResponse<UserCompany>> {
        const endpoint = getEndpointForRole(companyType);
        return this.httpClient.put<ApiResponse<UserCompany>>(`${this.apiUrl}${endpoint}/${id}`, payload);
    }
}
