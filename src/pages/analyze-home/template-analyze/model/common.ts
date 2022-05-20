import moment from 'moment';

const reg = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

export const processANDList = (list: any[], target: any[]) => {
  if (!Array.isArray(list)) {
    return;
  }
  list?.map((gl: any) => {
    if (gl?.operator == 'between') {
      if (gl.params instanceof Array) {
        let _val1 = gl.params?.[0];
        let _val2 = gl.params?.[1];
        if (typeof _val1 === 'string' && reg.test(_val1)) {
          _val1 = moment(_val1);
        }
        if (typeof _val2 === 'string' && reg.test(_val2)) {
          _val2 = moment(_val2);
        }

        _val1 = gl.params?.[0]?.startOf('day');
        _val2 = gl.params?.[1]?.endOf('day');
        target.push({
          expressionType: 'SQL',
          subject: null,
          operator: null,
          comparator: null,
          clause: 'WHERE',
          fromFormData: true,
          isExtra: false,
          sqlExpression: `${gl.subject} >= cast('${_val1?.format?.()}' as TIMESTAMP)`,
          filterOptionName: '',
        });
        target.push({
          expressionType: 'SQL',
          subject: null,
          operator: null,
          comparator: null,
          clause: 'WHERE',
          fromFormData: true,
          isExtra: false,
          sqlExpression: `${gl.subject} <= cast('${_val2?.format?.()}' as TIMESTAMP)`,
          filterOptionName: '',
        });
      }
    } else {
      let _val = gl.params;
      if (typeof _val === 'string' && reg.test(_val)) {
        _val = moment(_val);
      }
      gl.params = _val;
      if (gl?.params instanceof moment) {
        target.push({
          expressionType: 'SQL',
          subject: null,
          operator: null,
          comparator: null,
          clause: 'WHERE',
          fromFormData: true,
          isExtra: false,
          sqlExpression: `${gl.subject} ${
            gl.operator == '==' ? '=' : gl.operator
          } cast('${gl.params?.format?.()}' as TIMESTAMP)`,
          filterOptionName: '',
        });
      } else {
        target.push({
          expressionType: 'SIMPLE',
          subject: gl.subject,
          operator: gl.operator,
          comparator: gl.params,
          clause: 'WHERE',
          fromFormData: true,
          isExtra: false,
          sqlExpression: null,
          filterOptionName: '',
        });
      }
    }
  });
};
