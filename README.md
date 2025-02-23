# extract-chinese

extract-chinese is a small utility designed to extract Chinese characters from a given string based on Unicode Ranges.

---

## Installation

```bash
npm install extract-chinese
```

## Features

- Extracts Chinese characters from an input string.
- Supports **Unicode normalization** (NFKC) with optional preservation of specified characters.
- Allows **whitelisting or blacklisting** of specific characters.
- Option to **remove duplicate characters**.

## Function Signature

```typescript
const extractChinese = (
  input: string,
  options?: ExtractChineseOptions
): string
```

### Parameters

### `input` (string)

The input string from which Chinese characters will be extracted.

### `options` (ExtractChineseOptions)

An object containing configuration options.

| Option              | Type    | Default | Description                                                                                                                      |
| ------------------- | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `normalizeUnicode`  | boolean | `true`  | If `true`, normalizes Unicode characters to NFKC form, while preserving whitelisted characters.                                  |
| `removeDuplicates`  | boolean | `true`  | If `true`, removes duplicate Chinese characters in the output.                                                                   |
| `includeCharacters` | string  | `""`    | A string of characters to explicitly include in the extracted output, even if they don't match general Chinese character ranges. |
| `excludeCharacters` | string  | `""`    | A string of characters to exclude from the extracted output, even if they match Chinese character ranges.                        |

## Notes
- Whitelisted characters in `includeCharacters` will not be normalized if present.
- `includeCharacters` and `excludeCharacters` will treat each character individually. This means that it is not possible to whitelist or blacklist specific words or phrases.
- If `includeCharacters` and `excludeCharacters` contain overlapping characters, the overlapping characters will be filtered out.
- Whitespaces, punctuation, and any non-Chinese characters are filtered out by default.
- Duplicate characters are removed at the very end. This means that unnormalized characters and their normalized counterparts may be considered duplicates if the `normalizeUnicode` option is enabled, even if their Unicode values are technically different.
- If `normalizeUnicode` is disabled, characters with **different Unicode representations** might not be merged correctly.
- Performance may vary for **very large input strings**, especially when `removeDuplicates` is enabled, since it requires additional processing.
- If no Chinese characters are found in the input, an **empty string** will be returned.
- The function does not differentiate between **Simplified and Traditional Chinese**. 


## Example Usage

```typescript
import { extractChinese } from "extract-chinese";

console.log(extractChinese("中文字符 English Characters"));
// Output: "中文字符"

// Example with normalization (NFKC)
console.log(extractChinese("社 社 祖 租", { normalizeUnicode: true }));
// Output: "社社租租"

// Example with duplicate removal
console.log(extractChinese("你好 你好 世界 世界", { removeDuplicates: true }));
// Output: "你好世界"

// Example with duplicate removal disabled
console.log(extractChinese("你好 你好 世界 世界", { removeDuplicates: false }));
// Output: "你好你好世界世界"

// Example including a specific character
console.log(
  extractChinese("Hello 你好，世界！", { includeCharacters: "l,! " })
);
// Output: "ll 你好，世界！"

// Example excluding a specific character
console.log(extractChinese("Hello 你好，世界！", { excludeCharacters: "世" }));
// Output: "你好界"

// Example including and excluding characters
console.log(
  extractChinese(
    "那座山，正当顶上，有一块仙石 On the summit of the mountain was a mythical stone",
    {
      includeCharacters: "On the summit of the mountain",
      excludeCharacters: "那座山",
    }
  )
);
// Output: "正当顶上有一块仙石 On the summit of the mountain"
```
