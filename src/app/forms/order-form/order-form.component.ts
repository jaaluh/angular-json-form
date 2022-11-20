import { Component, OnInit } from '@angular/core';
import { JsonForm, JsonFormInputField, JsonFormSelectField, JsonFormSubmitEvent } from 'src/app/components/json-form/json-form.component'

const descriptionField: JsonFormInputField = {
  type: 'input',
  name: 'description',
  label: 'Description',
  defaultValue: '',
  placeholder: 'Order description',
  conditions: [],
  editable: ['label', 'conditions'],
}

const productionOrderIdField: JsonFormInputField = {
  type: 'input',
  name: 'productionOrderId',
  label: 'ID',
  defaultValue: '',
  placeholder: 'Order ID',
  conditions: [],
  editable: ['label', 'conditions']
}

const carrierField: JsonFormSelectField = {
  type: 'select',
  name: 'carrierId',
  label: 'Carrier',
  defaultValue: 1,
  options: [
    { value: 1, viewValue: 'Carrier one' },
    { value: 2, viewValue: 'Carrier two' },
  ],
  editable: ['label', 'conditions']
}

const customerField: JsonFormSelectField = {
  type: 'select',
  name: 'customerId',
  label: 'Customer',
  defaultValue: 1,
  options: [
    { value: 1, viewValue: 'Customer one' },
    { value: 2, viewValue: 'Customer two' },
  ],
  editable: ['label', 'conditions']
}

const materialField: JsonFormSelectField = {
  type: 'select',
  name: 'materialId',
  label: 'Material',
  defaultValue: 1,
  options: [
    { value: 1, viewValue: 'Material one' },
    { value: 2, viewValue: 'Material two' },
  ],
  editable: ['label', 'conditions']
}

const sourceMaterialField: JsonFormSelectField = {
  type: 'select',
  name: 'sourceMaterialId',
  label: 'Source material',
  defaultValue: 1,
  options: [
    { value: 1, viewValue: 'Material one' },
    { value: 2, viewValue: 'Material two' },
  ],
  conditions: [],
  editable: ['label', 'conditions']
}

const typeField: JsonFormSelectField = {
  type: 'select',
  name: 'type',
  label: 'Tyyppi',
  defaultValue: 'outgoing',
  options: [
    { value: 'incoming', viewValue: 'Incoming' },
    { value: 'outgoing', viewValue: 'Outgoing' },
    { value: 'internalTransfer', viewValue: 'Internal transfer' },
  ],
  editable: ['label', 'conditions', 'options']
}

const orderForm: JsonForm = {
  fields: [
    descriptionField,
    productionOrderIdField,
    typeField,
    materialField,
    sourceMaterialField,
    customerField,
    carrierField,
  ]
}

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  jsonForm = orderForm;

  constructor() { }

  ngOnInit(): void {}

  onSubmit(event: JsonFormSubmitEvent) {
    const { data } = event
    console.log(data)
  }
}
