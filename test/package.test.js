test("API are declared", function () {
    const { useCollection, useAuth } = require("../dist/vue-use-firebase")

    expect(() => useCollection()).toThrow("No Firebase App")
    expect(() => useAuth()).toThrow("No Firebase App")
})