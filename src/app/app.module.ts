import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatInputModule } from '@angular/material/input'
import { ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatSelectModule } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { OrderFormComponent } from './forms/order-form/order-form.component'
import { JsonFormComponent } from './components/json-form/json-form.component'
import { SidenavContentComponent } from './components/sidenav-content/sidenav-content.component'
import { MatIconModule } from '@angular/material/icon'
import { HomeComponent } from './pages/home/home.component'
import { MaterialsComponent } from './pages/materials/materials.component'
import { OrdersComponent } from './pages/orders/orders.component'
import { CompaniesComponent } from './pages/companies/companies.component'
import { NotFoundComponent } from './pages/not-found/not-found.component'
import { JsonFormInputFieldComponent } from './components/json-form/json-form-input-field/json-form-input-field.component'
import { JsonFormFieldComponent } from './components/json-form/json-form-field/json-form-field.component'
import { JsonFormSelectFieldComponent } from './components/json-form/json-form-select-field/json-form-select-field.component'
import { JsonFormFieldEditorComponent } from './components/json-form/json-form-field-editor/json-form-field-editor.component'
import { MatCardModule } from '@angular/material/card'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatRadioModule } from '@angular/material/radio'
import { MatListModule } from '@angular/material/list'

@NgModule({
  declarations: [
    AppComponent,
    OrderFormComponent,
    JsonFormComponent,
    SidenavContentComponent,
    HomeComponent,
    MaterialsComponent,
    OrdersComponent,
    CompaniesComponent,
    NotFoundComponent,
    JsonFormInputFieldComponent,
    JsonFormFieldComponent,
    JsonFormSelectFieldComponent,
    JsonFormFieldEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSidenavModule,
    MatCardModule,
    MatExpansionModule,
    MatRadioModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
