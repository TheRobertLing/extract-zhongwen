import { describe, expect, test } from "@jest/globals";
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
    "",
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
    "Test Everything Mixed Together Duplicates Off",
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
    "Test Whitelist Preserves Non Normalized Characters",
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
    "Test Normalized Whitelist Does Nothing ",
    {
      input:
        "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
      options: {
        normalizeUnicode: true,
        includeCharacters: "卵欄爛蘭鸞嵐", // Use normalized versions
      },
    },
    "烙珞落酪駱亂卵欄爛蘭鸞嵐",
  ],
  [
    "Test Not Normalized Whitelist Does Nothing",
    {
      input:
        "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
      options: {
        normalizeUnicode: false,
        includeCharacters: "\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}", // Whitelist should not matter
      },
    },
    "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
  ],
  [
    "Test Normalized Whitelist Preserves Nothing",
    {
      input:
        "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
      options: {
        normalizeUnicode: false,
        includeCharacters: "卵欄爛蘭鸞嵐",
      },
    },
    "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
  ],

  [
    "Blacklist Removes Not Normalized Input",
    {
      input:
        "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
      options: {
        normalizeUnicode: false,
        excludeCharacters: "\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
      },
    },
    "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}",
  ],
  [
    "Test Normalized Blacklist Input Does Not Exclude Corresponding Note Normalized Input",
    {
      input:
        "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
      options: {
        normalizeUnicode: false,
        excludeCharacters: "卵欄爛蘭鸞嵐",
      },
    },
    "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
  ],
  [
    "Test Not Nomralized Blacklist Does Not Exclude Corresponding Normalized Input",
    {
      input:
        "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
      options: {
        normalizeUnicode: true,
        excludeCharacters: "\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
      },
    },
    "烙珞落酪駱亂",
  ],
  [
    "Test Normalized Blacklist Excludes Normalized Input",
    {
      input:
        "\u{f916}\u{f917}\u{f918}\u{f919}\u{f91a}\u{f91b}\u{f91c}\u{f91d}\u{f91e}\u{f91f}\u{f920}\u{f921}",
      options: {
        normalizeUnicode: true,
        excludeCharacters: "卵欄爛蘭鸞嵐",
      },
    },
    "烙珞落酪駱亂",
  ],
];

const duplicationTests: TestCase[] = [
  [
    "Test Non Chinese Duplicate Off",
    {
      input:
        "aaabbbcccdddeeefffAAABBBCCEEDDDEFEFAFOJAF102391029383!)@(#*!)#*(@",
      options: {
        removeDuplicates: true,
      },
    },
    "",
  ],
  [
    "Test Non Chinese Duplicate On",
    {
      input:
        "aaabbbcccdddeeefffAAABBBCCEEDDDEFEFAFOJAF102391029383!)@(#*!)#*(@",
      options: {
        removeDuplicates: false,
      },
    },
    "",
  ],
  [
    "Test Chinese Duplicate On",
    {
      input: "反反复复圈圈圆圆圈圈天天年年天天的我",
      options: {
        removeDuplicates: true,
      },
    },
    "反复圈圆天年的我",
  ],
  [
    "Test Chinese Duplicate Off",
    {
      input: "反反复复圈圈圆圆圈圈天天年年天天的我",
      options: {
        removeDuplicates: false,
      },
    },
    "反反复复圈圈圆圆圈圈天天年年天天的我",
  ],
  [
    "Test Normalized Duplicates",
    {
      input:
        "\uf939\uf93a\uf93b\uf93c\uf93d\uf93e\uf93f\uf940\uf941\uf942\uf943\uf944魯鷺碌祿綠菉錄鹿論壟弄籠", // Have both normalized and not normalized
      options: {
        removeDuplicates: true,
      },
    },
    "魯鷺碌祿綠菉錄鹿論壟弄籠",
  ],
  [
    "Test Normalized Duplicates",
    {
      input:
        "\uf939\uf93a\uf93b\uf93c\uf93d\uf93e\uf93f\uf940\uf941\uf942\uf943\uf944魯鷺碌祿綠菉錄鹿論壟弄籠",
      options: {
        removeDuplicates: true,
        includeCharacters:
          "\uf939\uf93a\uf93b\uf93c\uf93d\uf93e\uf93f\uf940\uf941\uf942\uf943\uf944",
      },
    },
    "\uf939\uf93a\uf93b\uf93c\uf93d\uf93e\uf93f\uf940\uf941\uf942\uf943\uf944魯鷺碌祿綠菉錄鹿論壟弄籠", // *technically* not duplicates since unicode is different
  ],
  [
    "Test Mixed Chinese and Non-Chinese Duplicate Removal",
    {
      input: "反反复复ABCABC123123天天的我",
      options: { removeDuplicates: true },
    },
    "反复天的我",
  ],
  [
    "Test Chinese Duplicates with Punctuation",
    {
      input: "反，反，复，复，圈，圈，圆，圆，的，我。",
      options: { removeDuplicates: true },
    },
    "反复圈圆的我",
  ],
  [
    "Test Chinese Duplicates with Punctuation Whitelisted",
    {
      input: "反，反，复，复，圈，圈，圆，圆，的，我。",
      options: { removeDuplicates: true, includeCharacters: "，。" },
    },
    "反，复圈圆的我。",
  ],
  [
    "Test Full-Width and Half-Width Characters",
    {
      input: "ＡＡＡＢＢＢＣＣＣ反反复复",
      options: { removeDuplicates: true },
    },
    "反复",
  ],
];

