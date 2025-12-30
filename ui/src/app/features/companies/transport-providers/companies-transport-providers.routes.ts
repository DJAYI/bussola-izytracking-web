import { Routes } from "@angular/router";
import { RetrieveTransportProvidersComponent } from "./retrieve-transport-provider/retrieve-transport-providers";
import { AddTransportProviderFormComponent } from "./add-transport-provider-form/add-transport-provider-form";
import { ModifyTransportProviderFormComponent } from "./modify-transport-provider-form/modify-transport-provider-form";
import { ShowTransportProviderDetailsComponent } from "./show-transport-provider-details/show-transport-provider-details";

export const transportProvidersRoutes: Routes = [
    {
        path: "",
        children: [
            {
                path: "",
                component: RetrieveTransportProvidersComponent
            },
            {
                path: "new",
                component: AddTransportProviderFormComponent,
                data: { title: "Agregar Transportista" }
            },
            {
                path: ":id",
                component: ShowTransportProviderDetailsComponent,
                data: { title: "Detalles del Transportista" }
            },
            {
                path: ":id/edit",
                component: ModifyTransportProviderFormComponent,
                data: { title: "Modificar Transportista" }
            },
            {
                path: "**",
                redirectTo: ""
            }
        ]
    }
]