# LearnQuest Backend

Go + Gin + SQLite. No external services required — no Firebase project, no
Postgres server, nothing to configure. It creates `learnquest.db` in this
folder the first time you run it and seeds it with sample Physics · Waves
content so there's real data to practice with immediately.

## Run it

```bash
go mod tidy    # downloads gin, gorm, jwt, bcrypt, etc. — needs internet access
go run main.go
```

You should see:
```
Database seeded with sample Physics · Waves content
LearnQuest backend running on http://localhost:8080
```

Check it's alive: `curl http://localhost:8080/health` → `{"status":"ok"}`

If `go mod tidy` or `go run` errors out, send me the exact error — I wrote
this without being able to compile it myself (no Go installed, no internet,
in the environment I built it in), so there's a real chance of a typo
somewhere and I'd rather fix it in one message than have you debug Go
tooling under a deadline.

## Environment variables (all optional — sensible defaults are baked in)

| Variable       | Default                  | Purpose                              |
|----------------|---------------------------|---------------------------------------|
| `PORT`         | `8080`                    | Port the server listens on            |
| `JWT_SECRET`   | insecure dev default      | Signs auth tokens — **set a real one before deploying anywhere public** |
| `FRONTEND_URL` | `http://localhost:5173`   | Allowed CORS origin (your Vite dev server) |
| `INGEST_SECRET`| insecure dev default      | Shared key that `scripts/textbook_fetcher` must send to add library books — **set a real one before deploying** |

## What's real vs. still a placeholder

**Real:** signup/login/OTP verification (bcrypt + JWT), practice question
serving + grading + XP tracking, theory question grading, teacher stats,
leaderboard, dashboard summary, and the textbook library (seeded with 3
original study notes, growing via `scripts/textbook_fetcher`) — all backed
by
actual SQLite queries, not mock arrays.

**Placeholder (marked `TODO` in the code):**
- OTP is returned in the API response (`devOtp`) instead of emailed — there's
  no email service wired up. Fine for testing, not for real users.
- The AI tutor and the "why is this correct/wrong" explanations are
  rule-based text, not a real language model call.
- Theory grading checks for keywords, not real understanding of the answer.
- `/api/teacher/students` isn't restricted to teacher accounts yet.

Each of those has a comment in the code showing exactly where to plug in
the real thing.

## Testing the auth flow manually

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Nwosu","email":"ada@example.com","password":"password123"}'
# copy the devOtp from the response

curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","code":"<devOtp from above>"}'
# copy the token from the response

curl http://localhost:8080/api/practice/questions?subject=Physics&topic=Waves \
  -H "Authorization: Bearer <token>"
```