const includeCharactersTests: TestCase[] = [
  [
    "Test Inclusion",
    {
      input: "notCJKCharacters",
      options: {
        includeCharacters: "notCJKCharacters",
      },
    },
    "notCJKharces",
  ],
  [
    "Test Whitelist Characters Not In Input",
    {
      input: "abcdefgABCDEFG燃烧我的卡路里",
      options: {
        includeCharacters: "zyxwvut鸡你太美",
      },
    },
    "燃烧我的卡路里",
  ],
  [
    "Test Whitelist Characters Partially Included",
    {
      input: "abcdefgABCDEFG燃烧我的卡路里",
      options: {
        includeCharacters: "abcABC",
      },
    },
    "abcABC燃烧我的卡路里",
  ],
  [
    "Test Whitelist Characters Contain Already Valid Characters",
    {
      input: "沙雕动画",
      options: {
        includeCharacters: "沙雕动画",
      },
    },
    "沙雕动画",
  ],
  [
    "Test Whitelist Characters Are Repeated",
    {
      input: "十三先生的万能系统",
      options: {
        includeCharacters: "十十十十十三三三三",
      },
    },
    "十三先生的万能系统",
  ],
  [
    "Test Whitelist Both Normalized And Not Normalized",
    {
      input:
        "，。、；’【】,./;'[]filterthispartout\u{f90a}\u{f90b}\u{f90c}\u{f90e}菩提老祖",
      options: {
        normalizeUnicode: false,
        includeCharacters:
          "，。、；’【】,./;'[]\u{f90a}\u{f90b}\u{f90c}\u{f90e}菩提老祖",
      },
    },
    "，。、；’【】,./;'[]\u{f90a}\u{f90b}\u{f90c}\u{f90e}菩提老祖",
  ],
  [
    "Test Whitelist And Blacklist Share Characters",
    {
      input: "混沌未分天地乱，茫茫渺渺无人见。",
      options: {
        normalizeUnicode: false,
        includeCharacters: "，。",
        excludeCharacters: "，。", // blacklist takes priority
      },
    },
    "混沌未分天地乱茫渺无人见",
  ],
  [
    "Test Whitelist Whitespaces",
    {
      input: "混 沌 未 分 天 地 乱 ",
      options: {
        removeDuplicates: false,
        normalizeUnicode: false,
        includeCharacters: "，。 ",
      },
    },
    "混 沌 未 分 天 地 乱 ",
  ],
];

const excludeCharactersTests: TestCase[] = [
  [
    "Test Exclude Non Valid Chinese",
    {
      input: "notCJKCharacters",
      options: {
        excludeCharacters: "notCJKCharacters", // Shouldn't affect anything
      },
    },
    "",
  ],
  [
    "Test Valid Chinese",
    {
      input: "统一码仓颉五笔笔画笔顺拼音注音",
      options: {
        excludeCharacters: "统一码仓颉",
      },
    },
    "五笔画顺拼音注",
  ],
  [
    "Test Exclude Characters Not In Input",
    {
      input: "我是小猪佩奇",
      options: {
        excludeCharacters: "乔治恐龙先生",
      },
    },
    "我是小猪佩奇",
  ],
  [
    "Test Exclude Characters Partial In Input",
    {
      input: "我是小猪佩奇",
      options: {
        excludeCharacters: "乔治恐龙先生佩奇",
      },
    },
    "我是小猪",
  ],
];

