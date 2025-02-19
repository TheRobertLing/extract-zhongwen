import { extractChinese } from "../src/ExtractChinese";

type TestCase = [name: string, input: string, expected: Record<string, string>];

const cases: TestCase[] = [
  [
    "Empty String",
    "",
    {
      default: "",
      normalizationDisabled: "",
      removeDuplicates: "",
    },
  ],
  [
    "Punctuation Only",
    "。？！，、；：“”‘’『』「」（）[]〔〕【】—‖·-～《》〈〉_/",
    {
      default: "",
      normalizationDisabled: "",
      removeDuplicates: "",
    },
  ],
  [
    "Other Symbols/Letters",
    "!@#$%^&*()1234567890-=_+[]{}|;':\",./<>?",
    {
      default: "",
      normalizationDisabled: "",
      removeDuplicates: "",
    },
  ],
  [
    "All Simplified Characters",
    "全民制作人们大家好",
    {
      default: "全民制作人们大家好",
      normalizationDisabled: "全民制作人们大家好",
      removeDuplicates: "全民制作人们大家好",
    },
  ],
  [
    "All Traditional Characters",
    "練習時常兩年半的個人練習生",
    {
      default: "練習時常兩年半的個人練習生",
      normalizationDisabled: "練習時常兩年半的個人練習生",
      removeDuplicates: "練習時常兩年半的個人生",
    },
  ],
  [
    "Mixed Simplified Traditional",
    "全民制作人们大家好我是練習時常兩年半的個人練習生",
    {
      default: "全民制作人们大家好我是練習時常兩年半的個人練習生",
      normalizationDisabled: "全民制作人们大家好我是練習時常兩年半的個人練習生",
      removeDuplicates: "全民制作人们大家好我是練習時常兩年半的個生",
    },
  ],
  [
    "All English",
    "The Quick Brown Fox Jumped Over the Lazy Dog",
    {
      default: "",
      normalizationDisabled: "",
      removeDuplicates: "",
    },
  ],
  [
    "Mixed English/Chinese",
    "Super idol的笑容都没你的甜八月正午的阳光都没你耀眼热爱105度的你滴滴清纯的蒸馏水",
    {
      default:
        "的笑容都没你的甜八月正午的阳光都没你耀眼热爱度的你滴滴清纯的蒸馏水",
      normalizationDisabled:
        "的笑容都没你的甜八月正午的阳光都没你耀眼热爱度的你滴滴清纯的蒸馏水",
      removeDuplicates: "的笑容都没你甜八月正午阳光耀眼热爱度滴清纯蒸馏水",
    },
  ],
  [
    "No Duplicates Removed",
    "重复重复重复重复重复重复甲乙丙丁戊己庚辛甲乙丙丁戊己庚辛練習生練習生。？！，、；：“”‘’『』「」（）[]〔〕【】—‖·-～《》〈〉_/'!@#$%^&*()1234567890=+{}|;:\",.<>?",
    {
      default:
        "重复重复重复重复重复重复甲乙丙丁戊己庚辛甲乙丙丁戊己庚辛練習生練習生",
      normalizationDisabled:
        "重复重复重复重复重复重复甲乙丙丁戊己庚辛甲乙丙丁戊己庚辛練習生練習生",
      removeDuplicates: "重复甲乙丙丁戊己庚辛練習生",
    },
  ],
  [
    "Whitespace only",
    " \t \n ",
    {
      default: "",
      normalizationDisabled: "",
      removeDuplicates: "",
    },
  ],
  [
    "Mixed Whitespace & Chinese",
    " 你好 世界 ",
    {
      default: "你好世界",
      normalizationDisabled: "你好世界",
      removeDuplicates: "你好世界",
    },
  ],
  [
    "Different Whitespace Encodings",
    "你\u3000好\u00A0世\u200B界",
    {
      default: "你好世界",
      normalizationDisabled: "你好世界",
      removeDuplicates: "你好世界",
    },
  ],
  [
    "Emojis",
    "🎵跳rap籃球music雞你太💄",
    {
      default: "跳籃球雞你太",
      normalizationDisabled: "跳籃球雞你太",
      removeDuplicates: "跳籃球雞你太",
    },
  ],
  [
    "Other CJK characters",
    "漢字（中文）、漢字（日本語）、한글（한국어）",
    {
      default: "漢字中文漢字日本語",
      normalizationDisabled: "漢字中文漢字日本語",
      removeDuplicates: "漢字中文日本語",
    },
  ],
  [
    "CJK Unified + Expansion Characters A-D",
    "鶨鶻鶑秉秌禪㐖㐤䏛䤙䳓䴓㕣䶹\u{23C6B}\u{25D6F}\u{2760E}\u{28547}\u{2937F}\u{2a709}\u{2a74a}\u{2b3ca}\u{2b5e6}\u{2b6c8}\u{2B7B8}\u{2B7B0}",
    {
      default:
        "鶨鶻鶑秉秌禪㐖㐤䏛䤙䳓䴓㕣䶹\u{23C6B}\u{25D6F}\u{2760E}\u{28547}\u{2937F}\u{2a709}\u{2a74a}\u{2b3ca}\u{2b5e6}\u{2b6c8}\u{2B7B8}\u{2B7B0}",
      normalizationDisabled:
        "鶨鶻鶑秉秌禪㐖㐤䏛䤙䳓䴓㕣䶹\u{23C6B}\u{25D6F}\u{2760E}\u{28547}\u{2937F}\u{2a709}\u{2a74a}\u{2b3ca}\u{2b5e6}\u{2b6c8}\u{2B7B8}\u{2B7B0}",
      removeDuplicates:
        "鶨鶻鶑秉秌禪㐖㐤䏛䤙䳓䴓㕣䶹\u{23C6B}\u{25D6F}\u{2760E}\u{28547}\u{2937F}\u{2a709}\u{2a74a}\u{2b3ca}\u{2b5e6}\u{2b6c8}\u{2B7B8}\u{2B7B0}",
    },
  ],
  [
    "Expansion Characters E-I",
    "\u{2B820}\u{2B865}\u{2BF9E}\u{2CEB0}\u{2E907}\u{2EBE0}\u{3002E}\u{30000}\u{3134A}\u{31350}\u{3184C}\u{323AF}\u{2EBF0}\u{2EE5D}\u{2EC7C}",
    {
      default:
        "\u{2B820}\u{2B865}\u{2BF9E}\u{2CEB0}\u{2E907}\u{2EBE0}\u{3002E}\u{30000}\u{3134A}\u{31350}\u{3184C}\u{323AF}\u{2EBF0}\u{2EE5D}\u{2EC7C}",
      normalizationDisabled:
        "\u{2B820}\u{2B865}\u{2BF9E}\u{2CEB0}\u{2E907}\u{2EBE0}\u{3002E}\u{30000}\u{3134A}\u{31350}\u{3184C}\u{323AF}\u{2EBF0}\u{2EE5D}\u{2EC7C}",
      removeDuplicates:
        "\u{2B820}\u{2B865}\u{2BF9E}\u{2CEB0}\u{2E907}\u{2EBE0}\u{3002E}\u{30000}\u{3134A}\u{31350}\u{3184C}\u{323AF}\u{2EBF0}\u{2EE5D}\u{2EC7C}",
    },
  ],
  [
    "CJK Compatability Normalization",
    "\uf900\uF91C\uF9B5\u{2F800}\u{2F9E0}",
    {
      default: "\u8c48\u5375\u4F8B\u4E3D\u{285D2}",
      normalizationDisabled: "\uf900\uF91C\uF9B5\u{2F800}\u{2F9E0}",
      removeDuplicates: "\u8c48\u5375\u4F8B\u4E3D\u{285D2}",
    },
  ],
  [
    "Rare Characters",
    "𠀀𠜎𡃁",
    {
      default: "𠀀𠜎𡃁",
      normalizationDisabled: "𠀀𠜎𡃁",
      removeDuplicates: "𠀀𠜎𡃁",
    },
  ],
];

describe.each(cases)(
  "Test extractChinese with default params",
  (name, input, expected) => {
    test(name, () => {
      // Default cases
      expect(extractChinese(input)).toBe(expected.default);

      // Disable Unicode Normalization
      expect(extractChinese(input, { normalizeUnicode: false })).toBe(
        expected.normalizationDisabled
      );

      // Remove Duplicates
      expect(extractChinese(input, { removeDuplicates: true })).toBe(
        expected.removeDuplicates
      );
    });
  }
);
