#!/usr/bin/env bash
# Production update for the VPS. Builds into .next-build while the live server
# keeps serving .next, then swaps the folders and restarts, so visitors never
# hit a half-written build.
set -euo pipefail

# Wrapped in a function so bash reads the whole script before git pull can rewrite it.
main() {
  cd "$(dirname "$0")/.."

  git pull --ff-only
  npm ci
  npm run db:migrate
  npm run geoip:update

  rm -rf .next-build
  NEXT_DIST_DIR=.next-build npm run build

  rm -rf .next-previous
  if [ -d .next ]; then mv .next .next-previous; fi
  mv .next-build .next
  pm2 restart teachernavigator --update-env
  if pm2 describe teachernavigator-maintenance >/dev/null 2>&1; then
    pm2 restart teachernavigator-maintenance --update-env
  else
    pm2 start scripts/consultation-maintenance.mjs --name teachernavigator-maintenance
  fi
  pm2 save
}

main "$@"
