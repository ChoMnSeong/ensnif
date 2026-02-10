#!/bin/bash

# Function to add dependency to package.json using jq
add_dependency() {
    local dep=$1
    if jq --arg dep "$dep" '.dependencies += {($dep): "*"}' package.json > package.tmp; then
        mv package.tmp package.json
    else
        echo "Failed to update package.json"
        exit 1
    fi
}

# Step 1: Choose between Web or Mobile project
read -p "Would you like to create a Web (vite) or Mobile (react native) project? (web/mobile): " project_type
project_type=$(echo "$project_type" | tr '[:upper:]' '[:lower:]')  # Convert to lowercase

mkdir -p packages  # Ensure 'package' directory exists
if ! cd packages; then
    echo "Failed to change directory to 'packages'"
    exit 1
fi

if [ "$project_type" == "web" ]; then
    echo "Setting up Web project..."

    # Create a Vite project
    read -p "Enter your project name: " project_name
    project_name=$(echo "$project_name" | tr ' ' '_')  # Replace spaces with underscores

    if ! yarn create vite@latest "$project_name-$project_type"; then
        echo "Failed to create Vite project"
        exit 1
    fi

    # Navigate to the created project directory
    if ! cd "$project_name-$project_type"; then
        echo "Failed to change directory to '$project_name-$project_type'"
        exit 1
    fi

    # Add ESLint and Prettier
    echo "Adding ESLint and Prettier..."
    yarn add -D eslint prettier

    # Ask if TypeScript should be installed
    read -p "Would you like to add TypeScript? (y/n): " use_typescript

    if [[ "$use_typescript" =~ ^[yY]$ ]]; then
        echo "Adding TypeScript..."
        yarn add -D typescript

        echo "Setting up VSCode SDKs..."
        yarn dlx @yarnpkg/sdks vscode

        echo "Updating tsconfig.json..."
        sed -i.bak '1s/{/{\n  "extends": "..\/..\/tsconfig.base.json",/' tsconfig.json && rm tsconfig.json.bak
    else
        echo "Skipping TypeScript setup."
    fi

    # Add @ensnif/common to dependencies
    echo "Adding @ensnif/common to dependencies..."
    add_dependency "@ensnif/common"

    # Navigate back to the root directory
    cd ../..

    echo "Updating root package.json for the web project..."
    jq --arg proj "$project_name-$project_type" '.scripts["dev:\($proj)"] = "cd packages/\($proj) && yarn dev"' package.json > package.tmp && mv package.tmp package.json

elif [ "$project_type" == "mobile" ]; then
    echo "Setting up Mobile project..."

    read -p "Would you like to use React Native CLI or Expo? (cli/expo): " rn_type
    rn_type=$(echo "$rn_type" | tr '[:upper:]' '[:lower:]')

    read -p "Enter your project name: " project_name
    project_name=$(echo "$project_name" | tr ' ' '_')

    if [ "$rn_type" == "cli" ]; then
        echo "Initializing React Native project with CLI..."
        npx react-native init "$project_name-$project_type"
    elif [ "$rn_type" == "expo" ]; then
        echo "Initializing Expo project..."
        npx create-expo-app "$project_name-$project_type"
    else
        echo "Invalid choice. Exiting setup."
        exit 1
    fi

    # Navigate to the created project directory
    if ! cd "$project_name-$project_type"; then
        echo "Failed to change directory to '$project_name-$project_type'"
        exit 1
    fi

    # Add ESLint and Prettier
    echo "Adding ESLint and Prettier..."
    yarn add -D eslint prettier

    # Navigate back to the root directory
    cd ../..

    echo "Updating root package.json for the mobile project..."
    jq --arg proj "$project_name-$project_type" '.scripts["dev:\($proj)"] = "cd packages/\($proj) && yarn start"' package.json > package.tmp && mv package.tmp package.json

else
    echo "Invalid choice. Exiting setup."
    exit 1
fi

echo "Setup complete!"
