const LESSONS = [
  {
    id: 1,
    title: "NDCってなに？",
    pages: [
      {
        visual: { type: "spine-label", code: "913.6" },
        messages: ["図書館の本の背に、こんな数字がついているのを見たことはありませんか？"],
      },
      {
        visual: { type: "mapping", items: [{ code: "913.6", subject: "文学" }] },
        messages: [
          "これは、本の内容を表すための数字です。",
          "日本の多くの図書館では、日本十進分類法、NDC（Nippon Decimal Classification）という分類法が使われています。",
        ],
      },
      {
        visual: {
          type: "examples",
          items: [
            { code: "100", subject: "哲学" },
            { code: "400", subject: "自然科学" },
            { code: "900", subject: "文学" },
          ],
          takeaway: "NDC＝本の内容を数字で表すしくみ",
        },
        messages: [
          "数字を見ると、その本がどんなテーマについての本なのか、だいたい分かるようになっています。",
          "いわば、本を探すための地図みたいなものですね。",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "まずは10個に分けよう",
    pages: [
      {
        visual: { type: "number-grid", numbers: ["000", "100", "200", "300", "400", "500", "600", "700", "800", "900"] },
        messages: [
          "NDCでは、あらゆるテーマを、まず10個の大きなグループに分けています。",
          "いきなり細かい数字を覚えなくても大丈夫ですよ。",
        ],
      },
      {
        visual: {
          type: "class-grid",
          items: ["総記", "哲学", "歴史", "社会科学", "自然科学", "技術", "産業", "芸術", "言語", "文学"],
        },
        messages: [
          "これがNDCのいちばん大きな分け方です。",
          "でも、10個を一気に覚えようとすると、ちょっと大変ですよね。",
        ],
      },
      {
        visual: {
          type: "memory-groups",
          caption: "覚え方のイメージ",
          groups: [
            { numbers: "1・2・3", subjects: "哲学・歴史・社会科学", label: "人間と社会" },
            { numbers: "4・5・6", subjects: "自然科学・技術・産業", label: "自然とものづくり" },
            { numbers: "7・8・9", subjects: "芸術・言語・文学", label: "表現と言葉" },
          ],
        },
        messages: [
          "私は、まず3つくらいのかたまりで見るのがおすすめです。",
          "1・2・3は、人間や社会。",
          "4・5・6は、自然やものづくり。",
          "7・8・9は、芸術や言葉。",
        ],
      },
      {
        visual: { type: "special-class", number: "0", subject: "総記" },
        messages: ["そして残った0類は、ちょっと特別です。", "これはあとで、ゆっくり見てみましょう。"],
      },
    ],
  },
  {
    id: 3,
    title: "数字を右へ読むと？",
    finishActions: ["training"],
    pages: [
      {
        visual: { type: "sequence", items: ["4", "49", "493"] },
        messages: ["ここからが、NDCのおもしろいところです。", "数字は、右へ進むほど内容が細かくなっていきます。"],
      },
      {
        visual: {
          type: "hierarchy",
          items: [
            { code: "400", subject: "自然科学" },
            { code: "490", subject: "医学" },
            { code: "493", subject: "内科学" },
          ],
        },
        messages: ["たとえば、400は自然科学。", "その中の490は医学。", "さらにその中の493は内科学です。"],
      },
      {
        visual: {
          type: "zoom-hierarchy",
          items: [
            { code: "400", subject: "自然科学" },
            { code: "490", subject: "医学" },
            { code: "493", subject: "内科学" },
          ],
          takeaway: "同じ世界を、だんだんズームして見る",
        },
        messages: [
          "400、490、493を、バラバラに覚える必要はありません。",
          "同じ世界を、だんだんズームして見ていると思うと分かりやすいですよ。",
        ],
      },
      {
        visual: {
          type: "mini-question",
          items: [{ code: "400", subject: "自然科学" }, { code: "480", subject: "？" }],
          question: "「480」は、400より……？",
          choices: [
            { id: "broad", label: "より広い" },
            { id: "specific", label: "より細かい" },
          ],
          answer: "specific",
          correctTitle: "その通りです！",
          correctText: "数字を右へ見ていくほど、テーマは細かくなっていきます。",
          wrongTitle: "おしい！",
          wrongText: "480は400の中をさらに細かく分けた数字なので、「より細かい」が正解です。何度でも選び直せます。",
        },
        messages: ["これが分かれば、NDCの数字がずいぶん読みやすくなりますよ。"],
      },
    ],
  },
];
