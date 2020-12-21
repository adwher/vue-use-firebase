export default {
    input: "src/main.ts",
    output: {
        format: ["esm", "cjs"],
        dir: "dist",
        fileName: "vue-use-firebase.[format][ext]",
        minify: true,
        sourceMap: false
    },
}