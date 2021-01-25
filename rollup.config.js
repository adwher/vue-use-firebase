import esbuild from "rollup-plugin-esbuild"

const IS_PRODUCTION = !process.env.ROLLUP_WATCH
const EXTERNAL_DEPENDENCIES = [/firebase\/.*/, "firebase", "vue"]

export default [
    {
        input: "src/main.ts",
    
        output: {
            file: "dist/vue-use-firebase.esm.js",
            format: "esm",
        },
    
        external: EXTERNAL_DEPENDENCIES,
    
        plugins: [
            esbuild({
                minify: IS_PRODUCTION,
                target: "es2015",
            }),
        ]
    },  

    {
        input: "src/main.ts",
    
        output: {
            file: "dist/vue-use-firebase.cjs.js",
            format: "cjs",
        },
    
        external: EXTERNAL_DEPENDENCIES,
    
        plugins: [
            esbuild({
                minify: IS_PRODUCTION,
                target: "es2015",
            }),
        ]
    },

    {
        input: "src/main.ts",
    
        output: {
            name: "vueUseFirebase",
            file: "dist/vue-use-firebase.iife.js",
            format: "iife",
            globals: {
                "vue": "Vue",
                "firebase/app": "firebase"
            }
        },
    
        external: EXTERNAL_DEPENDENCIES,
    
        plugins: [
            esbuild({
                minify: IS_PRODUCTION,
                target: "es2015",
            }),
        ]
    }
]