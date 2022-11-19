import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { JsonFormEditableFieldProperty, JsonFormField, JsonFormFieldEditSubmitEvent, JsonFormInputField, JsonFormSelectField, JsonFormSubmitEvent } from '../json-form.component'
import { fieldTypes } from '../json-form.component'

@Component({
  selector: 'app-json-form-field-editor',
  templateUrl: './json-form-field-editor.component.html',
  styleUrls: ['./json-form-field-editor.component.scss']
})
export class JsonFormFieldEditorComponent implements OnInit, OnChanges {
  @Input() jsonField!: JsonFormField
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<JsonFormFieldEditSubmitEvent>();
  form: FormGroup
  fieldTypes = fieldTypes

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      options: '',
    })
  }

  ngOnInit(): void {
    if (!this.jsonField) throw new Error('Input: jsonField is required')
    for (const editableProperty of this.editableFields) {
      if (editableProperty === 'label') {
        this.form.addControl('label', new FormControl(this.jsonField.label, { validators: [Validators.required] }), { emitEvent: false })
      }
      else if (editableProperty === 'type') {
        this.form.addControl('type', new FormControl(this.jsonField.type, { validators: [Validators.required] }), { emitEvent: false })
      }
    }
    if (this.jsonField.type === 'select') {
      this.setOptionsFormValue()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['jsonField'].currentValue && changes['jsonField'].currentValue.type === 'select') {
      this.setOptionsFormValue()
    }
  }

  protected setOptionsFormValue() {
    const optsString = this.getSelectOptionsAsCommaSeparatedString(<JsonFormSelectField>this.jsonField);
    this.form.get('options')?.setValue(optsString)
  }

  protected get editableFields() {
    return this.jsonField.editable || []
  }

  protected isPropertyEditable(property: JsonFormEditableFieldProperty) {
    return this.jsonField.editable?.includes(property)
  }

  protected handleSubmit() {
    if (!this.form.valid) return
    this.onSubmit.emit({ data: this.form.value })
  }

  protected handleCancelClick() {
    this.onCancel.emit(true)
  }

  protected getSelectOptionsAsCommaSeparatedString(field: JsonFormSelectField) {
    const opts = field.options || []
    let optsString = ''
    for (const o of opts) {
      optsString= `${optsString}${optsString? '|' : ''}${o.value},${o.viewValue}`
    }
    return optsString;
  }

  protected asJsonFormInputField(field: JsonFormField): JsonFormInputField {
    return <JsonFormInputField>field
  }

  protected asJsonFormSelectField(field: JsonFormField): JsonFormSelectField {
    return <JsonFormSelectField>field
  }
}
