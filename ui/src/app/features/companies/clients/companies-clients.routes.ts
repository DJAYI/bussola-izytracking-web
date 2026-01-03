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
                data: { title: "Agencias" }
            },
            {
                path: "new",
                component: AddClientFormComponent,
                data: { title: "Nueva Agencia" }
            },
            {
                path: ":id",
                component: ShowClientDetails,
                data: { title: "Detalle de la Agencia" }
            },
            {
                path: ":id/edit",
                component: ModifyClientFormComponent,
                data: { title: "Editar Agencia" }
            }
        ]
    }
];