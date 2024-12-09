;; identity-dao contract

(define-data-var admin principal tx-sender)

(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (ok (var-set admin new-admin))
  )
)

(define-read-only (get-admin)
  (ok (var-get admin))
)

