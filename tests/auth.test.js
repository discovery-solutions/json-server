import LocalStorage from "features/databases/custom/LocalStorage";
import { DB, USER } from "utilities/tests/constants";
import { ObjectId } from "mongodb";
import axios from "utilities/tests/axios";

// Setting up user to authenticate
const localStorage = new LocalStorage(DB);
localStorage.setEntity(USER.name);

let token, id;
const user = {
  id: new ObjectId(),
  name: "My User Name",
  email: "user-email@email.com",
  password: "my-password-1",
}

describe("Entity Routes With Valid Authentication", () => {
  beforeAll(() => {
    localStorage.add(user);
  });

  test("POST /system/auth", async () => {
    const { data, headers } = await axios.post("/system/auth", user);

    expect(typeof headers["x-auth-token"]).toBe("string");
    expect(headers["x-auth-token"]?.length).toBeTruthy();

    expect(data?.status).toBe(true);
    expect(data?.code).toBe(200);
    expect(typeof data?.message).toBe("string");
  });
});
