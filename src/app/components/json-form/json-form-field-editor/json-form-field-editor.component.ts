import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { JsonFormEditableFieldProperty, JsonFormField, JsonFormFieldCondition, JsonFormFieldEditSubmitEvent, JsonFormInputField, JsonFormSelectField, JsonFormSubmitEvent } from '../json-form.component'
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
      options: new FormControl([]),
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
      else if (editableProperty === 'conditions') {
        this.form.addControl('conditions', this.fb.array([]))
        for (const c of this.fieldConditions) {
          this.createCondition(c)
        }
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

  protected createCondition(condition?: JsonFormFieldCondition) {
    if (!condition) {
      condition = { actions: [], context: 'form', operator: '=', property: '', value: ''}
    }
    this.formConditions.push(this.fb.group({
      context: condition.context || 'form',
      operator: [condition.operator, Validators.required],
      property: [condition.property, Validators.required],
      value: condition.value,
      actions: new FormControl(condition.actions)
    }))
  }

  protected deleteCondition(index: number) {
    this.formConditions.removeAt(index);
  }

  protected setOptionsFormValue() {
    const enabled = (<JsonFormSelectField>this.jsonField).options.filter(f => !f.disabled).map(f => f.value)
    this.form.get('options')?.setValue(enabled)
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

  protected asJsonFormInputField(field: JsonFormField): JsonFormInputField {
    return <JsonFormInputField>field
  }

  protected asJsonFormSelectField(field: JsonFormField): JsonFormSelectField {
    return <JsonFormSelectField>field
  }

  protected get fieldConditions() {
    return this.jsonField.conditions || []
  }

  protected get formConditions() {
    return this.form.get('conditions') as FormArray
  }

  protected conditionActions(index: number) {
    return this.formConditions.at(index).get('actions')
  }

  protected get conditionProperties() {
    return this.jsonField.conditionProperties || []
  }
}
