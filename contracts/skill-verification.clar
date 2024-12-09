;; skill-verification contract

(define-map verified-skills
  { user-id: principal, skill: (string-ascii 50) }
  { verified: bool, verifier: (optional principal) }
)

(define-constant contract-owner tx-sender)

(define-public (verify-skill (user-id principal) (skill (string-ascii 50)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (ok (map-set verified-skills
      { user-id: user-id, skill: skill }
      { verified: true, verifier: (some tx-sender) }
    ))
  )
)

(define-read-only (is-skill-verified (user-id principal) (skill (string-ascii 50)))
  (default-to
    { verified: false, verifier: none }
    (map-get? verified-skills { user-id: user-id, skill: skill })
  )
)

