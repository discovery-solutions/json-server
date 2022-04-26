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
