#!/bin/bash

# Variables
FILE="./src/version.json"

# Check if version.json exists
if [ ! -f "$FILE" ]; then
    echo "version.json not found!"
    exit 1
fi

# Check for uncommitted changes
if [[ $(git status --porcelain) ]]; then
    echo "You have uncommitted changes, please commit changes first."
    exit 1
fi

# Increment the build number
BUILD=$(npx node-jq '.build' "$FILE")
NEW_BUILD=$((BUILD + 1))

# Update the build number in version.json
npx node-jq --argjson new_build "$NEW_BUILD" '.build = $new_build' "$FILE" > tmp.$$.json && mv tmp.$$.json "$FILE"
echo "Incremented build number to $NEW_BUILD"

# Add the updated version.json to Git
git add "$FILE"

# Commit the changes
git commit -m "build $NEW_BUILD"
COMMIT_ID=$(git rev-parse HEAD)
echo "Committed with ID $COMMIT_ID"
