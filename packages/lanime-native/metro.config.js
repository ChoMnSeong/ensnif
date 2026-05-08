const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
]
config.resolver.disableHierarchicalLookup = true

// pnpm strict isolation: babel rewrites JSX to import from
// `react-native-css-interop/jsx-runtime`, but expo-router (in .pnpm/...) can't
// resolve it. Force the lookup to the project's own node_modules copy.
const cssInteropRoot = path.resolve(
    projectRoot,
    'node_modules/react-native-css-interop',
)
config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    'react-native-css-interop': cssInteropRoot,
}

module.exports = withNativeWind(config, { input: './global.css' })
