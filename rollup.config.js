import esbuild from "rollup-plugin-esbuild"

export default [
    {
        input: "src/main.ts",

        output: {
            file: "dist/vue-use-firebase.js",
            format: "cjs",
        },

        external: [/firebase\/.*/, "vue"],

        plugins: [
            esbuild({
                minify: true,
                target: "es2017",
            }),
        ]
    }
]