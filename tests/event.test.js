const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");

const { app } = require("../index");
const { expect } = chai;

console.log = () => {};

chai.use(chaiHttp);

const data = {
  type: "football",
  homeTeam: "Ukraine",
  awayTeam: "Netherlands",
  startAt: "2021-06-13T22:22:09.900Z",
  odds: {
    homeWin: 1.2,
    awayWin: 3.0,
    draw: 2.8,
  },
};

describe("/events route", () => {
  describe("POST /", async () => {
    it("should create new event", async () => {
      const token = jwt.sign({ type: "admin" }, process.env.JWT_SECRET);
      const { status, body } = await chai
        .request(app)
        .post("/events")
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(200);
      expect(body).to.include.all.keys(
        "id",
        "awayTeam",
        "homeTeam",
        "oddsId",
        "score",
        "startAt",
        "type",
        "updatedAt",
        "odds"
      );
      expect(body.odds).to.include.all.keys(
        "id",
        "homeWin",
        "draw",
        "awayWin",
        "createdAt",
        "updatedAt"
      );
    });

    it("should return status 400 if odds field has invalid value", async () => {
      const data = {
        type: "football",
        homeTeam: "Ukraine",
        awayTeam: "Netherlands",
        startAt: "2021-06-13T22:22:09.900Z",
        odds: {
          homeWin: "1",
          awayWin: 3.0,
          draw: 2.8,
        },
      };

      const token = jwt.sign({ type: "admin" }, process.env.JWT_SECRET);
      const { status, body } = await chai
        .request(app)
        .post("/events")
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal(
        '"odds.homeWin" must be greater than or equal to 1.01'
      );
    });

    it("should return status 401 if authorization header is missing", async () => {
      const { status, body } = await chai
        .request(app)
        .post("/events")
        .send(data);

      expect(status).to.be.equal(401);
      expect(body.error).to.be.equal("Not Authorized");
    });

    it("should return status 401 for not admin's token", async () => {
      const token = jwt.sign({ type: "client" }, process.env.JWT_SECRET);
      const { status, body } = await chai
        .request(app)
        .post("/events")
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(401);
      expect(body.error).to.be.equal("Not Authorized");
    });
  });

  describe("PUT /:id", async () => {
    const data = {
      score: "2:1",
    };

    it("should update existing event and calculate all bets", async () => {
      const token = jwt.sign({ type: "admin" }, process.env.JWT_SECRET);
      const { status, body } = await chai
        .request(app)
        .put(`/events/154baa1f-2102-4874-a488-aa2713b9c2d3`)
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(200);
      expect(body).to.include.all.keys(
        "id",
        "awayTeam",
        "homeTeam",
        "oddsId",
        "score",
        "startAt",
        "type",
        "updatedAt",
        "createdAt"
      );
      expect(body.score).to.be.equal(data.score);

      const userId = "860329e2-ae5c-49f4-ba8b-38c49c6e1838";
      const { body: user } = await chai.request(app).get(`/users/${userId}`);
      expect(user.balance).to.be.equal(140);
    }).timeout(5000);

    it("should return status 400 if score field has invalid value", async () => {
      const data = {
        score: 1,
      };
      const token = jwt.sign({ type: "admin" }, process.env.JWT_SECRET);
      const { status, body } = await chai
        .request(app)
        .put(`/events/154baa1f-2102-4874-a488-aa2713b9c2d3`)
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal('"score" must be a string');
    });

    it("should return status 401 if authorization header is missing", async () => {
      const { status, body } = await chai
        .request(app)
        .put(`/events/154baa1f-2102-4874-a488-aa2713b9c2d3`)
        .send(data);

      expect(status).to.be.equal(401);
      expect(body.error).to.be.equal("Not Authorized");
    });

    it("should return status 401 for not admin's token", async () => {
      const token = jwt.sign({ type: "client" }, process.env.JWT_SECRET);
      const { status, body } = await chai
        .request(app)
        .put(`/events/154baa1f-2102-4874-a488-aa2713b9c2d3`)
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(401);
      expect(body.error).to.be.equal("Not Authorized");
    });
  });
});
