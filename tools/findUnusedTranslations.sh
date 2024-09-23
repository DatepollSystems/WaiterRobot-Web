#!/bin/bash

# JSON file path
json_file="src/assets/i18n/de.json"

# Directory path to search
search_directory="src/app/"

# Array to store the keys from JSON file
json_keys=()

# Check if JSON file and search directory arguments are provided
if [[ -z "$json_file" || -z "$search_directory" ]]; then
    echo "Usage: ./findUnusedTranslations.sh <json_file> <search_directory>"
    exit 1
fi

# Check if JSON file exists
if [[ ! -f "$json_file" ]]; then
    echo "JSON file '$json_file' does not exist."
    exit 1
fi

# Check if search directory exists
if [[ ! -d "$search_directory" ]]; then
    echo "Search directory '$search_directory' does not exist."
    exit 1
fi

# Read JSON file and extract keys
while IFS=: read -r key _; do
    # Remove leading/trailing double quotes and whitespace
    key=$(echo "$key" | sed -e 's/^"//' -e 's/"$//' -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
    # Add key to array
    json_keys+=("$key")
done < <(jq -r 'keys[]' "$json_file")

# Array to store the missing keys
missing_keys=()

# Iterate over each key
for key in "${json_keys[@]}"; do
    # Search for the key in the directory and its contents
    grep_result=$(grep -r "'$key'" "$search_directory" 2>/dev/null)
    if [[ -n "$grep_result" ]]; then
        echo "== Key '$key' found in:"
        echo "$grep_result"
    else
        missing_keys+=("$key")
    fi
done

# Display missing keys
if [[ ${#missing_keys[@]} -gt 0 ]]; then
    echo "== The following keys were not found in the search directory:"
    for missing_key in "${missing_keys[@]}"; do
        echo "$missing_key"
    done
else
    echo "All keys found in the search directory."
fi
