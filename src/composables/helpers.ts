export function arraysIntersection(arr1: string[], arr2: string[]) {
  return arr1.filter((el) => arr2.includes(el)).length;
}

export function arrayDeepFilter(array, fn, key) {
  return array.reduce((r, o) => {
    const items = arrayDeepFilter(o[key] || [], fn, key);
    if (fn(o) || items.length)
      r.push(Object.assign({}, o, items.length && { items }));
    return r;
  }, []);
}

export function objectDeepCollect(obj, searchKey) {
  const res = Object.entries(obj).reduce(
    (a, [key, item]) => {
      if (obj[searchKey]?.length && key === searchKey) {
        console.log("found");
        console.log("item", item);
        const ids = item.map((i) => i.id);
        console.log("ids", ids);
        a = [...a, ...ids];
        console.log("a", a);

        objectDeepCollect(item, searchKey);
      }

      return a;
    },
    [obj.id]
  );

  return [...new Set(res)];
}

export function findNestedObj(entireObj, keyToFind, valToFind) {
  let foundObj;
  JSON.stringify(entireObj, (_, nestedValue) => {
    if (nestedValue && nestedValue[keyToFind] === valToFind) {
      foundObj = nestedValue;
    }
    return nestedValue;
  });
  return foundObj;
}
