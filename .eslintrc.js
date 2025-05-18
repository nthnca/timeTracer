module.exports = {
    // Specify the environment(s) your code runs in
    env: {
        browser: true, // Add browser if your code runs in a browser
        node: true,    // Add node if your code runs in Node.js
        es2021: true   // Add the ECMAScript version your code targets
    },
    // Extend a recommended or popular configuration
    extends: [
        'eslint:recommended', // Starts with ESLint's built-in recommended rules
        // Add other popular configs if you use them, e.g.:
        // 'airbnb-base', // If you follow the Airbnb style guide (requires installing eslint-config-airbnb-base)
        // 'plugin:@typescript-eslint/recommended', // If using TypeScript (requires installing @typescript-eslint/eslint-plugin and @typescript-eslint/parser)
    ],
    // Specify parser options
    parserOptions: {
        ecmaVersion: 12, // Or 13, 14, etc. based on your es20xx setting or project needs
        sourceType: 'module' // or 'script' if not using ES Modules
    },
    // Add specific rule overrides or custom rules (optional)
    rules: {
        // Example: Disallow the use of console (change 'warn' or 'error' as needed)
        // 'no-console': 'off', // Turn off the rule
        // 'no-unused-vars': 'warn', // Change a recommended rule to a warning
    },
    // Specify files to ignore (optional, can also use a .eslintignore file)
    ignorePatterns: [
       'node_modules/',
       'dist/',
       'build/',
       '__tests__/', 
       '*.min.js'
    ]
};
