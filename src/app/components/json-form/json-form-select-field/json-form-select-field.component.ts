import { Component, Input, OnInit } from '@angular/core'
import { JsonFormFieldComponent } from '../json-form-field/json-form-field.component'
import { JsonFormSelectField } from '../json-form.component'

@Component({
  selector: 'app-json-form-select-field',
  templateUrl: './json-form-select-field.component.html',
  styleUrls: ['./json-form-select-field.component.scss']
})
export class JsonFormSelectFieldComponent extends JsonFormFieldComponent implements OnInit {
  @Input() jsonField!: JsonFormSelectField

  ngOnInit(): void {
    if (!this.jsonField) throw new Error('Input: jsonField is required')
  }
}
