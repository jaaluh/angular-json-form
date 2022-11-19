import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderFormComponent } from './forms/order-form/order-form.component'
import { CompaniesComponent } from './pages/companies/companies.component'
import { HomeComponent } from './pages/home/home.component'
import { MaterialsComponent } from './pages/materials/materials.component'
import { NotFoundComponent } from './pages/not-found/not-found.component'
import { OrdersComponent } from './pages/orders/orders.component'

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'orders', component: OrdersComponent },
  { path: 'order/create', component: OrderFormComponent },
  { path: 'materials', component: MaterialsComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
