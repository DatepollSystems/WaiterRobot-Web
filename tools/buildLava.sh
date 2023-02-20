#!/bin/bash

# Save the current version in the package.json file
current_version=$(grep -oP '(?<="version": ")[^"]*' package.json)

# Add the current timestamp in Unix seconds to the version number
new_version="$current_version.$(date +%s)"

echo "Current version: $current_version";
echo "New version: $new_version";

# Define a trap function to reset the version number on exit
function reset_version {
  # Reset the version number to the original value
  sed -i "s/\"version\": \"$new_version\"/\"version\": \"$current_version\"/" package.json
}

# Register the trap function for EXIT signals
trap reset_version EXIT

# Replace the version number in the package.json file
sed -i "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json

# Execute your other script here
npm run build:lava
