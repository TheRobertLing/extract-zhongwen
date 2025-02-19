import { ExtractChineseOptions, extractChinese } from "../src/ExtractChinese";

type TestInput = {
  input: string;
  options?: ExtractChineseOptions;
};

type TestCase = [name: string, testInput: TestInput, expected: string];

const defaultCases: TestCase[] = [
  [
    "Test Empty String",
    {
      input: "",
    },
    "",
  ],
  [
    "Test All Simplified Characters",
    {
      input: "全民制作人们大家好",
    },
    "全民制作人们大家好",
  ],
  [
    "Test All Traditional Characters",
    {
      input: "練習時常兩年半的個人練習生",
    },
    "練習時常兩年半的個人生",
  ],
  [
    "Test Mixed Simplified Traditional",
    {
      input: "全民制作人们大家好我是練習時常兩年半的個人練習生",
    },
    "全民制作人们大家好我是練習時常兩年半的個生",
  ],
  [
    "Test All English",
    {
      input: "The Quick Brown Fox Jumped Over the Lazy Dog",
    },
    "",
  ],
  [
    "Test Mixed English/Chinese",
    {
      input:
        "Super idol的笑容都没你的甜八月正午的阳光都没你耀眼热爱105度的你滴滴清纯的蒸馏水",
    },
    "的笑容都没你甜八月正午阳光耀眼热爱度滴清纯蒸馏水",
  ],
  [
    "Test Duplicate Characters",
    {
      input:
        "重复重复重复重复重复重复甲乙丙丁戊己庚辛甲乙丙丁戊己庚辛練習生練習生",
    },
    "重复甲乙丙丁戊己庚辛練習生",
  ],
  [
    "Test Gibberish Unicode",
    {
      input:
        "\u2ab8\u1752\u255f\u2c94\u2c02\u1dce\u1c7e\ub9c0\u1892\u2bb5\u29e9\u166f\u24e0\u058d\ua01b\u024c\u1c97\u05b6\u1315\u284c\u078b\u1ce3\u169c\u1962\u0e89\u220e\u1eb2\u19a1\u1176\u0079\u227e\u17e8\u0b7f\u017c\u15c4\u0c40\u1819\u1bb7\u2a41\u1b40\u08fb\u1ccc\u1bb4\ufffd\u1af5\u1f4b\ucd3b\u2bc1\u117b\u0ca7\u2147\u0510\u1e9b\u18e1\u08d5\u2b6a\u0463\u1749\u1ea2\uace7\u221b\u2dbb\u1658\u0b74\u026a\u11b2\u133b\u113d\u2881\u09b1\u2c97\u174a\u0a44\u2636\u1344\u1344\u2d0c\u018f\ua9d8\u0e96\u0716\u0870\u290b\u19b1\u2c81\u0cfe\u1e43\u174c\u1351\u0ec7\u2c17\u0c49\u0c74\u0867\u148c\u2906\u13da\u12e8\u0e5a\u0d1a",
    },
    ""
  ],
  [
    "Test Whitespace Only",
    {
      input: " \t \n ",
    },
    "",
  ],
  [
    "Test Mixed Whitespace And Chinese",
    {
      input: " 你好 世界 ",
    },
    "你好世界",
  ],
  [
    "Test Different Whitespace Encodings",
    {
      input: "你\u3000好\u00a0世\u200b界",
    },
    "你好世界",
  ],
  [
    "Test Emojis",
    {
      input: "🎵跳rap籃球music雞你太💄",
    },
    "跳籃球雞你太",
  ],
  [
    "Test Other CJK Characters",
    {
      input: "漢字（中文）、漢字（日本語）、한글（한국어）",
    },
    "漢字中文日本語",
  ],
  [
    "Test Rare Characters",
    {
      input: "𠀀𠜎𡃁",
    },
    "𠀀𠜎𡃁",
  ],
  // For the upcoming test cases, the input follows the pattern:
  // Unicode range start, Unicode range end, random unicode value between range (and repeat)
  [
    "Test CJK Unified + Expansion Characters A-D",
    {
      input:
        "\u{4e00}\u{9fff}\u{6fd1}\u{3400}\u{4dbf}\u{3f39}\u{20000}\u{2a6df}\u{25a34}\u{2a700}\u{2b739}\u{2b740}\u{2b81d}\u{2b7f7}",
    },
    "\u{4e00}\u{9fff}\u{6fd1}\u{3400}\u{4dbf}\u{3f39}\u{20000}\u{2a6df}\u{25a34}\u{2a700}\u{2b739}\u{2b740}\u{2b81d}\u{2b7f7}",
  ],
  [
    "Test Expansion Character E-I",
    {
      input:
        "\u{2B820}\u{2cea1}\u{2cd49}\u{2ceb0}\u{2ebe0}\u{2e1cb}\u{3104c}\u{31350}\u{323af}\u{320a3}\u{2ebf0}\u{2ee5d}\u{2ecc8}",
    },
    "\u{2B820}\u{2cea1}\u{2cd49}\u{2ceb0}\u{2ebe0}\u{2e1cb}\u{3104c}\u{31350}\u{323af}\u{320a3}\u{2ebf0}\u{2ee5d}\u{2ecc8}",
  ],
  [
    "Test CJK Compatability + Ideographs Supplement",
    {
      input: "\u{f900}\u{faD9}\u{fa8e}\u{2f800}\u{2fa1d}\u{2f86f}",
    },
    "\u{8c48}\u{9f8e}\u{641c}\u{4e3d}\u{2a600}\u{5be7}",
  ],
  [
    "Test Kangxi Radicals",
    {
      input: "\u{2f00}\u{2fd5}\u{2f59}",
    },
    "\u{4e00}\u{9fa0}\u{723f}",
  ],
  [
    "Test CJK Radicals Supplement",
    {
      input: "\u{2e80}\u{2ef3}\u{2ec4}",
    },
    "\u{2e80}\u{9f9f}\u{2ec4}",
  ],
  [
    "Test CJK Strokes",
    {
      input: "\u{31c0}\u{31e5}\u{31e3}",
    },
    "\u{31c0}\u{31e5}\u{31e3}",
  ],
];

