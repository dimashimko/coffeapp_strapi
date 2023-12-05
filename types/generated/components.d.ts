import type { Schema, Attribute } from '@strapi/strapi';

export interface FieldsField extends Schema.Component {
  collectionName: 'components_fields_fields';
  info: {
    displayName: 'Field';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface FieldsParameter extends Schema.Component {
  collectionName: 'components_fields_parameters';
  info: {
    displayName: 'Parameter';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    type: Attribute.Enumeration<['oneChoice', 'multiselect']>;
    fields: Attribute.Component<'fields.field', true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'fields.field': FieldsField;
      'fields.parameter': FieldsParameter;
    }
  }
}
