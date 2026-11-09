import { globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  { 
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'] 
  },
  globalIgnores([
    '**/dist/**',
    '**/coverage/**'
  ]),
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  eslintConfigPrettier,
)