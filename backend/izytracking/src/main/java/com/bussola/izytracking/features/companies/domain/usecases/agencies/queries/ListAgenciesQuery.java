package com.bussola.izytracking.features.companies.domain.usecases.agencies.queries;

public record ListAgenciesQuery(
        int page,
        int size,
        String sortBy,
        String sortDirection) {

    public ListAgenciesQuery {
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

    public static ListAgenciesQuery of(int page, int size) {
        return new ListAgenciesQuery(page, size, "id", "asc");
    }
}
