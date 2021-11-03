/**
 * ESLint用の設定ファイル。
 * プロジェクトディレクトリ直下に作成する。
 */
module.exports = {
    extends: [
        'plugin:@typescript-eslint/recommended',

        // 2021-02-21のFixで下記記述が不要になった
        // 'prettier/@typescript-eslint',

        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2019,
        project: './tsconfig.json',
        sourceType: 'module',
    },
    rules: {
        /**
         * prefixWithIで、Interfaceの命名規則について
         * 「I」から始めさせる or 始めさせない を定義することができる。
         * なお、typescript-eslint v3からは、ルール名が変更された。
         * ```
         * // AsIs
         * @typescript-eslint/interface-name-prefix [
         *     "error", {
         *         "prefixWithI": "always"
         *     }
         * ]
         * 
         * // ToBe
         * 下記の通り。
         * 参考サイト：https://note.com/dafujii/n/n35f964b1bd70
         * ```
         */
        "@typescript-eslint/naming-convention": [
            "error", {
                "selector": "interface",
                "format": ["PascalCase"],
                "custom": {
                    "regex": "^I[A-Z]",
                    "match": false
                }
            }
        ],
        "@typescript-eslint/no-floating-promises": [
            "error"
        ],
        "@typescript-eslint/no-unused-vars": [
            "error", {
                "argsIgnorePattern": "^_"
            }
        ],
    }
};