#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

copy_env() {
  local example_file="$1"
  local target_file="$2"

  if [[ ! -f "$target_file" ]]; then
    cp "$example_file" "$target_file"
    echo "created $target_file"
  else
    echo "kept existing $target_file"
  fi
}

command -v pnpm >/dev/null 2>&1 || {
  echo "pnpm is required. Install it first, then re-run ./setup.sh"
  exit 1
}

copy_env ".env.example" ".env"
copy_env "frontend/.env.example" "frontend/.env.local"
copy_env "backend/.env.example" "backend/.env"

pnpm install
pnpm db:generate

echo
echo "Setup complete."
echo "Next: pnpm docker:up"
echo "Then: pnpm db:migrate && pnpm db:seed && pnpm dev"
