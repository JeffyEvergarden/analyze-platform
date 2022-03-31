import moment from 'moment';

const timeRex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

const formatDateStr = (str: any) => {
  if (typeof str === 'string' && timeRex.test(str)) {
    try {
      str = moment(str);
    } catch (e) {
      str = undefined;
    }
  }
  return str;
};

export const propcessInitForm = (obj: any) => {
  const keys = ['childrenList', 'innerList'];
  const subKeys = ['params', 'value'];
  keys.forEach((key: any) => {
    let childrenList = obj?.[key];
    if (!Array.isArray(childrenList)) {
      return;
    }
    childrenList.forEach((item: any) => {
      propcessInitForm(item);
      subKeys.forEach((_key: any) => {
        if (Array.isArray(item[_key])) {
          item[_key] = item[_key].map((subItem: any) => {
            return formatDateStr(subItem);
          });
        } else if (item[_key]) {
          item[_key] = formatDateStr(item[_key]);
        }
      });
    });
  });
  return obj;
};