describe.each(defaultCases)("Default Tests", (name, testInput, expected) => {
  test(name, () => {
    expect(extractChinese(testInput.input)).toBe(expected);
  });
});

describe.each(normalizationCases)(
  "Normalization Tests",
  (name, testInput, expected) => {
    test(name, () => {
      expect(extractChinese(testInput.input, testInput.options)).toBe(expected);
    });
  }
);

describe.each(duplicationTests)(
  "Duplicate Tests",
  (name, testInput, expected) => {
    test(name, () => {
      expect(extractChinese(testInput.input, testInput.options)).toBe(expected);
    });
  }
);

describe.each(includeCharactersTests)(
  "Duplicate Tests",
  (name, testInput, expected) => {
    test(name, () => {
      expect(extractChinese(testInput.input, testInput.options)).toBe(expected);
    });
  }
);

describe.each(excludeCharactersTests)(
  "Duplicate Tests",
  (name, testInput, expected) => {
    test(name, () => {
      expect(extractChinese(testInput.input, testInput.options)).toBe(expected);
    });
  }
);

describe("User Tests", () => {
  test("The Frontend Developer Validating User Input", () => {
    // The normal user
    expect(
      extractChinese("ru3guo3zai4jian4bu4neng2hong2zheyan3 是否还能红着脸")
    ).toBe("是否还能红着脸");

    // The I did not toggle the right search mode
    expect(
      extractChinese(
        "Is this working? ㄋㄧˇ ㄅㄨˋ ㄧㄠˋ ㄍㄨㄛˋ ㄌㄞˊ ㄧㄚ tbof erbk"
      )
    ).toBe("");

    // The I thought this was LaTeX
    expect(
      extractChinese(
        "设函数 f(x) = \\int_{0}^{x} e^{-t^2} dt，求其导数 f'(x)。"
      )
    ).toBe("设函数求其导");

    // The I thought this was a regex explainer
    expect(
      extractChinese(
        "匹配所有数字: \\d+，匹配所有字母: [a-zA-Z]+，匹配空白: \\s"
      )
    ).toBe("匹配所有数字母空白");

    // The I accidentally pasted my react component here (larger input)
    expect(
      extractChinese(`
        import { useState, useEffect } from "react";
        import { Card, CardContent } from "@/components/ui/card";
        import { Input } from "@/components/ui/input";
        import { Button } from "@/components/ui/button";
        import { Star, Search } from "lucide-react";
        import { motion } from "framer-motion";

        const mockData = [
          { id: "btc", name: "Bitcoin", price: 48250 },
          { id: "eth", name: "Ethereum", price: 3100 },
          { id: "sol", name: "Solana", price: 145 },
          { id: "ada", name: "Cardano", price: 0.65 },
        ];

        export default function CryptoTracker() {
          const [coins, setCoins] = useState(mockData);
          const [favorites, setFavorites] = useState<string[]>([]);
          const [search, setSearch] = useState("");

          useEffect(() => {
            // Simulate API call
            const interval = setInterval(() => {
              setCoins((prevCoins) =>
                prevCoins.map((coin) => ({
                  ...coin,
                  price: (coin.price * (0.95 + Math.random() * 0.1)).toFixed(2),
                }))
              );
            }, 5000);
            return () => clearInterval(interval);
          }, []);

          const toggleFavorite = (id: string) => {
            setFavorites((prev) =>
              prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
            );
          };

          const filteredCoins = coins.filter((coin) =>
            coin.name.toLowerCase().includes(search.toLowerCase())
          );

          return (
            <div className="p-4 max-w-xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search crypto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {filteredCoins.map((coin) => (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-4 flex justify-between items-center">
                      <div>
                        <h2 className="font-semibold">{coin.name}</h2>
                        <p className="text-gray-500">\${coin.price}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(coin.id)}
                      >
                        <Star
                          className={w-5 h-5 \${
                            favorites.includes(coin.id)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-400"
                          }\`}
                        />
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        }  
      `)
    ).toBe("");

    // The I want to try hack the website
    expect(
      extractChinese(`
      " <script>alert("你的电脑被黑了")</script>
    `)
    ).toBe("你的电脑被黑了");

    // The I just lost my 50 / 50 to QiQi on the Mavuika Banner
    expect(
      extractChinese("玛维卡圣遗物推荐  mjhnghnvcbfndftgbhujmyhik,ul8.yol.p;/'")
    ).toBe("玛维卡圣遗物推荐");
  });
});
