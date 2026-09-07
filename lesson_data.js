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
          "日本の多くの図書館では、NDC（Nippon Decimal Classification）という分類法が使われています。",
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
          "数字を見ると、その本がどんなテーマを扱っているか、だいたい分かります。",
          "いわば、本を探すための地図のようなものですね。",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "まずは0〜9を知ろう",
    pages: [
      {
        visual: { type: "number-grid", numbers: ["000", "100", "200", "300", "400", "500", "600", "700", "800", "900"] },
        messages: [
          "NDCでは、あらゆるテーマをまず10個の大きなグループに分けています。",
          "いきなり細かい数字を覚えなくても大丈夫ですよ。",
        ],
      },
      {
        visual: {
          type: "class-grid",
          items: ["総記", "哲学", "歴史", "社会科学", "自然科学", "技術", "産業", "芸術", "言語", "文学"],
        },
        messages: [
          "これが、NDCで最も大きな分け方です。",
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
          "まず、3つのかたまりに分けて見るのがおすすめです。",
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
    title: "数字はだんだん細かくなる",
    finishActions: [
      { action: "training-options", label: "0〜9類を練習してみる", kind: "primary" },
    ],
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
  {
    id: 4,
    title: "0類って何者？",
    pages: [
      {
        visual: { type: "hero-card", code: "0", title: "総記", subtitle: "ちょっと特別な0類" },
        messages: [
          "第2講で、0類だけ少し特別だとお話ししましたね。",
          "では、0類にはどんな本が集まっているのでしょうか。",
        ],
      },
      {
        visual: {
          type: "topic-cards",
          items: [
            { title: "情報・コンピュータ" },
            { title: "図書館・出版" },
            { title: "百科事典" },
            { title: "新聞・ジャーナリズム" },
          ],
        },
        messages: [
          "0類には、いろいろな分野にまたがる総合的な資料が集まっています。",
          "さらに、情報・図書館・出版など、知識や情報に関わるテーマも含まれます。",
        ],
      },
      {
        visual: {
          type: "compare-cards",
          items: [
            { code: "1〜9類", title: "それぞれのテーマの世界" },
            { code: "0類", title: "総合・知識や情報" },
          ],
          takeaway: "0類＝総合的なもの＋知識や情報を扱う分野",
        },
        messages: [
          "0類は、総合的な資料だけを置く場所ではありません。",
          "知識や情報そのものを扱う分野も含む、少し特別な類です。",
        ],
      },
      {
        visual: {
          type: "mini-question",
          items: [{ code: "百科事典", subject: "いろいろなテーマ" }],
          question: "「百科事典」は、まず何類を考える？",
          choices: [
            { id: "0", label: "0類" },
            { id: "2", label: "2類" },
            { id: "9", label: "9類" },
          ],
          answer: "0",
          correctTitle: "その通りです！",
          correctText: "百科事典は、いろいろなテーマを扱うので、まず0類を考えます。",
          wrongTitle: "もう一度考えてみましょう",
          wrongText: "百科事典は、特定の1分野だけではなく、いろいろなテーマを扱います。まず0類を考えてみましょう。",
        },
        messages: ["0類のイメージを確認してみましょう。"],
      },
    ],
  },
  {
    id: 5,
    title: "1〜3類を覚えよう",
    pages: [
      {
        visual: {
          type: "topic-cards",
          caption: "覚え方のイメージ「人間と社会」",
          items: [
            { code: "1", title: "哲学" },
            { code: "2", title: "歴史" },
            { code: "3", title: "社会科学" },
          ],
          note: "※「人間と社会」は、覚えるための補助表現です。",
        },
        messages: [
          "まずは1・2・3類です。",
          "この3つは、「人間と社会」のゾーンとしてまとめて見ると覚えやすいですよ。",
        ],
      },
      {
        visual: {
          type: "topic-cards",
          items: [
            { code: "1", title: "哲学", description: "考える・心・信じる" },
            { code: "2", title: "歴史", description: "時間・場所・人をたどる" },
            { code: "3", title: "社会科学", description: "社会のしくみ" },
          ],
        },
        messages: [
          "1類は、人の考え方や心。",
          "2類は、歴史や人物、場所。",
          "3類は、人が集まってできる社会のしくみです。",
        ],
      },
      {
        visual: {
          type: "flow-cards",
          items: [
            { code: "1", title: "人が考える" },
            { code: "2", title: "人が歩んできた" },
            { code: "3", title: "人が集まって社会をつくる" },
          ],
        },
        messages: [
          "こんなふうに流れで見ると、3つの数字が少しつながって見えてきませんか？",
          "1・2・3を、バラバラの暗記にしないのがコツです。",
        ],
      },
      {
        visual: {
          type: "mini-question",
          items: [{ code: "教育", subject: "社会のしくみに関わる" }],
          question: "「教育についての本」は、どの類に近い？",
          choices: [
            { id: "1", label: "1類" },
            { id: "2", label: "2類" },
            { id: "3", label: "3類" },
          ],
          answer: "3",
          correctTitle: "その通りです！",
          correctText: "教育は、社会のしくみに関わるテーマなので3類です。",
          wrongTitle: "おしい！",
          wrongText: "教育は、人が集まる社会のしくみに関わるテーマです。3類を考えてみましょう。",
        },
        messages: ["1〜3類のつながりを確認してみましょう。"],
      },
    ],
  },
  {
    id: 6,
    title: "4〜6類を覚えよう",
    pages: [
      {
        visual: {
          type: "topic-cards",
          caption: "覚え方のイメージ「自然とものづくり」",
          items: [
            { code: "4", title: "自然科学" },
            { code: "5", title: "技術" },
            { code: "6", title: "産業" },
          ],
        },
        messages: [
          "次は4・5・6類です。",
          "ここは、「自然を知る」から「ものづくりや産業」へ進む流れで見ると、覚えやすいですよ。",
        ],
      },
      {
        visual: {
          type: "topic-cards",
          items: [
            { code: "4", title: "自然科学", description: "自然のしくみを「知る」" },
            { code: "5", title: "技術", description: "知識を使って「作る」" },
            { code: "6", title: "産業", description: "育てる・売る・運ぶ" },
          ],
        },
        messages: [
          "4類は、自然のしくみを知る世界。",
          "5類は、その知識を使ってものを作る世界。",
          "6類は、ものを育てたり、売ったり、運んだりする世界です。",
        ],
      },
      {
        visual: {
          type: "flow-cards",
          items: [
            { code: "4", title: "自然を知る" },
            { code: "5", title: "作る" },
            { code: "6", title: "社会の中で動かす" },
          ],
        },
        messages: [
          "自然を知る。知識を使って作る。そして、それを社会の中で動かす。",
          "4・5・6は、この流れで覚えてみましょう。",
        ],
      },
      {
        visual: {
          type: "mini-question",
          items: [{ code: "建築", subject: "知識を使って作る" }],
          question: "「建築についての本」は、どの類に近い？",
          choices: [
            { id: "4", label: "4類" },
            { id: "5", label: "5類" },
            { id: "6", label: "6類" },
          ],
          answer: "5",
          correctTitle: "その通りです！",
          correctText: "建築は、知識を使ってものを作る「技術」の世界なので5類です。",
          wrongTitle: "おしい！",
          wrongText: "建築は、知識を使ってものを作る「技術」の世界です。5類を考えてみましょう。",
        },
        messages: ["4〜6類の流れを確認してみましょう。"],
      },
    ],
  },
  {
    id: 7,
    title: "7〜9類を覚えよう",
    pages: [
      {
        visual: {
          type: "topic-cards",
          caption: "覚え方のイメージ「表現と言葉」",
          items: [
            { code: "7", title: "芸術" },
            { code: "8", title: "言語" },
            { code: "9", title: "文学" },
          ],
        },
        messages: [
          "最後は7・8・9類です。",
          "ここは、「表現と言葉」のゾーンとしてまとめてみましょう。",
        ],
      },
      {
        visual: {
          type: "topic-cards",
          items: [
            { code: "7", title: "芸術", description: "表現する・楽しむ" },
            { code: "8", title: "言語", description: "ことばそのもの" },
            { code: "9", title: "文学", description: "文学作品・文学についての本" },
          ],
        },
        messages: [
          "7類は、美術や音楽、スポーツなどの表現や楽しみ。",
          "8類は、ことばそのもの。",
          "9類は、文学作品や、文学についての本です。",
        ],
      },
      {
        visual: {
          type: "compare-cards",
          emphasis: true,
          items: [
            { code: "8類", title: "英語について学ぶ本" },
            { code: "9類", title: "英語で書かれた小説" },
          ],
          takeaway: "ことばそのものか、文学についてかを見る",
        },
        messages: [
          "本文が英語だから8類になるわけではありません。",
          "「英語そのものについての本」なのか、「文学についての本」なのかを見ましょう。",
        ],
      },
      {
        visual: {
          type: "mini-question",
          items: [{ code: "英語の文法", subject: "ことばそのもの" }],
          question: "「英語の文法を学ぶ本」は何類？",
          choices: [
            { id: "7", label: "7類" },
            { id: "8", label: "8類" },
            { id: "9", label: "9類" },
          ],
          answer: "8",
          correctTitle: "その通りです！",
          correctText: "英語の文法は、ことばそのものを学ぶので8類です。",
          wrongTitle: "おしい！",
          wrongText: "英語の文法は、ことばそのものについての本です。8類を考えてみましょう。",
        },
        messages: ["8類と9類の違いを確認してみましょう。"],
      },
    ],
  },
  {
    id: 8,
    title: "迷いやすい分類",
    pages: [
      {
        visual: {
          type: "statement",
          title: "同じ言葉があっても、",
          lines: ["分類は同じとは限らない"],
          takeaway: "その本は、何について書かれている？",
        },
        messages: [
          "分類に迷う本も出てきます。",
          "そんなときは、タイトルの言葉だけでなく、「何について書かれているか」を見ましょう。",
        ],
      },
      {
        visual: {
          type: "compare-cards",
          items: [
            { code: "4類", title: "自然のしくみを知る", description: "電気の性質" },
            { code: "5類", title: "知識を使って作る", description: "電気を使った機械" },
          ],
        },
        messages: [
          "たとえば電気でも、電気そのもののしくみなら4類。",
          "それを利用した機械や技術の話なら5類に近づきます。",
        ],
      },
      {
        visual: {
          type: "compare-cards",
          items: [
            { code: "8類", title: "英語そのものを学ぶ" },
            { code: "9類", title: "英語で書かれた小説" },
          ],
        },
        messages: [
          "本文が英語だから8類になるわけではありません。",
          "英語そのものが主題なら8類、文学が主題なら9類です。",
        ],
      },
      {
        visual: {
          type: "mini-question",
          items: [{ code: "植物の育て方", subject: "植物を育てる" }],
          question: "「植物の育て方についての本」は、\nどちらに近い？",
          choices: [
            { id: "4", label: "4類 自然科学" },
            { id: "6", label: "6類 産業" },
          ],
          answer: "6",
          correctTitle: "その通りです！",
          correctText: "「育て方」は農業などの産業に近いテーマなので6類です。",
          wrongTitle: "考えるポイント",
          wrongText: "植物そのもののしくみを研究するなら4類ですが、「育て方」は農業などの産業に近いテーマです。",
          takeaway: "分類するときは、「この本は何についての本？」と考えよう",
        },
        messages: ["主題を見分ける問題に挑戦してみましょう。"],
      },
    ],
  },
  {
    id: 9,
    title: "本棚を歩いてみよう",
    pages: [
      {
        visual: {
          type: "shelf",
          items: [
            { code: "000", title: "総記" },
            { code: "100", title: "哲学" },
            { code: "200", title: "歴史" },
            { code: "300", title: "社会科学" },
          ],
        },
        messages: [
          "では、今度はNDCを「本棚」として見てみましょう。",
          "数字が大きくなるにつれて、本棚の中を少しずつ歩いていくイメージです。",
        ],
      },
      {
        visual: {
          type: "shelf",
          items: [
            { code: "400", title: "自然科学" },
            { code: "500", title: "技術" },
            { code: "600", title: "産業" },
          ],
        },
        messages: [
          "400番台の自然科学から、500番台の技術、600番台の産業へ進みます。",
          "「知る→作る→動かす」の流れですね。",
        ],
      },
      {
        visual: {
          type: "shelf",
          items: [
            { code: "700", title: "芸術" },
            { code: "800", title: "言語" },
            { code: "900", title: "文学" },
          ],
        },
        messages: [
          "そして700番台からは、芸術、言語、文学。",
          "本棚の終わりの方は、「表現と言葉」のゾーンです。",
        ],
      },
      {
        visual: {
          type: "shelf",
          compact: true,
          items: [
            { code: "0", title: "総記" },
            { code: "1", title: "哲学" },
            { code: "2", title: "歴史" },
            { code: "3", title: "社会科学" },
            { code: "4", title: "自然科学" },
            { code: "5", title: "技術" },
            { code: "6", title: "産業" },
            { code: "7", title: "芸術" },
            { code: "8", title: "言語" },
            { code: "9", title: "文学" },
          ],
          takeaway: "分類＝本棚の地図",
        },
        messages: [
          "NDCは、10個の数字をただ暗記するものではありません。",
          "本棚のどこにいるかを教えてくれる地図だと考えてみましょう。",
        ],
      },
    ],
  },
  {
    id: 10,
    title: "いざクイズへ！",
    finishActions: [
      { action: "quiz-options", label: "クイズに挑戦する", kind: "primary" },
      { action: "training-options", label: "トレーニングしてみる", kind: "accent" },
    ],
    pages: [
      {
        visual: {
          type: "topic-cards",
          caption: "まず大きな世界を見る",
          items: [
            { code: "0", title: "ちょっと特別" },
            { code: "1・2・3", title: "人間と社会" },
            { code: "4・5・6", title: "自然→作る→育てる" },
            { code: "7・8・9", title: "表現と言葉" },
          ],
        },
        messages: [
          "最後に、ここまでの覚え方を振り返ってみましょう。",
          "まずは、0〜9の大きな世界を思い出せれば十分です。",
        ],
      },
      {
        visual: {
          type: "flow-cards",
          items: [
            { code: "400", title: "自然科学" },
            { code: "490", title: "医学" },
            { code: "493", title: "内科学" },
          ],
          takeaway: "右へ進むほど詳しくなる",
        },
        messages: [
          "数字は、右へ進むほどテーマが細かくなります。",
          "知らない数字でも、左側を見れば、大まかな分野を推測できます。",
        ],
      },
      {
        visual: {
          type: "statement",
          title: "対応を考えるコツ",
          lines: ["まず大きな分野", "次に細かく絞る"],
        },
        messages: [
          "分類番号は左から読み、最初の数字で0〜9類の大きな分野を確かめます。",
          "主題から考えるときも、大きな分野を決めてから細かく絞りましょう。",
        ],
      },
      {
        visual: {
          type: "statement",
          title: "全部覚えていなくても大丈夫！",
          lines: ["まずは", "「このあたりかな？」から"],
        },
        messages: [
          "全部を暗記していなくても大丈夫です。",
          "間違えながら、大まかな対応を覚えていきましょう。",
        ],
      },
    ],
  },
];
