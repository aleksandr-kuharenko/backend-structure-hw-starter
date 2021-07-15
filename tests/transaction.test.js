const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");

const { app } = require("../index");
const { expect } = chai;

console.log = () => {};

chai.use(chaiHttp);

describe("/transactions route", () => {
  describe("POST /", async () => {
    it("should create new transaction", async () => {
      const data = {
        userId: "c486ab55-5c4b-4689-8f57-ace155ea65b4",
        cardNumber: "111111111111",
        amount: 50,
      };

      const token = jwt.sign({ type: "admin" }, process.env.JWT_SECRET);
      const { status, body } = await chai
        .request(app)
        .post("/transactions")
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(200);
      expect(body).to.include.all.keys(
        "id",
        "amount",
        "cardNumber",
        "createdAt",
        "currentBalance",
        "updatedAt",
        "userId"
      );
      expect(body.currentBalance).to.be.equal(50);
    });

    it("should return status 400 if amount has invalid value", async () => {
      const data = {
        userId: "c486ab55-5c4b-4689-8f57-ace155ea65b4",
        cardNumber: "111111111111",
        amount: -1,
      };

      const token = jwt.sign({ type: "admin" }, process.env.JWT_SECRET);
      const { status, body } = await chai
        .request(app)
        .post("/transactions")
        .set("authorization", `Bearer ${token}`)
        .send(data);

      expect(status).to.be.equal(400);
      expect(body.error).to.be.equal(
        '"amount" must be greater than or equal to 0'
      );
    });

    it("should return status 401 if authorization header is missing", async () => {
      const data = {
        userId: "c486ab55-5c4b-4689-8f57-ace155ea65b4",
        cardNumber: "111111111111",
        amount: 50,
      };

      const { status, body } = await chai
        .request(app)
        .post("/transactions")
        .send(data);

      expect(status).to.be.equal(401);
      expect(body.error).to.be.equal("Not Authorized");
    });

    it("should return status 401 for not admin's token", async () => {
        const data = {
          userId: "c486ab55-5c4b-4689-8f57-ace155ea65b4",
          cardNumber: "111111111111",
          amount: 50,
        };
  
        const token = jwt.sign({ type: "client" }, process.env.JWT_SECRET);
        const { status, body } = await chai
          .request(app)
          .post("/transactions")
          .set("authorization", `Bearer ${token}`)
          .send(data);
  
        expect(status).to.be.equal(401);
        expect(body.error).to.be.equal("Not Authorized");
      });

      it("should return status 400 if user does not exist", async () => {
        const data = {
          userId: "5d16d28f-f190-4e74-89bb-0fc1455d7cc6",
          cardNumber: "111111111111",
          amount: 50,
        };
  
        const token = jwt.sign({ type: "admin" }, process.env.JWT_SECRET);
        const { status, body } = await chai
          .request(app)
          .post("/transactions")
          .set("authorization", `Bearer ${token}`)
          .send(data);
  
        expect(status).to.be.equal(400);
        expect(body.error).to.be.equal("User does not exist");
      });
  });
});
