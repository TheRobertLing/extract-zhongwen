type ExtractChineseOptions = {
  normalizeUnicode?: boolean;
  removeDuplicates?: boolean; // Does not remove simplified/traditional character duplicates e.g. 国, 國 will both remain
  includeCharacters?: string;
  excludeCharacters?: string;
};

type UnicodeRanges = [number, number];

/**
 * =============================================================
 *
 *                         UNICODE RANGES
 *
 * =============================================================
 *
 * The following were adapted from the following MIT-licensed project:
 * https://github.com/alsotang/is-chinese
 *
 * The main differences include:
 * - Excludes CJK Compatibility Range [0x3300, 0x33ff]
 * - Excludes CJK Compatibility Forms [0xfe30, 0xfe4f]
 *
 * All unicode ranges were sourced from:
 * https://www.unicode.org/charts/
 *
 */

const characterUnicodeRanges: UnicodeRanges[] = [
  [0x4e00, 0x9fff], // CJK Unified Ideographs
  [0x3400, 0x4dbf], // CJK Extension A
  [0x20000, 0x2a6df], // CJK Extension B
  [0x2a700, 0x2b739], // CJK Extension C
  [0x2b740, 0x2b81d], // CJK Extension D
  [0x2b820, 0x2cea1], // CJK Extension E
  [0x2ceb0, 0x2ebe0], // CJK Extension F
  [0x30000, 0x3134a], // CJK Extension G
  [0x31350, 0x323af], // CJK Extension H
  [0x2ebf0, 0x2ee5d], // CJK Extension I

  [0xf900, 0xfad9], // CJK Compatibility Ideographs
  [0x2f800, 0x2fa1d], // CJK Compatibility Ideographs Supplement

  [0x2f00, 0x2fd5], // Kangxi Radicals,
  [0x2e80, 0x2ed3], // CJK Radicals Supplement
  [0x31c0, 0x31e5], // CJK Strokes. Techically ends at 0x31ef, but 0x31ef is an ideographic description character

  // Exclude since they are just structural indicators
  // [0x2ff0, 0x2fff], // Ideographic Description Characters
];

/**
 * =============================================================
 *
 *                      FUNCTION DEFINITIONS
 *
 * =============================================================
 */

const unicodeToRegex = (ranges: UnicodeRanges[]): string => {
  let result = "";

  for (let i = 0, n = ranges.length; i < n; i++) {
    const [start, end] = ranges[i];
    if (start === end) {
      result += `\\u{${start.toString(16)}}`;
    } else {
      result += `\\u{${start.toString(16)}}-\\u{${end.toString(16)}}`;
    }
  }

  return result;
};

const userListsToRegex = (str: string): string => {
  // Escape any reserved symbols/characters e.g * -> \*
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\s+/g, "\\s+");
};

const combineToRegex = (
  ranges: UnicodeRanges[],
  includeCharacters: string,
  excludeCharacters: string
): {
  whitelist: RegExp;
  blacklist: RegExp;
} => {
  // Convert Unicode Ranges to RegEx string
  const rangesRegEx: string = unicodeToRegex(ranges);

  // Normalize the user provided whitelist/blacklists
  const includeRegEx: string = userListsToRegex(includeCharacters);
  const excludeRegEx: string = userListsToRegex(excludeCharacters);

  const whitelistPattern = `[^${rangesRegEx}${includeRegEx}]+`;
  const blacklistPattern = excludeRegEx ? `[${excludeRegEx}]+` : "(?!)"; // To avoid regex error due to empty string

  const whitelist = new RegExp(whitelistPattern, "gu");
  const blacklist = new RegExp(blacklistPattern, "gu");

  return {
    whitelist,
    blacklist,
  };
};

const removeDuplicatesFromString = (str: string): string => {
  const seen = new Set<number>();
  let result = "";

  for (let i = 0, n = str.length; i < n; i++) {
    // https://www.linkedin.com/pulse/staying-clear-surrogate-pairs-issues-javascript-mazen-sharkawy-ofw1f/
    const code: number = str.codePointAt(i)!;

    if (!seen.has(code)) {
      result += String.fromCodePoint(code);
      seen.add(code);
    }

    if (code > 0xffff) {
      i++;
    }
  }

  return result;
};

const extractChinese = (
  input: string,
  {
    normalizeUnicode = true,
    removeDuplicates = true,
    includeCharacters = "",
    excludeCharacters = "",
  }: ExtractChineseOptions = {}
): string => {
  const { whitelist, blacklist } = combineToRegex(
    characterUnicodeRanges,
    includeCharacters,
    excludeCharacters
  );

  const original: string = input;
  const whiteblacklistSet: Set<string> = new Set([
    ...includeCharacters.split(""),
    ...excludeCharacters.split(""),
  ]);


  // Normalize string but prevent whitelisted characters from being normalized
  if (normalizeUnicode) {
    input = input.normalize("NFKC");

    for (
      let i = 0, j = 0, m = original.length, n = input.length;
      i < m && j < n;
      // Iterator manually incremented
    ) {
      const char1 = String.fromCodePoint(original.codePointAt(i)!);
      const char2 = String.fromCodePoint(input.codePointAt(j)!);

      if (char1 !== char2 && whiteblacklistSet.has(char1)) {
        // Reform string to avoid corruption due to surrogate pairs
        input =
          input.substring(0, j) + char1 + input.substring(j + char2.length);
      }

      i += char1.length;
      j += char2.length;
    }
  }

  input = input.replace(whitelist, "");
  input = input.replace(blacklist, "");

  if (removeDuplicates) {
    input = removeDuplicatesFromString(input);
  }

  return input;
};

export { ExtractChineseOptions, extractChinese };
