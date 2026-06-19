#!/usr/bin/env bash
# sync.sh — propagate canonical scripts/git from sovereign to consumer repos
# Usage: ./scripts/sync.sh [--dry-run]
set -euo pipefail

CANONICAL_DIR="$(cd "$(dirname "$0")/git" && pwd)"
PROJECTS_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

updated=0
skipped=0
different=0

while IFS= read -r -d '' git_dir; do
    repo_root="$(dirname "$(dirname "$git_dir")")"
    repo_name="${repo_root#"$PROJECTS_ROOT/"}"
    [[ "$repo_name" == "sovereign" ]] && continue

    for canonical in "$CANONICAL_DIR"/*; do
        script_name="$(basename "$canonical")"
        target="$git_dir/$script_name"
        [[ ! -f "$target" ]] && continue

        if cmp -s "$canonical" "$target"; then
            ((skipped++)) || true
        else
            ((different++)) || true
            if $DRY_RUN; then
                echo "DIFF  $repo_name/scripts/git/$script_name"
                diff "$canonical" "$target" | head -10 || true
                echo ""
            else
                cp "$canonical" "$target"
                echo "SYNC  $repo_name/scripts/git/$script_name"
                ((updated++)) || true
            fi
        fi
    done
done < <(find "$PROJECTS_ROOT" -maxdepth 4 -name "git" -path "*/scripts/git" -type d -print0 2>/dev/null)

if $DRY_RUN; then
    echo "Dry run: $different files differ, $skipped already up to date"
else
    echo "Done: $updated updated, $skipped already up to date"
fi
