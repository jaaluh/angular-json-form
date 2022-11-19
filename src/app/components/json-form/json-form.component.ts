import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'

const propertyByString = function (o: any, s: string) {
  s = s.replace(/\[(\w+)\]/g, '.$1')
  s = s.replace(/^\./, '')
  var a = s.split('.')
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i]
    if (k in o) {
      o = o[k]
    } else {
      return
    }
  }
  return o
}

export const fieldTypes: JsonFormFieldType[] = ['input', 'select']

export type JsonFormFieldType = 'input' | 'select'

export type ComparisonContext = 'this' | 'form'

export type ComparisonAction = 'hide' | 'disable'

export interface JsonFormFieldCondition {
  context: ComparisonContext
  property: string
  value: any
  operator: '!' | '='
  actions: ComparisonAction[]
}

export interface JsonFormField {
  type: JsonFormFieldType;
  name: string;
  label: string;
  defaultValue: string | number | boolean;
  conditions?: JsonFormFieldCondition[];
  editable?: JsonFormEditableFieldProperty[];
}

export interface JsonFormInputField extends JsonFormField {
  defaultValue: string
  placeholder?: string
}

export interface JsonFormOption {
  value: string | number
  viewValue: string
}

export interface JsonFormSelectField extends JsonFormField {
  options: JsonFormOption[];
}

export interface JsonForm {
  title?: string;
  fields: JsonFormField[];
}

export interface JsonFormSubmitEvent {
  data: { [key: string]: any }
}

export type JsonFormFieldEditSubmitEvent = {
  data: { [key in JsonFormEditableFieldProperty]: any }
}

export type JsonFormEditableFieldProperty = 'label' | 'type' | 'conditions' | 'options'

@Component({
  selector: 'app-json-form',
  templateUrl: './json-form.component.html',
  styleUrls: ['./json-form.component.scss']
})
export class JsonFormComponent implements OnDestroy, OnInit {
  @Input() jsonForm!: JsonForm
  @Input() isAllowedToEditForm = false
  @Output() onSubmit = new EventEmitter<JsonFormSubmitEvent>()
  protected form!: UntypedFormGroup
  protected subs: Subscription[] = []
  protected hiddenFields: { [key: string]: boolean } = {}
  protected disabledFields: { [key: string]: boolean } = {}
  protected editMode = false

  constructor(private fb: UntypedFormBuilder) {
    this.form = this.fb.group({})
  }

  ngOnInit() {
    if (!this.jsonForm) throw new Error('input required: jsonForm')
    this.buildForm(this.jsonForm)
    this.updateHiddenAndDisabledFields(this.jsonForm.fields)
    this.startListeningChanges()
  }

  ngOnDestroy() {
    for (const sub of this.subs) {
      sub.unsubscribe()
    }
  }

  // ******************************************* Public API *********************************************************
  get formValue() {
    const values = Object.assign({}, this.form.value)
    for (const f of this.jsonForm.fields) {
      const hidden = this.hiddenFields[f.name]
      if (hidden) delete values[f.name]
    }
    return values
  }
  // ******************************************** Public API End ******************************************************

  protected buildForm(jsonForm: JsonForm) {
    this.addControlsForFields(jsonForm.fields)
  }

  protected startListeningChanges() {
    const sub = this.form.valueChanges.subscribe(() => {
      this.updateForm()
    })
    this.subs.push(sub)
  }

  protected addControlsForFields(fields: JsonFormField[]) {
    for (const f of fields) {
      if (f.type === 'input') this.addInputControl(<JsonFormInputField>f);
      if (f.type === 'select') this.addSelectControl(<JsonFormSelectField>f);
    }
  }

  protected addInputControl(field: JsonFormInputField) {
    this.form.addControl(field.name, new UntypedFormControl(field.defaultValue), { emitEvent: false })
  }

  protected addSelectControl(field: JsonFormSelectField) {
    this.form.addControl(field.name, new UntypedFormControl(field.defaultValue), { emitEvent: false })
  }

  protected updateForm() {
    this.updateHiddenAndDisabledFields(this.jsonForm.fields)
    this.updateFormFieldDisabledStates(this.disabledFields)
  }

  protected updateFormFieldDisabledStates(disabledFields: { [key: string]: boolean }) {
    for (const name in disabledFields) {
      const control = this.form.get(name)
      if (!control) continue
      const disabled = disabledFields[name]
      if (disabled && !control.disabled) {
        this.form.get(name)?.disable({ emitEvent: false, onlySelf: true })
      }
      else if (!disabled && control.disabled) {
        this.form.get(name)?.enable({ emitEvent: false, onlySelf: true })
      }
    }
  }

  protected updateHiddenAndDisabledFields(fields: JsonFormField[]) {
    for (const f of fields) {
      this.hiddenFields[f.name] = this.checkFormFieldCondition(f.conditions, 'hide')
      this.disabledFields[f.name] = this.checkFormFieldCondition(f.conditions, 'disable')
    }
  }

  protected checkFormFieldCondition(conditions: JsonFormFieldCondition[] | undefined, action: ComparisonAction) {
    if (!conditions || !conditions.length) return false

    for (const c of conditions) {
      if (!c.actions.includes(action)) continue

      const context = this.getComparisonContext(c.context)
      if (c.operator === '=') {
        const result = c.value === propertyByString(context, c.property)
        if (result === true) return true
        else continue
      }
      else if (c.operator === '!') {
        const result = c.value !== propertyByString(context, c.property)
        if (result === true) return true
        else continue
      }
    }

    return false
  }

  protected getComparisonContext(context: ComparisonContext) {
    if (context === 'this') {
      return this
    }
    else if (context === 'form') {
      return this.form.value
    }
    return this.form.value
  }

  protected asJsonFormInputField(field: JsonFormField): JsonFormInputField {
    return <JsonFormInputField>field
  }

  protected asJsonFormSelectField(field: JsonFormField): JsonFormSelectField {
    return <JsonFormSelectField>field
  }

  protected handleSubmit() {
    this.onSubmit.emit({ data: this.formValue })
  }

  protected isAllowedToEditField(name: string): boolean {
    if (!this.editMode) return false
    const field = this.jsonForm.fields.find(f => f.name === name)
    if (!field) return false

    return !!(field.editable && field.editable.length > 0)
  }

  protected toggleEditMode() {
    this.editMode = !this.editMode
  }

  protected handleUpdateField(event: JsonFormFieldEditSubmitEvent, field: JsonFormField) {
    const { data } = event;
    for (const editedFieldName in data) {
      const value = data[<JsonFormEditableFieldProperty>editedFieldName];
      if (editedFieldName === 'label' && value && value !== field.label) field.label = value
      if (editedFieldName === 'type' && value && fieldTypes.includes(value)) field.type = value
      if (editedFieldName === 'options' && value) {
        const arr = value.split('|');
        const selecteField = <JsonFormSelectField>field
        selecteField.options = []
        for (const optString of arr) {
          const [value, viewValue] = optString.split(',')
          selecteField.options.push({ value, viewValue })
        }
      }
    }
  }
}
