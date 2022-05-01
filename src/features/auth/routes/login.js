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

    // Could not identify credentials
    if (!entityData || !entity)
      return (res.statusCode = 401);

    if (entity?.auth?.secret)
      secret = entity.auth.secret;

    // Generating token
    const authTokenHandler = new AuthTokenHandler(req);

    const id = useID(entityData);
    const access = authTokenHandler.generate();

    // Signing token
    const authToken = (entity?.auth?.type !== "jwt") ? access : jwt.sign({ access, id }, secret);

    // Recording access token on DB
    await authTokenHandler.register(id, entity.name, authToken);

    // Returning token
    res.setHeader("x-auth-token", authToken);
    res.payload = {
      [entity.name]: entityData
    }

    return true;
  } catch (e) {
    logger(e);
    res.statusCode = 500;
  }

  return false;
});
