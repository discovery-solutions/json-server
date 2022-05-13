import fs from "fs";
import path from "path";
// import { getJSON } from "utilities/utils";
import Requests from "features/requests";
import { DOCS, MIME_TYPES } from "./constants";

const requests = new Requests();
const defaultFile = "index.html";
// https://github.com/floriannicolas/API-Documentation-HTML-Template

requests.use(DOCS.ROUTES.DOCS, async (req, res) => {
  const ext = path.parse(req.url.base)?.ext;

  res.setHeader("Content-Type", MIME_TYPES[ext || ".html"]);

  if (req.url.base.slice(-1) !== "/" && !ext) {
    const redirectURL = `http${req.socket.encrypted ? "s" : ""}://${req.headers.host + req.url.base}/`;

    res.statusCode = 302;
    res.setHeader("Location", redirectURL);

    return true;
  }

  const sanitized = path.normalize(req.url.base).replace("/system/docs", "");
  const filepath = ["", "/"].includes(sanitized) ? defaultFile : sanitized;

  res.payload = fs.readFileSync( path.join(__dirname, "files", filepath) );
  return true;
});
