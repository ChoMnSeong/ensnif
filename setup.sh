#!/bin/bash

# Function to add dependency to package.json using jq
add_dependency() {
    local dep=$1
    # pnpm 모노레포에서는 내부 패키지 연결 시 "workspace:*"를 사용하는 것이 안전하고 권장되는 방식입니다.
    if jq --arg dep "$dep" '.dependencies += {($dep): "workspace:*"}' package.json > package.tmp; then
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

    # pnpm으로 Vite 프로젝트 생성
    if ! pnpm create vite "$project_name-$project_type"; then
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
    pnpm add -D eslint prettier

    # Ask if TypeScript should be installed
    read -p "Would you like to add TypeScript? (y/n): " use_typescript

    if [[ "$use_typescript" =~ ^[yY]$ ]]; then
        echo "Adding TypeScript..."
        pnpm add -D typescript

        # pnpm은 node_modules를 물리적으로 만들기 때문에 VSCode SDK 세팅이 더 이상 필요 없습니다!
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
    # pnpm --filter 명령어로 루트 실행 스크립트 작성
    jq --arg proj "$project_name-$project_type" '.scripts["dev:\($proj)"] = "pnpm --filter \($proj) dev"' package.json > package.tmp && mv package.tmp package.json
    jq --arg proj "$project_name-$project_type" '.scripts["dev:ssr:\($proj)"] = "pnpm --filter \($proj) dev:ssr"' package.json > package.tmp && mv package.tmp package.json

elif [ "$project_type" == "mobile" ]; then
    echo "Setting up Mobile project..."

    read -p "Would you like to use React Native CLI or Expo? (cli/expo): " rn_type
    rn_type=$(echo "$rn_type" | tr '[:upper:]' '[:lower:]')

    read -p "Enter your project name: " project_name
    project_name=$(echo "$project_name" | tr ' ' '_')

    if [ "$rn_type" == "cli" ]; then
        echo "Initializing React Native project with CLI..."
        # React Native CLI에 pnpm 패키지 매니저 강제 옵션 추가
        npx react-native init "$project_name-$project_type" --pm pnpm
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
    pnpm add -D eslint prettier

    # Navigate back to the root directory
    cd ../..

    echo "Updating root package.json for the mobile project..."
    # pnpm --filter 명령어로 루트 실행 스크립트 작성
    jq --arg proj "$project_name-$project_type" '.scripts["dev:\($proj)"] = "pnpm --filter \($proj) start"' package.json > package.tmp && mv package.tmp package.json

else
    echo "Invalid choice. Exiting setup."
    exit 1
fi

echo "Setup complete!"
