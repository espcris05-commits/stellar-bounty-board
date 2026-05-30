#!/usr/bin/env bash
# import-wave-issues.sh — Import issues from wave documentation into GitHub
set -euo pipefail
REPO="${REPO:-ritik4ever/stellar-bounty-board}"
WAVE="${1:-5}"
WAVE_FILE="docs/wave-${WAVE}.md"
[ ! -f "$WAVE_FILE" ] && echo "Error: $WAVE_FILE not found" && exit 1
echo "Importing Wave ${WAVE} issues from ${WAVE_FILE} into ${REPO}..."
awk '/^## /{title=substr($0,4); gsub(/^\[/,"",title); gsub(/\]/,"",title); gsub(/`/,"",title); print title}' "$WAVE_FILE" | while IFS= read -r title; do
  [ -z "$title" ] && continue
  echo "  Creating issue: ${title}..."
  gh issue create --repo "$REPO" --title "$title" --label "Stellar Wave" --label "good first issue" --body "Part of Wave ${WAVE}. See docs/wave-${WAVE}.md for details." 2>/dev/null || echo "  Failed: ${title}"
done
echo "Done."
