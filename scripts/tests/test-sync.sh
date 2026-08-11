#!/usr/bin/env bash
# Tests for sync.sh, the script that writes into every consumer repository.
#
# sync.sh derives both its canonical directory and its projects root from its
# own location, so each case builds a fake projects tree shaped like the real
# one and copies sync.sh into it. The real ~/Projects is never the root here,
# and nothing outside the temp directory is written.
#
# Usage: bash scripts/tests/test-sync.sh
set -uo pipefail

SYNC="$(cd "$(dirname "$0")/.." && pwd)/sync.sh"
failures=0

report() {
  local name="$1" want="$2" got="$3"
  if [[ "$got" == "$want" ]]; then
    printf '  PASS  %-48s (%s)\n' "$name" "$got"
  else
    printf '  FAIL  %-48s want=%s got=%s\n' "$name" "$want" "$got"
    failures=$((failures + 1))
  fi
}

# build <root> ; creates the canonical side only
build_canonical() {
  local root="$1"
  mkdir -p "$root/sovereign/scripts/git/tests"
  cp "$SYNC" "$root/sovereign/scripts/sync.sh"
  printf '#!/usr/bin/env bash\necho CANON-ALPHA\n' > "$root/sovereign/scripts/git/guard-alpha.sh"
  printf '#!/usr/bin/env bash\necho CANON-BETA\n'  > "$root/sovereign/scripts/git/guard-beta.sh"
  chmod +x "$root/sovereign/scripts/git/guard-alpha.sh" "$root/sovereign/scripts/git/guard-beta.sh"
  printf '#!/usr/bin/env bash\nexit 0\n' > "$root/sovereign/scripts/git/tests/test-guard-alpha.sh"
  printf '#!/usr/bin/env bash\nexit 0\n' > "$root/sovereign/scripts/git/tests/test-guard-beta.sh"
  chmod +x "$root/sovereign/scripts/git/tests/"*.sh
}

run_sync() { ( cd "$1" && bash "$1/sovereign/scripts/sync.sh" "${2:-}" 2>&1 ); }

echo "sync.sh tests"

# --- a drifted consumer file is corrected -----------------------------------
root="$(mktemp -d)"; build_canonical "$root"
mkdir -p "$root/ConsumerA/scripts/git"
printf 'OLD LOCAL VERSION\n' > "$root/ConsumerA/scripts/git/guard-alpha.sh"
run_sync "$root" >/dev/null
got=allowed
grep -q CANON-ALPHA "$root/ConsumerA/scripts/git/guard-alpha.sh" && got=corrected || got=unchanged
report "drifted guard is corrected" corrected "$got"
rm -rf "$root"

# --- a guard the consumer never had is NOT pushed in ------------------------
root="$(mktemp -d)"; build_canonical "$root"
mkdir -p "$root/ConsumerA/scripts/git"
cp "$root/sovereign/scripts/git/guard-alpha.sh" "$root/ConsumerA/scripts/git/guard-alpha.sh"
run_sync "$root" >/dev/null
[[ -f "$root/ConsumerA/scripts/git/guard-beta.sh" ]] && got=delivered || got=absent
report "unrequested guard is not pushed in" absent "$got"
rm -rf "$root"

# --- the test for a guard the consumer HAS is delivered ---------------------
root="$(mktemp -d)"; build_canonical "$root"
mkdir -p "$root/ConsumerA/scripts/git"
cp "$root/sovereign/scripts/git/guard-alpha.sh" "$root/ConsumerA/scripts/git/guard-alpha.sh"
run_sync "$root" >/dev/null
[[ -f "$root/ConsumerA/scripts/git/tests/test-guard-alpha.sh" ]] && got=delivered || got=absent
report "test for a present guard is delivered" delivered "$got"

# ...and it arrives executable
if [[ -x "$root/ConsumerA/scripts/git/tests/test-guard-alpha.sh" ]]; then got=executable; else got=plain; fi
report "delivered test is executable" executable "$got"

# --- the test for a guard the consumer LACKS is not delivered ---------------
[[ -f "$root/ConsumerA/scripts/git/tests/test-guard-beta.sh" ]] && got=delivered || got=absent
report "test for an absent guard is withheld" absent "$got"
rm -rf "$root"

# --- a stale delivered test is refreshed ------------------------------------
root="$(mktemp -d)"; build_canonical "$root"
mkdir -p "$root/ConsumerA/scripts/git/tests"
cp "$root/sovereign/scripts/git/guard-alpha.sh" "$root/ConsumerA/scripts/git/guard-alpha.sh"
printf 'STALE TEST\n' > "$root/ConsumerA/scripts/git/tests/test-guard-alpha.sh"
run_sync "$root" >/dev/null
grep -q 'exit 0' "$root/ConsumerA/scripts/git/tests/test-guard-alpha.sh" && got=refreshed || got=stale
report "stale delivered test is refreshed" refreshed "$got"
rm -rf "$root"

# --- dry run writes nothing -------------------------------------------------
root="$(mktemp -d)"; build_canonical "$root"
mkdir -p "$root/ConsumerA/scripts/git"
printf 'OLD LOCAL VERSION\n' > "$root/ConsumerA/scripts/git/guard-alpha.sh"
out="$(run_sync "$root" --dry-run)"
if grep -q 'OLD LOCAL VERSION' "$root/ConsumerA/scripts/git/guard-alpha.sh"; then got=unwritten; else got=written; fi
report "dry run does not write" unwritten "$got"
[[ -d "$root/ConsumerA/scripts/git/tests" ]] && got=created || got=absent
report "dry run creates no directories" absent "$got"
case "$out" in *"Dry run:"*) got=reported ;; *) got=silent ;; esac
report "dry run reports a summary" reported "$got"
rm -rf "$root"

# --- the canonical repo is never a target -----------------------------------
root="$(mktemp -d)"; build_canonical "$root"
mkdir -p "$root/ConsumerA/scripts/git"
printf 'OLD\n' > "$root/ConsumerA/scripts/git/guard-alpha.sh"
out="$(run_sync "$root")"
grep -q CANON-ALPHA "$root/sovereign/scripts/git/guard-alpha.sh" && got=intact || got=clobbered
report "canonical copy is left intact" intact "$got"
case "$out" in *sovereign*) got=targeted ;; *) got=skipped ;; esac
report "canonical repo is skipped" skipped "$got"
rm -rf "$root"

# --- an already-current consumer is counted, not rewritten ------------------
root="$(mktemp -d)"; build_canonical "$root"
mkdir -p "$root/ConsumerA/scripts/git"
cp "$root/sovereign/scripts/git/guard-alpha.sh" "$root/ConsumerA/scripts/git/guard-alpha.sh"
run_sync "$root" >/dev/null            # first pass delivers the test
out="$(run_sync "$root")"              # second pass should be a no-op
case "$out" in *"0 updated"*) got=noop ;; *) got=rewrote ;; esac
report "second run is a no-op" noop "$got"
rm -rf "$root"

echo
if (( failures )); then
  echo "$failures failing"
  exit 1
fi
echo "all passing"
