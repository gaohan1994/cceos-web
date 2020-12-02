import history from '../history';

export const formatSearch = (search: string): any => {
  let result: any = {};
  search
    .replace('?', '')
    .split('&')
    .forEach((item) => {
      result[item.split('=')[0]] = item.split('=')[1];
    });
  return result;
};

export const useQueryParam = (paramId: string) => {
  const params = formatSearch(decodeURI(history.location.search));
  return params[paramId] || undefined;
};

export const removeRepeat = (key: string, list: any[], newList: any[]) => {
  let realList: any[] = [];
  if (!Array.isArray(newList)) {
    return realList;
  }
  if (!Array.isArray(list)) {
    return newList;
  }
  for (let i = 0; i < newList.length; i++) {
    let flag = false;
    for (let j = 0; j < list.length; j++) {
      if (newList[i][key] === list[j][key]) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      realList.push(newList[i]);
    }
  }
  return realList;
}
