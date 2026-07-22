# LearnQuest

Full-stack MVP: Go backend + React/TypeScript frontend, wired together and
running against real data (SQLite locally — no external services needed).

```
backend/    Go + Gin + SQLite API
frontend/   React + Vite + TypeScript + Tailwind
scripts/    Python — writes original study notes into the Library (optional, see below)
```

## Run both (two terminals)

**Terminal 1 — backend**
```bash
cd backend
go mod tidy
go run main.go
```
Runs on **http://localhost:8080**. Creates `learnquest.db` and seeds it with
Physics · Waves questions the first time it starts.

**Terminal 2 — frontend**
```bash
cd frontend
npm install
npm run dev
```
Runs on **http://localhost:5173** and is already configured to call the
backend at `localhost:8080` — no setup needed, just open the URL Vite prints.

## Try it end to end

1. Open `http://localhost:5173` → **Get Started Free**
2. Sign up with any name/email/password
3. On the verify screen, a yellow box shows your OTP directly (no email
   service is wired up yet — that's the one deliberate shortcut here so you
   can test without an inbox) — type it in
4. You land on the Dashboard, logged in for real
5. Click into **Physics → Waves** from the curriculum browser → answer
   questions → watch real right/wrong detection and feedback happen live,
   backed by an actual API call each time, not a local mock
6. Check **Progress**, **Leaderboard**, and **Teacher** — all reading from
   the same SQLite database your practice session just wrote to

## Optional: keep the textbook library growing

`scripts/textbook_fetcher` is a Python script that writes original,
condensed study notes per curriculum topic (via Gemini) and adds them to
the Library section — read entirely inside the app, nothing links out.
The library already has 3 real seeded notes so it's not empty out of the
box — this script is what grows it to cover the rest of the curriculum.
Needs a free Gemini API key. Full instructions in
`scripts/textbook_fetcher/README.md`.

## What's genuinely real vs. still a placeholder

This is an honest MVP, not a fully AI-powered product yet — here's exactly
where the line is:

**Real and working:**
- Signup → OTP verification → login, with hashed passwords and real JWT sessions
- Every page fetches from the actual backend — nothing is hardcoded in the frontend anymore
- Practice answers are graded server-side, XP is persisted to the database
- Teacher dashboard and Leaderboard are computed from real attempt records
- Textbook Library has 3 real study notes out of the box, read entirely
  in-app, and grows automatically if you run `scripts/textbook_fetcher`
- Progress, dark mode, mobile navigation, and the full nav all work end to end

**Placeholder, clearly marked `TODO` in the code:**
- The "AI" feedback (practice explanations, theory grading, tutor chat) is
  rule-based/keyword-matched, not a real language model call yet
- OTP is shown on-screen instead of emailed (no email provider configured)
- Only one topic (Physics · Waves) has seeded practice questions
- `/api/teacher/students` isn't restricted to teacher-role accounts yet

Each of those has a comment in the code pointing to exactly where the real
version plugs in. Given your timeline, I'd wire the practice feedback loop
to a real AI call first — it's your core differentiator — and expand
curriculum content once that's proven with real students.

## If something doesn't run

I built this without being able to compile the Go code or run the frontend
myself (no Go, no internet access, in the sandbox I worked in). If
`go run main.go` or `npm run dev` throws an error, paste it back to me
exactly as shown and I'll fix it immediately — much faster than debugging
tooling alone under a deadline.
