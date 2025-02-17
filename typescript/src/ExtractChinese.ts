type ExtractChineseOptions = {
  removePunctuation?: boolean;
  removeDuplicates?: boolean; // Does not remove simplified/traditional character duplicates e.g. 国, 國 will both remain
  includeCharacters?: string | string | Set<string> | null;
  excludeCharacters?: string | string | Set<string> | null;
};

const loadCharacterFilters = async () => {};

const normalizeToSet = (
  characterList: string | string | Set<string> | null
): Set<string> => {
  const result = new Set<string>();
  if (!characterList) {
    return result;
  }

  if (typeof characterList === "string") {
    for (const char of characterList) {
      result.add(char);
    }
  } else if (Array.isArray(characterList) || characterList instanceof Set) {
    for (const entry of characterList) {
      if (typeof entry === "string") {
        for (const char of entry) {
          result.add(char);
        }
      }
    }
  }

  return result;
};

const extractChinese = (
  input: string,
  {
    removePunctuation = true,
    removeDuplicates = false,
    includeCharacters = null,
    excludeCharacters = null,
  }: ExtractChineseOptions = {}
): string => {
  const include: Set<string> = normalizeToSet(includeCharacters);
  const exclude: Set<string> = normalizeToSet(excludeCharacters);
  const seen: Set<string> = new Set<string>();
  let filteredString: string = "";

  for (let i = 0, n = input.length; i < n; i++) {
    // Precendence: include > exclude > punctuation

    // Check if character is whitelisted
    if (include.has(input[i])) {
      filteredString += input[i];
    }

    // Check if character is blacklisted
    if (exclude.has(input[i])) {
      continue;
    }

    // Check if character is a valid chinese character
    if (true) {
    }
  }

  return filteredString;
};


export { loadCharacterFilters, extractChinese };
