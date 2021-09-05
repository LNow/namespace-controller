import { Account, Chain, types } from "../deps.ts";
import { Model } from "../src/model.ts";

enum Err {
  ERR_PANIC = 0,
  ERR_NAMESPACE_PREORDER_NOT_FOUND = 1001,
  ERR_NAMESPACE_PREORDER_EXPIRED = 1002,
  ERR_NAMESPACE_PREORDER_ALREADY_EXISTS = 1003,
  ERR_NAMESPACE_UNAVAILABLE = 1004,
  ERR_NAMESPACE_NOT_FOUND = 1005,
  ERR_NAMESPACE_ALREADY_EXISTS = 1006,
  ERR_NAMESPACE_NOT_LAUNCHED = 1007,
  ERR_NAMESPACE_PRICE_FUNCTION_INVALID = 1008,
  ERR_NAMESPACE_PREORDER_CLAIMABILITY_EXPIRED = 1009,
  ERR_NAMESPACE_PREORDER_LAUNCHABILITY_EXPIRED = 1010,
  ERR_NAMESPACE_OPERATION_UNAUTHORIZED = 1011,
  ERR_NAMESPACE_STX_BURNT_INSUFFICIENT = 1012,
  ERR_NAMESPACE_BLANK = 1013,
  ERR_NAMESPACE_ALREADY_LAUNCHED = 1014,
  ERR_NAMESPACE_HASH_MALFORMED = 1015,
  ERR_NAMESPACE_CHARSET_INVALID = 1016,

  ERR_NAME_PREORDER_NOT_FOUND = 2001,
  ERR_NAME_PREORDER_EXPIRED = 2002,
  ERR_NAME_PREORDER_FUNDS_INSUFFICIENT = 2003,
  ERR_NAME_UNAVAILABLE = 2004,
  ERR_NAME_OPERATION_UNAUTHORIZED = 2006,
  ERR_NAME_STX_BURNT_INSUFFICIENT = 2007,
  ERR_NAME_EXPIRED = 2008,
  ERR_NAME_GRACE_PERIOD = 2009,
  ERR_NAME_BLANK = 2010,
  ERR_NAME_ALREADY_CLAIMED = 2011,
  ERR_NAME_CLAIMABILITY_EXPIRED = 2012,
  ERR_NAME_NOT_FOUND = 2013,
  ERR_NAME_REVOKED = 2014,
  ERR_NAME_TRANSFER_FAILED = 2015,
  ERR_NAME_PREORDER_ALREADY_EXISTS = 2016,
  ERR_NAME_HASH_MALFORMED = 2017,
  ERR_NAME_PREORDERED_BEFORE_NAMESPACE_LAUNCH = 2018,
  ERR_NAME_NOT_RESOLVABLE = 2019,
  ERR_NAME_COULD_NOT_BE_MINTED = 2020,
  ERR_NAME_COULD_NOT_BE_TRANSFERED = 2021,
  ERR_NAME_CHARSET_INVALID = 2022,

  ERR_PRINCIPAL_ALREADY_ASSOCIATED = 3001,
  ERR_INSUFFICIENT_FUNDS = 4001,
}

export class Bns extends Model {
  name: string = "bns";

  static Err = Err;

  // read-only functions

  getNamespacePrice(namespace: BufferVal) {
    return this.callReadOnly("get-namespace-price", [
      types.buff(toArrayBuff(namespace)),
    ]).result;
  }

  getNamePrice(namespace: BufferVal, name: BufferVal) {
    return this.callReadOnly("get-name-price", [
      types.buff(toArrayBuff(namespace)),
      types.buff(toArrayBuff(name)),
    ]).result;
  }

  checkNameOpsPreconditions(namespace: BufferVal, name: BufferVal) {
    return this.callReadOnly("check-name-ops-preconditions", [
      types.buff(toArrayBuff(namespace)),
      types.buff(toArrayBuff(name)),
    ]).result;
  }

  canNamespaceBeRegistered(namespace: BufferVal) {
    return this.callReadOnly("can-namespace-be-registered", [
      types.buff(toArrayBuff(namespace)),
    ]).result;
  }

  isNameLeaseExpired(namespace: BufferVal, name: BufferVal) {
    return this.callReadOnly("is-name-lease-expired", [
      types.buff(toArrayBuff(namespace)),
      types.buff(toArrayBuff(name)),
    ]).result;
  }

  isNameInGracePeriod(namespace: BufferVal, name: BufferVal) {
    return this.callReadOnly("is-name-in-grace-period", [
      types.buff(toArrayBuff(namespace)),
      types.buff(toArrayBuff(name)),
    ]).result;
  }

  resolvePrincipal(owner: string | Account) {
    return this.callReadOnly("resolve-principal", [
      types.principal(typeof owner === "string" ? owner : owner.address),
    ]).result;
  }

  canReceiveName(owner: string | Account) {
    return this.callReadOnly("can-receive-name", [
      types.principal(typeof owner === "string" ? owner : owner.address),
    ]).result;
  }

  canNameBeRegistered(namespace: BufferVal, name: BufferVal) {
    return this.callReadOnly("can-name-be-registered", [
      types.buff(toArrayBuff(namespace)),
      types.buff(toArrayBuff(name)),
    ]).result;
  }

  nameResolve(namespace: BufferVal, name: BufferVal) {
    return this.callReadOnly("name-resolve", [
      types.buff(toArrayBuff(namespace)),
      types.buff(toArrayBuff(name)),
    ]).result;
  }

  getNamespaceProperties(namespace: BufferVal) {
    return this.callReadOnly("get-namespace-properties", [
      types.buff(toArrayBuff(namespace)),
    ]).result;
  }

