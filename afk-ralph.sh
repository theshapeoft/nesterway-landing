#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

for ((i=1; i<=$1; i++)); do
  echo "=== Iteration $i/$1 ==="

  # Use tee to both display output and capture it for checking
  result=$(docker sandbox run claude --permission-mode acceptEdits -p "@PRD.md @progress.txt \
  1. Find the highest-priority task and implement it. \
  2. Run ALL feedback loops before committing: \
     - npm run typecheck (must pass with no errors) \
     - npm run test (must pass) \
     - npm run lint (must pass) \
     Do NOT commit if any feedback loop fails. Fix issues first. \
  3. Update the PRD with what was done. \
  4. Append your progress to progress.txt. \
  5. Commit your changes only after all feedback loops pass. \
  \
  Keep changes small and focused: \
  - One logical change per commit \
  - If a task feels too large, break it into subtasks \
  - Prefer multiple small commits over one large commit \
  - Run feedback loops after each change, not at the end \
  Quality over speed. Small steps compound into big progress. \
  \
  ONLY WORK ON A SINGLE TASK. \
  If the PRD is complete, output <promise>COMPLETE</promise>." 2>&1 | tee /dev/tty)

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo ""
    echo "✅ PRD complete after $i iterations."
    exit 0
  fi

  echo ""
done