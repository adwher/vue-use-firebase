test("API are declared", function () {
    const { useCollection, useAuth } = require("../dist/vue-use-firebase.cjs.js")

    expect(() => useCollection()).toThrow("No Firebase App")
    expect(() => useAuth()).toThrow("No Firebase App")
})