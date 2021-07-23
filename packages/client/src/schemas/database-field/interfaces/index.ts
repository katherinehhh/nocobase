import { ISchema } from '@formily/react';
import { set } from 'lodash';
import * as types from './types';

export const interfaces = new Map<string, ISchema>();

const fields = {};
const groupLabels = {};

export function registerField(group: string, type: string, schema) {
  fields[group] = fields[group] || {};
  set(fields, [group, type], schema);
  interfaces.set(type, schema);
}

export function registerGroupLabel(key: string, label: string) {
  groupLabels[key] = label;
}

Object.keys(types).forEach((type) => {
  const schema = types[type];
  registerField(schema.group || 'others', type, { order: 0, ...schema });
});

registerGroupLabel('basic', '基本类型');
registerGroupLabel('choices', '选择类型');
registerGroupLabel('media', '多媒体类型');
registerGroupLabel('relation', '关系类型');
registerGroupLabel('systemInfo', '系统信息');
registerGroupLabel('others', '其他类型');

export const options = Object.keys(groupLabels).map(groupName => {
  return {
    label: groupLabels[groupName],
    children: Object.keys(fields[groupName] || {}).map((type) => {
      return {
        name: type,
        ...fields[groupName][type],
      };
    }).sort((a, b) => a.order - b.order),
  }
});