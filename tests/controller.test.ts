import {
  describe,
  beforeEach,
  it,
  run,
  assertEquals,
  Account,
  Tx,
} from "../deps.ts";
import { Context } from "../src/context.ts";
import { Controller } from "../models/controller.model.ts";
import { Bns } from "../models/bns.model.ts";

describe("[CONTROLLER]", () => {
  let ctx: Context;
  let bns: Bns;
  let controller: Controller;

  beforeEach(() => {
    ctx = new Context();
    bns = ctx.models.get(Bns);
    controller = ctx.models.get(Controller);
  });

  describe("buy-namespace()", () => {
    it("works", () => {
      const namespace = "hello";
      const name = "world";

      const namespaceOwner = ctx.accounts.get("wallet_1")!;
      const nameBuyer = ctx.accounts.get("wallet_3")!;

      // let's buy namespace and make it ultra expensive
      ctx.chain.mineBlock([
        controller.buyNamespace(namespace, namespaceOwner),
        controller.revealNamespace(namespace, namespaceOwner),
      ]);

      // let's see what is the price of buying simple name in our new namespace
      // I don't think we can afford it...
      console.table({ price: bns.getNamePrice(namespace, name).expectOk() });

      // but let's try to buy it via controller contract only for 10 uSTX
      let buyReceipt = ctx.chain.mineBlock([
        controller.buyName(namespace, name, nameBuyer),
      ]).receipts[0];

      buyReceipt.events.expectSTXTransferEvent(
        10,
        nameBuyer.address,
        "STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6"
      );

      // let's see all events
      console.info(buyReceipt.events);

      // 10 uSTX? Let's check it again
      console.table({ price: bns.getNamePrice(namespace, name).expectOk() });
    });
  });
});

run();
