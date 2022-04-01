import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './component/connexion/connexion.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { InscriptionComponent } from './component/inscription/inscription.component';

const routes: Routes = [
  {path:"", component:DashboardComponent},
  {path:"inscription", component:InscriptionComponent},
  {path:"connexion", component:ConnexionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
