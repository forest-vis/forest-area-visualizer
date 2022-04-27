

const AREA_INFO = {
  Australia: "オーストラリアでは特に南東部で森林火災が繰り返し発生し、二酸化炭素の増加や野生動物への影響が問題になっています。",
  Bolivia: "地球の肺とも呼ばれるアマゾンが存在するボリビアですが、農業地開発や違法な森林伐採、大規模な森林火災が問題になっています。",
  Brazil: "地球の肺とも呼ばれるアマゾンが存在するブラジルですが、農業地開発や違法な森林伐採、大規模な森林火災が問題になっています。",
  Congo: "コンゴ盆地に広がる熱帯雨林は、アマゾンに次いで世界2番目の広さを持つ森林です。",
  Indonesia: "インドネシアでは違法な森林伐採や、大規模な農地開発で森林面積の減少が深刻化しています。",
  Madagascar: "マダガスカルではローズウッドやコクタンと言った高価な木材が違法に択伐され、ここ数十年間問題になっています。",
  Myanmar: "ミャンマーでは北部辺境の農地開発が森林破壊の最も大きな原因の一つであるとされています。",
  Nigeria: "ナイジェリアでは国民の大半は調理用燃料を薪や炭に頼っており、木炭を作るための森林の伐採が進んでいます。",
  Tanzania: "タンザニアでは森林伐採や、大規模な農地開発で森林面積の減少が深刻化しています。",
}


const COUNTRY_NAME_JP = {
  Australia: "オーストラリア",
  Bolivia: "ボリビア",
  Brazil: "ブラジル",
  Congo: "コンゴ",
  Indonesia: "インドネシア",
  Madagascar: "マダガスカル",
  Myanmar: "ミャンマー",
  Nigeria: "ナイジェリア",
  Tanzania: "タンザニア",
}

export const rotOffset = {
  Australia: 0.0,
  Bolivia: 0.0,
  Brazil: 0.0,
  Congo: 0.0,
  Indonesia: -0.0,
  Madagascar: 0.0,
  Myanmar: 0.0,
  Nigeria: 0.0,
  Tanzania: 0.0,
  Japan: 0.0,
}

const getCaption = (index, countryName,) => {

  let caption = "";


  if (countryName == "Japan") {
    switch (index) {
      case 0:
        caption = "これは日本の森林率の変化を可視化したものです。";
        break;

      case 1:
        caption = "日本の国土面積に占める森林面積は約7割で、世界的に見ても森林大国と言えます。";
        break;

      case 2:
        caption = "ここ数十年間で森林面積の増減はあまりありません。しかし日本の森林は森林破壊とは別の問題を抱えています。";
        break;

      case 3:
        caption = "成熟した木が使われないまま放置され、荒廃している森林が目立つようになり土砂災害のリスクを高めています。";
        break;

      case 4:
        caption = "今の日本では、森林の適度な間伐と、国内産業への有効活用が求められています。";
        break;
    }
  } else {
    switch (index) {
      case 0:
        caption = "世界の森林は減少を続けており、毎年520万ヘクタールが減少しています。";
        break;

      case 1:
        caption = "これは" + COUNTRY_NAME_JP[countryName] + "での2000年から2020年の森林率の変化を可視化したものです。";
        break;

      case 2:
        caption = "赤のエリアは2000年以降に森林が喪失した地域、緑のエリアは森林が保持されている地域です。";
        break;

      case 3:
        caption = AREA_INFO[countryName];
        break;

      case 4:
        caption = "国土面積をグリッドに分け、森林率が喪失した地域と保持されている地域の割合を計算するとこの様になります。";
        break;
    }

  }

  return caption;


}

export default getCaption