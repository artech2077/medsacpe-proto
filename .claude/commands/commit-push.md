Run git status and git diff to see all changes, then:

1. Stage all unstaged changes with `git add -A` (excluding .env files and secrets)
2. Write a concise commit message that summarizes the changes based on the diff — use conventional commit style (feat/fix/chore/refactor) when clear, otherwise a short imperative sentence
3. Commit with that message, including the Co-Authored-By trailer
4. Push to origin

Confirm the push succeeded and show the commit hash.
