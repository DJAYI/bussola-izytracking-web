/**
 * Country codes available in the system.
 */
export const CountryCode = {
    COL: 'COL',
    USA: 'USA',
    MEX: 'MEX',
    ARG: 'ARG',
    BRA: 'BRA',
    CHL: 'CHL',
    PER: 'PER',
    ECU: 'ECU',
} as const;

export type CountryCode = typeof CountryCode[keyof typeof CountryCode];

/**
 * Country labels for display purposes.
 */
export const COUNTRY_LABELS: Record<CountryCode, string> = {
    [CountryCode.COL]: 'Colombia',
    [CountryCode.USA]: 'Estados Unidos',
    [CountryCode.MEX]: 'México',
    [CountryCode.ARG]: 'Argentina',
    [CountryCode.BRA]: 'Brasil',
    [CountryCode.CHL]: 'Chile',
    [CountryCode.PER]: 'Perú',
    [CountryCode.ECU]: 'Ecuador',
} as const;

/**
 * Country options for select dropdowns.
 */
export interface CountryOption {
    value: CountryCode;
    label: string;
}

export const COUNTRIES: CountryOption[] = Object.values(CountryCode).map(code => ({
    value: code,
    label: COUNTRY_LABELS[code],
}));
