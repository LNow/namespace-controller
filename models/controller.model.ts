import { Account, types } from "../deps.ts";
import { Model } from "../src/model.ts";

enum Err {
  ERR_NOT_AUTHORIZED = 1001,
}

export class Controller extends Model {
  name: string = "controller";

  static Err = Err;

  buyNamespace(namespace: string, sender: Account) {
    return this.callPublic(
      "buy-namespace",
      [types.buff(new TextEncoder().encode(namespace))],
      sender
    );
  }

  revealNamespace(namespace: string, sender: Account) {
    return this.callPublic(
      "reveal-namespace",
      [types.buff(new TextEncoder().encode(namespace))],
      sender
    );
  }

  buyName(namespace: string, name: string, sender: Account) {
    return this.callPublic(
      "buy-name",
      [
        types.buff(new TextEncoder().encode(namespace)),
        types.buff(new TextEncoder().encode(name)),
      ],
      sender
    );
  }
}
