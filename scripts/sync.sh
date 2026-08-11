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

# Copy one canonical file onto its target, or describe the change under
# --dry-run. Callers decide whether a missing target should be created; this
# only reports and writes.
sync_one() {
    local canonical="$1" target="$2" label="$3"

    if [[ -f "$target" ]] && cmp -s "$canonical" "$target"; then
        ((skipped++)) || true
        return
    fi

    ((different++)) || true
    if $DRY_RUN; then
        if [[ -f "$target" ]]; then
            echo "DIFF  $label"
            diff "$canonical" "$target" | head -10 || true
        else
            echo "NEW   $label"
        fi
        echo ""
    else
        mkdir -p "$(dirname "$target")"
        cp "$canonical" "$target"
        # cp leaves a newly created file at the default mode, so an executable
        # canonical script would arrive non-executable.
        [[ -x "$canonical" ]] && chmod +x "$target"
        echo "SYNC  $label"
        ((updated++)) || true
    fi
}

while IFS= read -r -d '' git_dir; do
    repo_root="$(dirname "$(dirname "$git_dir")")"
    repo_name="${repo_root#"$PROJECTS_ROOT/"}"
    [[ "$repo_name" == "sovereign" ]] && continue

    for canonical in "$CANONICAL_DIR"/*; do
        [[ -f "$canonical" ]] || continue
        script_name="$(basename "$canonical")"
        target="$git_dir/$script_name"
        # Only repos already carrying a script receive its updates. Adding a
        # new canonical script does not push it into repos that never had one.
        [[ ! -f "$target" ]] && continue
        sync_one "$canonical" "$target" "$repo_name/scripts/git/$script_name"
    done

    # Tests travel with the scripts they cover. Without them a consumer's
    # locally modified guard is never checked, which is how one repo carried a
    # corrected guard while fifty others kept the broken one and nothing
    # noticed. test-<name> is delivered only where <name> exists, so a repo
    # never receives a test for a guard it does not have.
    for canonical_test in "$CANONICAL_DIR"/tests/*; do
        [[ -f "$canonical_test" ]] || continue
        test_name="$(basename "$canonical_test")"
        covered="${test_name#test-}"
        [[ -f "$git_dir/$covered" ]] || continue
        sync_one "$canonical_test" "$git_dir/tests/$test_name" \
            "$repo_name/scripts/git/tests/$test_name"
    done
done < <(find "$PROJECTS_ROOT" -maxdepth 4 -name "git" -path "*/scripts/git" -type d -print0 2>/dev/null)

if $DRY_RUN; then
    echo "Dry run: $different files differ, $skipped already up to date"
else
    echo "Done: $updated updated, $skipped already up to date"
fi
