import { Component, OnInit } from '@angular/core';
import { JsonForm, JsonFormInputField, JsonFormSelectField, JsonFormSubmitEvent } from 'src/app/components/json-form/json-form.component'

const descriptionField: JsonFormInputField = {
  type: 'input',
  name: 'description',
  label: 'Description',
  defaultValue: '',
  placeholder: 'Order description',
  conditions: [
    {
      context: 'form',
      property: 'productionOrderId',
      operator: '=',
      value: 'hide-desc',
      actions: ['hide']
    },
    {
      context: 'form',
      property: 'productionOrderId',
      operator: '=',
      value: 'disable-desc',
      actions: ['disable']
    },
    {
      context: 'form',
      property: 'productionOrderId',
      operator: '=',
      value: 'hide-and-disable-desc',
      actions: ['disable', 'hide']
    },
  ],
  editable: ['label', 'type', 'conditions', 'options'],
}

const productionOrderIdField: JsonFormInputField = {
  type: 'input',
  name: 'productionOrderId',
  label: 'ID',
  defaultValue: '',
  placeholder: 'Order ID',
  conditions: [
    {
      context: 'form',
      property: 'carrierId',
      value: 2,
      actions: ['disable'],
      operator: '='
    }
  ]
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
  editable: ['options']
}

const customerField: JsonFormSelectField = {
  type: 'select',
  name: 'customerId',
  label: 'Customer',
  defaultValue: 1,
  options: [
    { value: 1, viewValue: 'Customer one' },
    { value: 2, viewValue: 'Customer two' },
  ]
}

const materialField: JsonFormSelectField = {
  type: 'select',
  name: 'materialId',
  label: 'Material',
  defaultValue: 1,
  options: [
    { value: 1, viewValue: 'Material one' },
    { value: 2, viewValue: 'Material two' },
  ]
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
  conditions: [
    {
      actions: ['hide'],
      context: 'form',
      operator: '!',
      property: 'type',
      value: 'internalTransfer'
    }
  ]
}

const typeField: JsonFormSelectField = {
  type: 'select',
  name: 'type',
  label: 'Tyyppi',
  defaultValue: 1,
  options: [
    { value: 'outgoing', viewValue: 'Incoming' },
    { value: 'incoming', viewValue: 'Outgoing' },
    { value: 'internalTransfer', viewValue: 'Internal transfer' },
  ]
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

  ngOnInit(): void {
  }

  onSubmit(event: JsonFormSubmitEvent) {
    const { data } = event
    console.log(data)
  }
}
