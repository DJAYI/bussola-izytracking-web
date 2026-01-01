package com.bussola.izytracking.features.companies.domain.usecases.transport_providers.queries;

public record ListTransportProvidersQuery(
        int page,
        int size,
        String sortBy,
        String sortDirection) {

    public ListTransportProvidersQuery {
        if (page < 0) {
            page = 0;
        }
        if (size <= 0 || size > 100) {
            size = 10;
        }
        if (sortBy == null || sortBy.isBlank()) {
            sortBy = "id";
        }
        if (sortDirection == null
                || (!sortDirection.equalsIgnoreCase("asc") && !sortDirection.equalsIgnoreCase("desc"))) {
            sortDirection = "asc";
        }
    }

    public static ListTransportProvidersQuery of(int page, int size) {
        return new ListTransportProvidersQuery(page, size, "id", "asc");
    }
}
