import moment from 'moment';

export const processANDList = (list: any[], target: any[]) => {
  if (!Array.isArray(list)) {
    return;
  }
  list?.map((gl: any) => {
    if (gl?.operator == 'between') {
      if (gl.params instanceof Array) {
        const _val1 = gl.params?.[0]?.startOf('day');
        const _val2 = gl.params?.[1]?.endOf('day');
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
