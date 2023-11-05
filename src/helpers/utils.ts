// @ts-nocheck

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

export const getAll = (speciesData: any) => {
  const { empty, live } = speciesData;
  if (
    typeof empty === "number" ||
    typeof speciesData.undef === "number" ||
    typeof live === "number"
  ) {
    return (
      parseInt(empty || 0) +
      parseInt(speciesData.undef || 0) +
      parseInt(live || 0)
    );
  } else return undefined;
};

export const getOptions = (data, key) => {
  return Object.values(
    data.reduce((acc, cur) => ({ ...acc, [cur[key]]: cur }), {})
  )
    .map((i) => ({
      value: i[key] || "",
      label: i[key] || "",
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};
