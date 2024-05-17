module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    './.eslintrc-auto-import.json',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: '2020',
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true, // 单引号
        semi: false, // 无分号
        // printWidth: 1000000, // 每行宽度至多80字符
        trailingComma: 'none', // 不加对象|数组最后逗号
        endOfLine: 'auto' // 换行符号不限制（win mac 不一致）
      }
    ],
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index'] // vue组件名称多单词组成（忽略index.vue）
      }
    ],
    'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-sequences': 'off'
  },
  // rules: {
  //   'vue/multi-word-component-names': 'off',
  //   '@typescript-eslint/no-empty-function': 'off',
  //   '@typescript-eslint/no-explicit-any': 'off',
  //   'vue/no-v-model-argument': 'off',
  //   '@typescript-eslint/ban-types': [
  //     'error',
  //     {
  //       // 关闭空类型检查 {}
  //       extendDefaults: true,
  //       types: {
  //         '{}': false,
  //         Function: false
  //       }
  //     }
  //   ]
  // },
  globals: {
    DialogOption: 'readonly',
    OptionType: 'readonly'
  }
};
