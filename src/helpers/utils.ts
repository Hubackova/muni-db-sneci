export const nullFunction = () => null;

export const getLocalityName = (localities: any[], key: string) =>
  localities.find((i) => i.key === key)?.siteId;

export function removeUndefinedKeys(obj: any) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}

export const getValueFromOptions = (value: any, options: any) =>
  options.find((i: any) => i.value === value);
