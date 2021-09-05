(define-constant CONTRACT_OWNER tx-sender)
(define-constant CONTRACT_ADDRESS (as-contract tx-sender))
(define-constant DEPLOYED_AT block-height)

(define-constant ERR_NOT_AUTHORIZED (err u1001))

(define-constant DEFAULT_SALT 0x12ff12aa12dd12bb)
(define-constant PRICE_COMPONENT u20)
(define-constant LIFETIME u20000)

;; TRUE BNS ADDRESS = 'ST000000000000000000002AMW42H.bns


(define-public (buy-namespace (namespace (buff 20)))
  (match (contract-call? .bns get-namespace-price namespace) price
    (contract-call? .bns namespace-preorder (hash160 (concat namespace DEFAULT_SALT)) price)
    error (err error)
  )
)

(define-public (reveal-namespace (namespace (buff 20)))
  (begin
    (try! (contract-call? .bns namespace-reveal
      namespace
      DEFAULT_SALT
      PRICE_COMPONENT ;; p-func-base
      PRICE_COMPONENT ;; p-func-coeff
      PRICE_COMPONENT ;; p-func-b1
      PRICE_COMPONENT ;; p-func-b2
      PRICE_COMPONENT ;; p-func-b3
      PRICE_COMPONENT ;; p-func-b4
      PRICE_COMPONENT ;; p-func-b5
      PRICE_COMPONENT ;; p-func-b6
      PRICE_COMPONENT ;; p-func-b7
      PRICE_COMPONENT ;; p-func-b8
      PRICE_COMPONENT ;; p-func-b9
      PRICE_COMPONENT ;; p-func-b10
      PRICE_COMPONENT ;; p-func-b11
      PRICE_COMPONENT ;; p-func-b12
      PRICE_COMPONENT ;; p-func-b13
      PRICE_COMPONENT ;; p-func-b14
      PRICE_COMPONENT ;; p-func-b15
      PRICE_COMPONENT ;; p-func-b16
      u0 ;; p-func-non-alpha-discount
      u0 ;; p-func-no-vowel-discount
      LIFETIME ;; lifetime
      CONTRACT_ADDRESS ;; namespace-import
    ))
    (as-contract (contract-call? .bns namespace-ready namespace))
  )
)

(define-private (do-some-magic (namespace (buff 20)))
  (as-contract (contract-call? .bns namespace-update-function-price namespace
    u0 ;; p-func-base
    u1 ;; p-func-coeff
    u0 ;; p-func-b1
    u0 ;; p-func-b2
    u0 ;; p-func-b3
    u0 ;; p-func-b4
    u0 ;; p-func-b5
    u0 ;; p-func-b6
    u0 ;; p-func-b7
    u0 ;; p-func-b8
    u0 ;; p-func-b9
    u0 ;; p-func-b10
    u0 ;; p-func-b11
    u0 ;; p-func-b12
    u0 ;; p-func-b13
    u0 ;; p-func-b14
    u0 ;; p-func-b15
    u0 ;; p-func-b16
    u0 ;; p-func-non-alpha-discount
    u0 ;; p-func-no-vowel-discount
  ))
)

(define-private (rollback-magic (namespace (buff 20)))
  (as-contract (contract-call? .bns namespace-update-function-price namespace
    PRICE_COMPONENT ;; p-func-base
    PRICE_COMPONENT ;; p-func-coeff
    PRICE_COMPONENT ;; p-func-b1
    PRICE_COMPONENT ;; p-func-b2
    PRICE_COMPONENT ;; p-func-b3
    PRICE_COMPONENT ;; p-func-b4
    PRICE_COMPONENT ;; p-func-b5
    PRICE_COMPONENT ;; p-func-b6
    PRICE_COMPONENT ;; p-func-b7
    PRICE_COMPONENT ;; p-func-b8
    PRICE_COMPONENT ;; p-func-b9
    PRICE_COMPONENT ;; p-func-b10
    PRICE_COMPONENT ;; p-func-b11
    PRICE_COMPONENT ;; p-func-b12
    PRICE_COMPONENT ;; p-func-b13
    PRICE_COMPONENT ;; p-func-b14
    PRICE_COMPONENT ;; p-func-b15
    PRICE_COMPONENT ;; p-func-b16
    u0 ;; p-func-non-alpha-discount
    u0 ;; p-func-no-vowel-discount
  ))
)


(define-public (buy-name (namespace (buff 20)) (name (buff 48)))
  (let
    (
      (hashed-salted-fqn (hash160 (concat (concat (concat name 0x2e) namespace) DEFAULT_SALT)))
    )

    (try! (do-some-magic namespace))
    (try! (contract-call? .bns name-preorder hashed-salted-fqn u10))
    (try! (contract-call? .bns name-register namespace name DEFAULT_SALT 0x00))
    (rollback-magic namespace)
  )
)
