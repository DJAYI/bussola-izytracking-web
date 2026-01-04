import { Routes } from "@angular/router";
import { RetrieveServicesListComponent } from "./retrieve-services-list/retrieve-services-list";
import { ShowServiceDetailsComponent } from "./show-service-details/show-service-details";

export const servicesRoutes: Routes = [
    {
        path: "",
        children: [
            {
                path: "",
                component: RetrieveServicesListComponent
            },
            {
                path: "new",
                loadComponent: () => import("./create-service-form/create-service-form")
            },
            {
                path: ":id",
                component: ShowServiceDetailsComponent,
            }

        ]
    }
]