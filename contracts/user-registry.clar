;; user-registry contract

(define-map users
  { user-id: principal }
  {
    username: (string-ascii 50),
    role: (string-ascii 10),
    skills: (list 10 (string-ascii 50)),
    reputation-score: uint
  }
)

(define-public (register-user (username (string-ascii 50)) (role (string-ascii 10)) (skills (list 10 (string-ascii 50))))
  (let
    (
      (user-id tx-sender)
    )
    (asserts! (is-none (map-get? users { user-id: user-id })) (err u403)) ;; User already exists
    (ok (map-set users
      { user-id: user-id }
      {
        username: username,
        role: role,
        skills: skills,
        reputation-score: u0
      }
    ))
  )
)

(define-read-only (get-user (user-id principal))
  (map-get? users { user-id: user-id })
)

(define-public (update-skills (new-skills (list 10 (string-ascii 50))))
  (let
    (
      (user-id tx-sender)
      (user (unwrap! (map-get? users { user-id: user-id }) (err u404))) ;; User not found
    )
    (ok (map-set users
      { user-id: user-id }
      (merge user { skills: new-skills })
    ))
  )
)

