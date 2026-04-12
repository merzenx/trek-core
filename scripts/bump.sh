#!/bin/bash
set -euo pipefail

NEW_VER="$1"

if [ -z "$NEW_VER" ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

echo "Bumping versions to $NEW_VER"

find . -name "node_modules" -prune -o -name "package.json" -type f -print | while read -r pkg_path; do
    echo "Updating $pkg_path"
    jq --arg v "$NEW_VER" '.version = $v' "$pkg_path" > "${pkg_path}.tmp" && mv "${pkg_path}.tmp" "$pkg_path"
done