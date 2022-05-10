import ip from "ip";

export function getJSON() {
  return global["json-server"].json || {};
}

export function getArray(data) {
  if (typeof data === "undefined")
   return []

  if ( Array.isArray(data) )
    return data;

  if ( ["string", "number", "boolean"].includes(typeof data) )
    return [ data ];

  if (typeof data === "object" && Object.keys(data).length > 0)
    return [ data ]

  return [];
}

export function getIP() {
  return ip.address();
}

export function useID(data = {}) {
  return data.id || data._id;
}

export async function asyncTry(callback) {
  try {
    return await Promise.resolve(callback());
  } catch (e) {
    // console.log(e);
  }
}

export function secureEntity(entityData, { fields }) {
  if (!entityData || !fields)
    return entityData;

  const securedKeys = Object.keys(fields).filter(k => fields[k]?.secure === true);

  return Object.keys(entityData).reduce((obj, k) => {
    if ( securedKeys.includes(k) === false )
      obj[k] = entityData[k];

      return obj;
  }, {});
}
