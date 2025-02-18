import { extractChinese } from '../src/ExtractChinese'

describe("Tests for extractChinese", () => {

})

test("basic test", () => {
  expect(extractChinese("逼逼赖赖", { removeDuplicates: true })).toBe("逼赖")
})


