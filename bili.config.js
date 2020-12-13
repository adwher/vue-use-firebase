export default {
    input: "src/main.ts",
    output: {
        format: ["cjs", "esm"],
        dir: "dist",
        fileName: "vue-use-firebase.[format][ext]",
        minify: true,
        sourceMap: false
    },
}