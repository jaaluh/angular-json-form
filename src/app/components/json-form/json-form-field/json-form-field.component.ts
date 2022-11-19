import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ControlContainer, FormGroupDirective, UntypedFormGroup } from '@angular/forms'
import { JsonFormFieldEditSubmitEvent } from '../json-form.component'

@Component({
  selector: 'app-json-form-field',
  templateUrl: './json-form-field.component.html',
  styleUrls: ['./json-form-field.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective}]
})
export class JsonFormFieldComponent {
  @Input() hidden = false
  @Input() canEdit = false
  @Output() onUpdateField = new EventEmitter<JsonFormFieldEditSubmitEvent>()
  form: UntypedFormGroup
  editMode = false

  constructor(private parentForm: FormGroupDirective) {
    this.form = this.parentForm.form
  }

  toggleEditMode() {
    this.editMode = !this.editMode
  }

  handleUpdateField(event: JsonFormFieldEditSubmitEvent) {
    this.onUpdateField.emit(event)
    this.toggleEditMode()
  }
}
