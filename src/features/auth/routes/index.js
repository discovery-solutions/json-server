import { useID, getJSON } from "utilities/utils";
import Databases from "features/databases";
import Requests from "features/requests";
import jwt from "jsonwebtoken";

import AuthTokenHandler from "../token";
import { AUTH } from "../constants";

const ROUTES = AUTH.REQUESTS;
const requests = new Requests();

requests.use(ROUTES.LOGIN.METHOD, ROUTES.LOGIN.PATH, async (req, res) => {
  const database = Databases.get(req.server.database);
  let secret = CONSTANTS.SERVER.SETTINGS.DATABASE.DEFAULT;

  try {
    let entityData = null;
    let entity = null;

    for (const entityItem of getJSON().entities) {
      if (typeof entityItem.auth === "object") {
        await database.setEntity(entityItem.name);
        const records = await database.find(req.body);

        if (records.length > 0) {
          entityData = records[0];
          entity = entityItem;
        }
      }
    }

    if (!entity)
      return false;

    if (entity?.auth?.secret)
      secret = entity.auth.secret;

    // Could not identify credentials
    if (!entityData)
      return (res.statusCode = 401);

    // Generating token
    const access = AuthTokenHandler.generate();
    const id = useID(entityData);

    // Recording access token on DB
    const authTokenHandler = new AuthTokenHandler(req);
    authTokenHandler.register(id, entity.name, access);

    // Signing token
    const authToken = jwt.sign({ access, id }, secret);

    // Returning token
    res.setHeader("x-auth-token", authToken);
    res.payload = {
      [entity.name]: entityData
    }

    return true;
  } catch (e) {
    console.log(e);
    res.statusCode = 500;
  }

  return false;
});
