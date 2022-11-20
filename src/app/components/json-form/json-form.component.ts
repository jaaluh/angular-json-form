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

export type JsonFormComparisonContext = 'this' | 'form'

export type JsonFormComparisonAction = 'hide' | 'disable'

export type JsonFormEditableFieldProperty = 'label' | 'type' | 'conditions' | 'options'

export interface JsonFormConditionProperty {
  context: JsonFormComparisonContext;
  property: string;
}

export interface JsonFormFieldCondition {
  context: JsonFormComparisonContext
  property: string
  value: any
  operator: '!' | '='
  actions: JsonFormComparisonAction[]
}

export interface JsonFormField {
  type: JsonFormFieldType;
  name: string;
  label: string;
  defaultValue: string | number | boolean;
  conditions?: JsonFormFieldCondition[];
  conditionProperties?: JsonFormConditionProperty[];
  editable?: JsonFormEditableFieldProperty[];
}

export interface JsonFormInputField extends JsonFormField {
  defaultValue: string
  placeholder?: string
}

export interface JsonFormOption {
  value: string | number;
  viewValue: string;
  disabled?: boolean
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
  protected importJsonForm!: UntypedFormGroup
  protected subs: Subscription[] = []
  protected hiddenFields: { [key: string]: boolean } = {}
  protected disabledFields: { [key: string]: boolean } = {}
  protected editMode = false
  protected valueChangeSub: Subscription | undefined

  constructor(private fb: UntypedFormBuilder) {
    this.form = this.fb.group({})
  }

  ngOnInit() {
    if (!this.jsonForm) throw new Error('input required: jsonForm')
    this.init()
  }

  ngOnDestroy() {
    for (const sub of this.subs) {
      sub.unsubscribe()
    }
    this.valueChangeSub?.unsubscribe()
  }

  protected init() {
    this.addConditionProperties()
    this.buildForm(this.jsonForm)
    this.updateHiddenAndDisabledFields(this.jsonForm.fields)
    this.importJsonForm = this.fb.group({ json: new UntypedFormControl(this.formValueAsJson()) })
    this.startListeningChanges()
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

  protected addConditionProperties() {
    const conditionProperties = this.jsonForm.fields.map(f => f.name)
    for (const f of this.jsonForm.fields) {
      f.conditionProperties = f.conditionProperties || []
      for (const p of conditionProperties) {
        f.conditionProperties.push({ context: 'form', property: p })
      }
    }
  }

  protected buildForm(jsonForm: JsonForm) {
    this.addControlsForFields(jsonForm.fields)
  }

  protected startListeningChanges() {
    if (this.valueChangeSub) {
      this.valueChangeSub.unsubscribe()
    }
    this.valueChangeSub = this.form.valueChanges.subscribe(() => {
      this.updateForm()
    })
  }

  protected addControlsForFields(fields: JsonFormField[]) {
    for (const f of fields) {
      if (f.type === 'input') this.addInputControl(<JsonFormInputField>f);
      if (f.type === 'select') this.addSelectControl(<JsonFormSelectField>f);
    }
  }

  protected addInputControl(field: JsonFormInputField) {
    if (!this.form.get(field.name)) {
      this.form.addControl(field.name, new UntypedFormControl(field.defaultValue), { emitEvent: false })
    }
  }

  protected addSelectControl(field: JsonFormSelectField) {
    if (!this.form.get(field.name)) {
      this.form.addControl(field.name, new UntypedFormControl(field.defaultValue), { emitEvent: false })
    }
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

  protected checkFormFieldCondition(conditions: JsonFormFieldCondition[] | undefined, action: JsonFormComparisonAction) {
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

  protected getComparisonContext(context: JsonFormComparisonContext) {
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
        const options = (<JsonFormSelectField>field).options || []
        for (const o of options) {
          if (!value.includes(o.value)) o.disabled = true
          else o.disabled = false
        }
      }
      if (editedFieldName === 'conditions' && value) field.conditions = value
    }
  }

  protected get visibleFields() {
    return this.jsonForm.fields.filter(f => !this.hiddenFields[f.name])
  }

  protected formValueAsJson() {
    return JSON.stringify(this.jsonForm, null, 2)
  }

  protected importJson() {
    try {
      const value = JSON.parse(this.importJsonForm.get('json')?.value)
      this.jsonForm = value;
      this.init()
    }
    catch(err) {
      console.log('error importing json', err)
    }
  }
}
