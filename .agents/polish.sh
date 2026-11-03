#!/bin/zsh
# polish.sh <file1> [file2 ...] — gemini editorial pass, writes result back in place.
set -u
cd "$(dirname "$0")/.." || exit 1
PROMPT=.agents/docs-rewrite-style-prompt.md
MODEL="magpie/mikumikulove/gemini-3.8-flash"
for f in "$@"; do
  [[ -f $f ]] || { echo "SKIP missing: $f"; continue; }
  orig_lines=$(wc -l < "$f" | tr -d ' ')
  raw=$({ cat "$PROMPT"; echo; echo "===待优化文档（文件：$f）==="; echo; cat "$f"; } \
      | timeout 300 opencode run --model "$MODEL" 2>/dev/null)
  # strip ANSI codes + the opencode "> build · model" header line + leading blank lines
  body=$(print -r -- "$raw" | sed $'s/\x1b\\[[0-9;]*m//g' | grep -v '^> build ·' \
      | awk 'BEGIN{s=0} { if (s==0 && $0 ~ /^[[:space:]]*$/) next; s=1; print }')
  new_lines=$(print -r -- "$body" | grep -c .)
  if (( new_lines >= 20 )); then
    print -r -- "$body" > "$f"
    echo "OK $f  ${orig_lines} -> $(wc -l < "$f" | tr -d ' ') lines"
  else
    echo "FAIL $f  output too short ($new_lines lines), left unchanged"
  fi
done
