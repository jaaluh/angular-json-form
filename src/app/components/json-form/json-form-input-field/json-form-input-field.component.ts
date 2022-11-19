import { Component, Input, OnInit } from '@angular/core';
import { JsonFormFieldComponent } from '../json-form-field/json-form-field.component'
import { JsonFormInputField } from '../json-form.component'

@Component({
  selector: 'app-json-form-input-field',
  templateUrl: './json-form-input-field.component.html',
  styleUrls: ['./json-form-input-field.component.scss']
})
export class JsonFormInputFieldComponent extends JsonFormFieldComponent implements OnInit {
  @Input() jsonField!: JsonFormInputField

  ngOnInit(): void {
    if (!this.jsonField) throw new Error('Input: jsonField is required')
  }
}
