import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

export function activeRouteTitle() {
    const router = inject(Router);

    const getTitle = () => {
        let route = router.routerState?.root;
        while (route?.firstChild) route = route.firstChild;
        return route?.snapshot?.data?.['title'] ?? '';
    };

    return toSignal(
        router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            startWith(null),
            map(() => getTitle())
        ),
        { initialValue: '' }
    );
}
