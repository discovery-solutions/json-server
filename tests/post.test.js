import LocalStorage from "features/databases/custom/LocalStorage";
import { DB, POST } from "utilities/tests/constants";
import { ObjectId } from "mongodb";
import axios from "utilities/tests/axios";

// Setting up post for tests
const localStorage = new LocalStorage(DB);
localStorage.setEntity(POST.name);

const id = new ObjectId();
const post = {
  title: "My Post Title",
  body: "My Body Post",
  id: id,
}

describe("Entity Routes Without Authentication", () => {
  const validateResponse = ({ data }, testFor) => {
    switch (testFor) {
      case "success": {
        expect(data?.status).toBe(true);
        expect(data?.code).toBe(200);
        expect(typeof data.message).toBe("string");
        expect(typeof (data.post || data.records)).toBe("object");
        expect(Object.keys(data.post || data.records).length).toBeTruthy();
        break;
      }
      case "error":
      default: {
        expect(data?.status).toBe(false);
        expect(data?.code).toBe(401);
        expect(typeof data.message).toBe("string");
      }
    }
  }

  beforeAll(() => {
    localStorage.add(post);
  });

  test("POST /post", async () => {
    const res = await axios.post("/post", post);

    validateResponse(res, "error");

  });

  test("PATCH /post/" + id, async () => {
    const res = await axios.patch("/post/" + id, {
      title: "Post title updated"
    });

    validateResponse(res, "error");
  });

  test("GET /post/" + id, async () => {
    const res = await axios.get("/post/" + id);

    validateResponse(res, "success");
  });

  test("GET /post", async () => {
    const res = await axios.get("/post");

    validateResponse(res, "success");
  });

  test("GET /post/oldest", async () => {
    const res = await axios.get("/post");

    validateResponse(res, "success");
  });

  test("GET /post/latest", async () => {
    const res = await axios.get("/post");

    validateResponse(res, "success");
  });

  test("DELETE /post/" + id, async () => {
    const res = await axios.delete("/post/" + id);

    validateResponse(res, "error");
  });

  afterAll(() => {
    localStorage.set(
      localStorage.getAll().filter(item => item.title !== post.title)
    );
  });
});
