import { Routes } from "@angular/router";
import { RetrieveClientsComponent } from "./retrieve-clients/retrieve-clients";
import { ShowClientDetails } from "./show-client-details/show-client-details";
import { AddClientFormComponent } from "./add-client-form/add-client-form";
import { ModifyClientFormComponent } from "./modify-client-form/modify-client-form";

export const clientRoutes: Routes = [
    {
        path: "",
        children: [
            {
                path: "",
                component: RetrieveClientsComponent,
                data: { title: "Clientes" }
            },
            {
                path: "new",
                component: AddClientFormComponent,
                data: { title: "Nuevo Cliente" }
            },
            {
                path: ":id",
                component: ShowClientDetails,
                data: { title: "Detalle del Cliente" }
            },
            {
                path: ":id/edit",
                component: ModifyClientFormComponent,
                data: { title: "Editar Cliente" }
            }
        ]
    }
];