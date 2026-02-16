#!/bin/bash
# netlify-build.sh - Generate version info at build time

# Generate version.ts with CURRENT build info
CURRENT_COMMIT=$(git rev-parse --short HEAD)
CURRENT_BRANCH=$(git branch --show-current)
BUILD_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
VERSION=$(node -p "require('./package.json').version")

cat > app/version.ts << EOF
// Auto-generated during Netlify build
// Generated: $BUILD_TIMESTAMP

export const VERSION = "$VERSION";
export const VERSION_MAJOR = $(echo $VERSION | cut -d. -f1);
export const VERSION_MINOR = $(echo $VERSION | cut -d. -f2);
export const VERSION_PATCH = $(echo $VERSION | cut -d. -f3);
export const BUILD_DATE = "$BUILD_TIMESTAMP";
export const GIT_COMMIT = "$CURRENT_COMMIT";
export const GIT_BRANCH = "$CURRENT_BRANCH";
EOF

echo "Generated version.ts:"
cat app/version.ts

# Run the actual build
npm run build
