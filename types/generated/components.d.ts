import type { Schema, Attribute } from '@strapi/strapi';

export interface CouponCoupon extends Schema.Component {
  collectionName: 'components_coupon_coupons';
  info: {
    displayName: 'Coupon';
  };
  attributes: {
    code: Attribute.String;
    sale: Attribute.Integer;
  };
}

export interface DishOrdDishOrd extends Schema.Component {
  collectionName: 'components_dish_ord_dish_ords';
  info: {
    displayName: 'DishOrd';
    description: '';
  };
  attributes: {
    dishId: Attribute.Integer;
    cafeId: Attribute.Integer;
    instruction: Attribute.String;
    quantity: Attribute.Integer;
    parameters: Attribute.Component<'dish-ord.parameters', true>;
  };
}

export interface DishOrdIdsFields extends Schema.Component {
  collectionName: 'components_dish_ord_ids_fields';
  info: {
    displayName: 'IdsFields';
  };
  attributes: {
    idField: Attribute.Integer;
  };
}

export interface DishOrdParameters extends Schema.Component {
  collectionName: 'components_dish_ord_parameters';
  info: {
    displayName: 'Parameters';
  };
  attributes: {
    idParameter: Attribute.Integer;
    idsFields: Attribute.String;
  };
}

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
      'coupon.coupon': CouponCoupon;
      'dish-ord.dish-ord': DishOrdDishOrd;
      'dish-ord.ids-fields': DishOrdIdsFields;
      'dish-ord.parameters': DishOrdParameters;
      'fields.field': FieldsField;
      'fields.parameter': FieldsParameter;
    }
  }
}