  // public functions

  namespacePreOrder(
    hashedSaltedNamespace: BufferVal,
    stxToBurn: number,
    sender: Account
  ) {
    return this.callPublic(
      "namespace-preorder",
      [types.buff(toArrayBuff(hashedSaltedNamespace)), types.uint(stxToBurn)],
      sender
    );
  }

  namespaceReveal(
    namespace: BufferVal,
    namespaceSalt: BufferVal,
    priceFunction: PriceFunc,
    lifetime: number,
    namespaceImport: string | Account,
    sender: Account
  ) {
    const args = new Array();

    args.push([
      types.buff(toArrayBuff(namespace)),
      types.buff(toArrayBuff(namespaceSalt)),
    ]);

    Object.entries(priceFunction).forEach(([key, value]) => {
      args.push(value as number);
    });

    args.push([
      types.uint(lifetime),
      types.principal(
        typeof namespaceImport === "string"
          ? namespaceImport
          : namespaceImport.address
      ),
    ]);

    return this.callPublic("namespace-reveal", args, sender);
  }

  nameImport(
    namespace: BufferVal,
    name: BufferVal,
    beneficiary: string | Account,
    zoneFileHash: BufferVal,
    sender: Account
  ) {
    return this.callPublic(
      "name-import",
      [
        types.buff(toArrayBuff(namespace)),
        types.buff(toArrayBuff(name)),
        types.principal(
          typeof beneficiary === "string" ? beneficiary : beneficiary.address
        ),
        types.buff(toArrayBuff(zoneFileHash)),
      ],
      sender
    );
  }

  namespaceReady(namespace: BufferVal, sender: Account) {
    return this.callPublic(
      "namespace-ready",
      [types.buff(toArrayBuff(namespace))],
      sender
    );
  }

  namespaceUpdateFunctionPrice(
    namespace: BufferVal,
    priceFunction: PriceFunc,
    sender: Account
  ) {
    const args = new Array();
    args.push(types.buff(toArrayBuff(namespace)));

    Object.entries(priceFunction).forEach(([key, value]) => {
      args.push(value as number);
    });

    return this.callPublic("namespace-update-function-price", args, sender);
  }

  namespaceRevokeFunctionPriceEdition(namespace: BufferVal, sender: Account) {
    return this.callPublic(
      "namespace-revoke-function-price-edition",
      [types.buff(toArrayBuff(namespace))],
      sender
    );
  }

  namePreOrder(hashedSaltedFqn: BufferVal, stxToBurn: number, sender: Account) {
    return this.callPublic(
      "name-preorder",
      [types.buff(toArrayBuff(hashedSaltedFqn)), types.uint(stxToBurn)],
      sender
    );
  }

  nameRegister(
    namespace: BufferVal,
    name: BufferVal,
    salt: BufferVal,
    zoneFileHash: BufferVal,
    sender: Account
  ) {
    return this.callPublic(
      "name-register",
      [
        types.buff(toArrayBuff(namespace)),
        types.buff(toArrayBuff(name)),
        types.buff(toArrayBuff(salt)),
        types.buff(toArrayBuff(zoneFileHash)),
      ],
      sender
    );
  }

  nameUpdate(
    namespace: BufferVal,
    name: BufferVal,
    zoneFileHash: BufferVal,
    sender: Account
  ) {
    return this.callPublic(
      "name-update",
      [
        types.buff(toArrayBuff(namespace)),
        types.buff(toArrayBuff(name)),
        types.buff(toArrayBuff(zoneFileHash)),
      ],
      sender
    );
  }

  nameTransfer(
    namespace: BufferVal,
    name: BufferVal,
    newOwner: string | Account,
    zoneFileHash: BufferVal,
    sender: Account
  ) {
    return this.callPublic(
      "name-transfer",
      [
        types.buff(toArrayBuff(namespace)),
        types.buff(toArrayBuff(name)),
        types.principal(
          typeof newOwner === "string" ? newOwner : newOwner.address
        ),
        types.buff(toArrayBuff(zoneFileHash)),
      ],
      sender
    );
  }

  nameRevoke(namespace: BufferVal, name: BufferVal, sender: Account) {
    return this.callPublic(
      "name-revoke",
      [types.buff(toArrayBuff(namespace)), types.buff(toArrayBuff(name))],
      sender
    );
  }

  nameRenewal(
    namespace: BufferVal,
    name: BufferVal,
    stxToBurn: number,
    newOwner: string | Account | undefined,
    zoneFileHash: BufferVal | undefined,
    sender: Account
  ) {
    return this.callPublic(
      "name-renewal",
      [
        types.buff(toArrayBuff(namespace)),
        types.buff(toArrayBuff(name)),
        types.uint(stxToBurn),
        typeof newOwner === "undefined"
          ? types.none()
          : types.some(
              types.principal(
                typeof newOwner === "string" ? newOwner : newOwner.address
              )
            ),
        typeof zoneFileHash === "undefined"
          ? types.none()
          : types.some(types.buff(toArrayBuff(zoneFileHash))),
      ],
      sender
    );
  }
}

type BufferVal = string | ArrayBuffer;

function toArrayBuff(val: string | ArrayBuffer): ArrayBuffer {
  return typeof val === "string" ? new TextEncoder().encode(val) : val;
}

export interface PriceFunc {
  base: number;
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  b5: number;
  b6: number;
  b7: number;
  b8: number;
  b9: number;
  b10: number;
  b11: number;
  b12: number;
  b13: number;
  b14: number;
  b15: number;
  b16: number;
  nonAlphaDiscount: number;
  noVowelDiscount: number;
}
