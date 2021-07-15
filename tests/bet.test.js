const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");

const { app } = require("../index");
const { expect } = chai;

console.log = () => {};

chai.use(chaiHttp);

const data = {
  eventId: "154baa1f-2102-4874-a488-aa2713b9c2d3",
  betAmount: 45,
  prediction: "w1",
};

describe("/bets route", () => {
  describe("POST /", async () => {
    it("should create new bet", async () => {
      const token = jwt.sign(
        { type: "client", id: "0f290598-1b54-4a36-8c58-33caa7d08b5f" },
        process.env.JWT_SECRET
      );
      const { status, body } = await chai
        .request(app)
        .post("/bets")
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(200);
      expect(body).to.include.all.keys(
        "id",
        "betAmount",
        "eventId",
        "createdAt",
        "multiplier",
        "prediction",
        "userId",
        "updatedAt",
        "win",
        "currentBalance"
      );
      expect(body.currentBalance).to.be.equal(5);
    });

    it("should return status 400 if prediction field has invalid value", async () => {
      const data = {
        eventId: "154baa1f-2102-4874-a488-aa2713b9c2d3",
        betAmount: 50,
        prediction: "w3",
      };

      const token = jwt.sign(
        { type: "client", id: "0f290598-1b54-4a36-8c58-33caa7d08b5f" },
        process.env.JWT_SECRET
      );
      const { status, body } = await chai
        .request(app)
        .post("/bets")
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal('"prediction" must be one of [w1, w2, x]');
    });

    it("should return status 401 if authorization header is missing", async () => {
      const { status, body } = await chai.request(app).post("/bets").send(data);

      expect(status).to.be.equal(401);
      expect(body.error).to.be.equal("Not Authorized");
    });

    it("should return status 400 if user does not exist", async () => {
      const data = {
        eventId: "154baa1f-2102-4874-a488-aa2713b9c2d3",
        betAmount: 45,
        prediction: "w1",
      };

      const token = jwt.sign(
        { type: "client", id: "e4a9d82f-97f3-4e3d-adf9-09de4148a744" },
        process.env.JWT_SECRET
      );
      const { status, body } = await chai
        .request(app)
        .post("/bets")
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal("User does not exist");
    });

    it("should return status 404 if event does not exist", async () => {
      const data = {
        eventId: "e072aba5-92e7-41bd-8025-97a4f4308b9c",
        betAmount: 1,
        prediction: "w1",
      };

      const token = jwt.sign(
        { type: "client", id: "0f290598-1b54-4a36-8c58-33caa7d08b5f" },
        process.env.JWT_SECRET
      );
      const { status, body } = await chai
        .request(app)
        .post("/bets")
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(404);
      expect(body.error).to.be.equal("Event not found");
    });

    it("should return status 400 if user does not have enough balance", async () => {
      const data = {
        eventId: "154baa1f-2102-4874-a488-aa2713b9c2d3",
        betAmount: 150,
        prediction: "w1",
      };

      const token = jwt.sign(
        { type: "client", id: "0f290598-1b54-4a36-8c58-33caa7d08b5f" },
        process.env.JWT_SECRET
      );
      const { status, body } = await chai
        .request(app)
        .post("/bets")
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal("Not enough balance");
    });
  });
});
