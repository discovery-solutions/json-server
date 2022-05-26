import { Entities } from "utilities/constants";
import path from "path";
import os from "os";
import fs from "fs";
import ip from "ip";

export function getJSON() {
  return global["json-server"] || {};
}

export function setJSON(json) {
  global["json-server"] = json;
}

export function injectJSON(json) {
  if (typeof json.dashboard === "object")
    json.entities.push(Entities.ADMIN);

  return json;
}

export function isFile(filename) {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : [];
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
    // logger(e);
  }
}

export function secureEntity(entityData, { fields }) {
  const type = (!entityData || !fields) ? "invalid" : Array.isArray(entityData) ? "array" : "valid";

  switch (type) {
    case "invalid": {
      return entityData;
    }
    case "array": {
      const res = [];

      for (const item of entityData)
        res.push( secureEntity(item, { fields }) );

      return res;
    }
    default: {
      const securedKeys = Object.keys(fields).filter(k => fields[k]?.secure === true);

      return Object.keys(entityData).reduce((obj, k) => {
        if ( securedKeys.includes(k) === false )
          obj[k] = entityData[k];

          return obj;
      }, {});
    }
  }
}

export function createURL(req, base = "") {
  return `http${req.socket.encrypted ? "s" : ""}://${req.headers.host + base}/`
}

export async function saveFile(file, name, directory) {
  const extension = file.filename.split(".")[1];
  const fileName = [name, extension].join(".");
  const filePath = path.join( directory, fileName );

  if (!fs.existsSync(directory))
    fs.mkdirSync(directory, { recursive: true });

  try {
    file.move(filePath);
    return filePath;
  } catch (e) {
    console.log(e);
    return false;
  }
}
