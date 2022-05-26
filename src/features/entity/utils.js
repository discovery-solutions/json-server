import * as Utils from "utilities/utils";

export function validateByEntityModel(data, { fields }) {
  const modelRequiredTypes = Object.keys(fields).map(key => ({
    type: fields[key]?.type || typeof fields[key],
    required: !!fields[key]?.required,
    key: key,
  })).filter(item => item.required).reduce((obj, item) => {
    if (item.required)
      obj[item.key] = item.type;

    return obj;
  }, {});

  for (let field in modelRequiredTypes) {
    if (typeof data[field] !== modelRequiredTypes[field])
      return false;
  }

  return true;
}

export function getID(url) {
  return url.splitted[1];
}

export async function saveFiles({ files, entity }, entityID) {
  const validKeys = Object.keys(entity.fields);
  const fileKeys = Object.keys(files || {});
  const data = {};

  for (const key of fileKeys) {
    if (validKeys.includes(key)) {
      const file = files[key];

      const name = entityID + "_" + Date.now();
      const filePath = await Utils.saveFile(file, name, "uploads/" + entity.name);

      if (filePath)
        data[key] = "/system/" + filePath;
    }
  }

  return data;
}
