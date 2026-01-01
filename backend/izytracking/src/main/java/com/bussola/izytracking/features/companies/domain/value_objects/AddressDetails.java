package com.bussola.izytracking.features.companies.domain.value_objects;

public class AddressDetails {
    private final String street;
    private final String city;
    private final String state;
    private final String postalCode;
    private final String country;

    public AddressDetails(
            String street,
            String city,
            String state,
            String postalCode,
            String country) {
        this.street = validateStreet(street);
        this.city = validateCity(city);
        this.state = validateState(state);
        this.postalCode = validatePostalCode(postalCode);
        this.country = validateCountry(country);
    }

    private static String validateStreet(String street) {
        requireNotBlank(street, "Street is required");
        if (street.length() < 3 || street.length() > 150) {
            throw new IllegalArgumentException("Street must be between 3 and 150 characters");
        }
        return street.trim();
    }

    private static String validateCity(String city) {
        requireNotBlank(city, "City is required");
        if (!city.matches("^[\\p{L} ]{2,100}$")) {
            throw new IllegalArgumentException("City contains invalid characters");
        }
        return city.trim();
    }

    private static String validateState(String state) {
        requireNotBlank(state, "State is required");
        if (!state.matches("^[\\p{L} ]{2,100}$")) {
            throw new IllegalArgumentException("State contains invalid characters");
        }
        return state.trim();
    }

    private static String validatePostalCode(String postalCode) {
        requireNotBlank(postalCode, "Postal code is required");
        if (!postalCode.matches("^[A-Za-z0-9\\- ]{3,20}$")) {
            throw new IllegalArgumentException("Postal code format is invalid");
        }
        return postalCode.trim();
    }

    private static String validateCountry(String country) {
        requireNotBlank(country, "Country is required");
        if (!country.matches("^[A-Z]{2,3}$")) {
            throw new IllegalArgumentException("Country must be ISO 3166-1 (2 or 3 uppercase letters)");
        }
        return country;
    }

    private static void requireNotBlank(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(message);
        }
    }
}
