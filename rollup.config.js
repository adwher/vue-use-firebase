import esbuild from "rollup-plugin-esbuild"

export default [
    {
        input: "src/main.ts",

        output: [
            {
                name: "cjs",
                file: "dist/vue-use-firebase.cjs.js",
                format: "cjs",
            },

            {
                name: "esm",
                file: "dist/vue-use-firebase.esm.js",
                format: "esm",
            }
        ],

        external: [/firebase\/.*/, "vue"],

        plugins: [
            esbuild({
                include: /\.[tj]sx?$/,
                exclude: /node_modules/,
                sourceMap: false,
                minify: true,
                target: "es2015",
            }),
        ]
    }
]