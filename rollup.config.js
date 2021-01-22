import esbuild from "rollup-plugin-esbuild"

export default [
    {
        input: "src/main.ts",
    
        output: {
            file: "dist/vue-use-firebase.cjs.js",
            format: "cjs",
        },
    
        external: [/firebase\/.*/, "firebase", "vue"],
    
        plugins: [
            esbuild({
                minify: true,
                target: "es2015",
            }),
        ]
    },

    {
        input: "src/main.ts",
    
        output: {
            name: "VueUseFirebase",
            file: "dist/vue-use-firebase.iife.js",
            format: "iife",
            globals: {
                "vue": "Vue",
                "firebase/app": "firebase"
            }
        },
    
        external: [/firebase\/.*/, "firebase", "vue"],
    
        plugins: [
            esbuild({
                minify: true,
                target: "es2015",
            }),
        ]
    }
]