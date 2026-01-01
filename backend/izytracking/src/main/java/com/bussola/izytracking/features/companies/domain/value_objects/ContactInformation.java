package com.bussola.izytracking.features.companies.domain.value_objects;

public class ContactInformation {

    private final String email;
    private final String phoneNumber;
    private final String mobileNumber;

    public ContactInformation(
            String email,
            String phoneNumber,
            String mobileNumber) {
        this.email = validateEmail(email);
        this.phoneNumber = validatePhone(phoneNumber, "Phone number");
        this.mobileNumber = validatePhone(mobileNumber, "Mobile number");

        validateAtLeastOneContact();
    }

    private String validateEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        String normalized = email.trim().toLowerCase();

        if (normalized.length() > 254) {
            throw new IllegalArgumentException("Email exceeds maximum length");
        }

        if (!normalized.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email format");
        }

        return normalized;
    }

    private String validatePhone(String phone, String fieldName) {
        if (phone == null || phone.isBlank()) {
            return null;
        }

        String normalized = phone.replaceAll("[^0-9]", "");

        if (normalized.length() < 7 || normalized.length() > 15) {
            throw new IllegalArgumentException(
                    fieldName + " must have between 7 and 15 digits");
        }

        return normalized;
    }

    private void validateAtLeastOneContact() {
        if (email == null && phoneNumber == null && mobileNumber == null) {
            throw new IllegalArgumentException(
                    "At least one contact information must be provided");
        }
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }
}
