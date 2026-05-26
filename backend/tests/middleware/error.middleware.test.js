const errorMiddleware = require("../../middleware/error.middleware");

describe("error middleware", () => {
  it("uses statusCode when provided", () => {
    const err = { statusCode: 400, message: "Bad" };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    errorMiddleware(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Bad" });
  });

  it("uses status when statusCode is missing", () => {
    const err = { status: 401, message: "Unauthorized" };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    errorMiddleware(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Unauthorized" });
  });

  it("defaults to 500 and generic message", () => {
    const err = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    errorMiddleware(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });
});
