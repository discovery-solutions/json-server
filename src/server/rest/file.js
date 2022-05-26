import EventListener, { Events } from "utilities/event-listener";
import { MIME_TYPES } from "features/docs/constants";
import * as Utils from "utilities/utils";
import Requests from "features/requests";
import busboy from "busboy";
import path from "path";
import os from "os";
import fs from "fs";

const eventListener = new EventListener(Events.REQUEST.BEFORE.PROCESS);
const requests = new Requests();

eventListener.set(async function fileUpload(req, res) {

  const hasAllowedMethod = [CONSTANTS.SERVER.METHODS.UPDATE].includes(req.method);
  const isAuthenticated = !!req.auth;
  const hasHeaders = !!req.headers["content-type"];

  if (hasAllowedMethod === false || isAuthenticated === false || hasHeaders === false)
    return true;

  const bb = busboy({ headers: req.headers });
  req.files = {};

  await new Promise(resolve => {
    bb.on("file", (name, file, info) => {
      const filePath = path.join(os.tmpdir(), info.filename);
      const stream = fs.createWriteStream(filePath);

      file.pipe(stream);

      stream.on("close", () => {
        req.files[name] = {
          ...info,
          move: newPath => fs.renameSync(filePath, newPath),
        };

        const contentLength = parseInt(req.headers["content-length"]);
        const bytesWritten = parseInt(stream.bytesWritten);

        file.resume();

        if ( (contentLength / bytesWritten) < 1.1 )
          resolve();
      });
    });

    req.pipe(bb);
  });
});

requests.get("/system/uploads", { public: true }, async function fileServer(req, res) {
  const filepath = req.url.value.replace("/system/uploads/", "");
  const ext = path.parse(req.url.base)?.ext;

  res.setHeader("Content-Type", MIME_TYPES[ext || ".html"]);
  res.payload = fs.readFileSync( path.join("uploads", filepath) );
});
