import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Country {
    id: number;
    name: string;
    iso2: string;
    iso3: string;
    phonecode: string;
    capital: string;
    currency: string;
    native: string;
    emoji: string;
}

export interface State {
    id: number;
    name: string;
    iso2: string;
}

export interface City {
    id: number;
    name: string;
}

/**
 * Service for fetching location data (countries, states, cities) from CountryStateCityAPI.
 * Implements caching for countries and states to minimize API calls.
 */
@Injectable({ providedIn: 'root' })
export class LocationService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'https://api.countrystatecity.in/v1';
    private readonly headers = new HttpHeaders().set('X-CSCAPI-KEY', environment.countryStateCityApi);

    // Cache for countries (called frequently, rarely changes)
    private countriesCache$: Observable<Country[]> | null = null;

    // Cache for states by country ISO2
    private readonly statesCache = new Map<string, Observable<State[]>>();

    /**
     * Fetches all countries. Results are cached and shared across subscribers.
     */
    getCountries(): Observable<Country[]> {
        if (!this.countriesCache$) {
            this.countriesCache$ = this.http.get<Country[]>(`${this.baseUrl}/countries`, { headers: this.headers }).pipe(
                shareReplay({ bufferSize: 1, refCount: false }),
                catchError(this.handleError<Country[]>('getCountries', []))
            );
        }
        return this.countriesCache$;
    }

    /**
     * Fetches states for a given country. Results are cached per country.
     */
    getStates(countryIso2: string): Observable<State[]> {
        if (!countryIso2) return of([]);

        const cached = this.statesCache.get(countryIso2);
        if (cached) return cached;

        const states$ = this.http.get<State[]>(`${this.baseUrl}/countries/${countryIso2}/states`, { headers: this.headers }).pipe(
            shareReplay({ bufferSize: 1, refCount: false }),
            catchError(this.handleError<State[]>('getStates', []))
        );

        this.statesCache.set(countryIso2, states$);
        return states$;
    }

    /**
     * Fetches cities for a given country and state. Not cached as cities are more specific.
     */
    getCities(countryIso2: string, stateIso2: string): Observable<City[]> {
        if (!countryIso2 || !stateIso2) return of([]);

        return this.http.get<City[]>(
            `${this.baseUrl}/countries/${countryIso2}/states/${stateIso2}/cities`,
            { headers: this.headers }
        ).pipe(
            catchError(this.handleError<City[]>('getCities', []))
        );
    }

    /**
     * Generic error handler for HTTP operations.
     */
    private handleError<T>(operation: string, fallback: T) {
        return (error: unknown): Observable<T> => {
            console.error(`LocationService.${operation} failed:`, error);
            return of(fallback);
        };
    }
}