const normalizationCases: TestCase[] = [
  [
    "Test Nothing To Normalize",
    {
      input: "迎面走来的你让我如此蠢蠢欲动",
      options: {
        normalizeUnicode: true,
      },
    },
    "迎面走来的你让我如此蠢欲动",
  ],
  [
    "Test Everything Normalized",
    {
      input: "\u{f90a}\u{f90b}\u{f90c}\u{f90e}",
      options: {
        normalizeUnicode: true,
      },
    },
    "金喇奈癩",
  ],
  [
    "Test Duplicate Removed By Default After Normalization",
    {
      input: "\u{f90a}\u{f90b}\u{f90c}\u{f90e}金喇奈癩",
      options: {
        normalizeUnicode: true,
      },
    },
    "金喇奈癩",
  ],
  [
    "Test Duplicate Note Removed With No Normalization",
    {
      input: "\u{f90a}\u{f90b}\u{f90c}\u{f90e}金喇奈癩",
      options: {
        normalizeUnicode: false,
      },
    },
    "\u{f90a}\u{f90b}\u{f90c}\u{f90e}金喇奈癩",
  ],
  [
    "Test Non Chinese No Normalization",
    {
      input: "！＠＃＄％＾＆＊（） Nothing here should survive",
      options: {
        normalizeUnicode: false,
      },
    },
    "",
  ],
  [
    "Test Everything Mixed Together",
    {
      input:
        "迎面走来的你让我如此蠢蠢欲动\u{f90a}\u{f90b}\u{f90c}\u{f90e}金喇奈癩！＠＃＄％＾＆＊（） Nothing here should survive",
      options: {
        normalizeUnicode: true,
      },
    },
    "迎面走来的你让我如此蠢欲动金喇奈癩",
  ],
  [
    "Test Everything Mixed Together Duplicates On",
    {
      input:
        "迎面走来的你让我如此蠢蠢欲动\u{f90a}\u{f90b}\u{f90c}\u{f90e}金喇奈癩！＠＃＄％＾＆＊（） Nothing here should survive",
      options: {
        normalizeUnicode: true,
        removeDuplicates: false,
      },
    },
    "迎面走来的你让我如此蠢蠢欲动金喇奈癩金喇奈癩",
  ],
  [
    "Test Unormalized Survives With Whitelist When Normalized",
    {
      input:
        "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
      options: {
        normalizeUnicode: true,
        includeCharacters: "\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
      },
    },
    "烙珞落酪駱亂\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
  ],
  [
    "Test Normalize",
    {
      input: "",
      options: {},
    },
    "",
  ],
  [
    "Test Normalize",
    {
      input: "",
      options: {},
    },
    "",
  ],
  [
    "Test Normalize",
    {
      input: "",
      options: {},
    },
    "",
  ],
  [
    "Test Normalize",
    {
      input: "",
      options: {},
    },
    "",
  ],
  [
    "Test Normalize",
    {
      input: "",
      options: {},
    },
    "",
  ],
];

describe.each(defaultCases)("Default Tests", (name, testInput, expected) => {
  test(name, () => {
    expect(extractChinese(testInput.input)).toBe(expected);
  });
});

describe.each(normalizationCases)("Normalization Tests", (name, testInput, expected) => {
  test(name, () => {
    expect(extractChinese(testInput.input, testInput.options)).toBe(expected);
  });
})
