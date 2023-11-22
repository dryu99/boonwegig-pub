// TODO this used to be a json file but i got too frustrated with no comments.
//      maybe look into another jsonish file format

// Seoul
// "clubsteelface", // TODO doesn't post often
// "spacebrickkorea" // TODO posts events but with multiple days

// CA: {
//   Vancouver: [
//     "the.pearl.vancouver",
//     "foxcabaret",
//     "thecobalt_van",
//     "commodoreballroom",
//     "greenautomusic",
//   ],
// },

// Chuncheon: ["ssmadang.cc"],
// Daegu: ["jamesrecord"],

type ScrapeableVenue = {
  instagramUsername: string;
  city: string;
  country: string;
  externalMapsJson: {
    googleMapsUrl?: string;
    kakaoMapsUrl?: string;
    naverMapsUrl?: string;
  };
  skip: boolean;
};

const seoulVenues: ScrapeableVenue[] = [
  {
    instagramUsername: "musinsagarage",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Musinsa+Garage/data=!4m6!3m5!1s0x357c99e21f281c77:0x37b8cb2577692919!8m2!3d37.5515437!4d126.9197803!16s%2Fg%2F11kc8f_3jc?entry=ttu",
      kakaoMapsUrl: "https://place.map.kakao.com/1123419577",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1485838302",
    },
    skip: false,
  },
  {
    instagramUsername: "hongdaeff",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Club+FF/@37.5502162,126.9197151,17z/data=!3m1!4b1!4m6!3m5!1s0x357c98c551a3b5cf:0x127e441da94c0a2d!8m2!3d37.550212!4d126.92229!16s%2Fg%2F11c5smvbyn?entry=tts",
      kakaoMapsUrl: "https://place.map.kakao.com/13494735",
      naverMapsUrl: "https://map.naver.com/p/entry/place/20917624",
    },
    skip: false,
  },
  {
    instagramUsername: "cafe.idaho",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Cafe+IDAHO/@37.5527392,126.9040041,17z/data=!3m1!4b1!4m6!3m5!1s0x357c992924537fc5:0x4eb4f49869981fc3!8m2!3d37.552735!4d126.906579!16s%2Fg%2F11dxpg1v7g?entry=tts",
      kakaoMapsUrl: "https://place.map.kakao.com/590013763",
      naverMapsUrl: "https://map.naver.com/p/entry/place/38248412",
    },
    skip: false,
  },
  {
    instagramUsername: "thestudiohbc",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/The+Studio+HBC/@37.5418683,126.9823394,17z/data=!3m1!4b1!4m6!3m5!1s0x357ca37a7e2b2803:0x665a5edc759ce9f9!8m2!3d37.5418684!4d126.9872103!16s%2Fg%2F11ryljn827?entry=tts",
      kakaoMapsUrl: "https://place.map.kakao.com/105543311",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1542575646",
    },
    skip: false,
  },
  {
    instagramUsername: "club_sharp",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Club+Sharp/@37.5534928,126.9084695,18.57z/data=!4m6!3m5!1s0x357c991e6073b49f:0xafd82c453ec8309c!8m2!3d37.5535776!4d126.9092268!16s%2Fg%2F11h1mk3x07?entry=tts",
      kakaoMapsUrl: "https://place.map.kakao.com/527881183",
      naverMapsUrl: "https://map.naver.com/p/entry/place/342057948",
    },
    skip: false,
  },
  {
    instagramUsername: "strangefruit.seoul",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Strange+Fruit/data=!4m6!3m5!1s0x357c98c222924261:0x3d7ea674afd01a9b!8m2!3d37.5562073!4d126.9267788!16s%2Fg%2F11c5s_h07f?entry=ttu",
      kakaoMapsUrl: "https://place.map.kakao.com/8410605",
      naverMapsUrl: "https://map.naver.com/p/entry/place/38015320",
    },
    skip: false,
  },
  {
    instagramUsername: "seendosi",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Seendosi/@37.5678148,126.9888711,17.46z/data=!4m6!3m5!1s0x357b44300ead5ac9:0xb0210bd95cb5170d!8m2!3d37.5677719!4d126.9907129!16s%2Fg%2F1tfqj9hc?entry=tts",
      kakaoMapsUrl: "https://place.map.kakao.com/27302182",
      naverMapsUrl: "https://map.naver.com/p/entry/place/870048846",
    },
    skip: false,
  },
  {
    instagramUsername: "channel1969.seoul",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/channel+1969/@37.5619063,126.9269777,15z/data=!4m2!3m1!1s0x0:0x3253f839b13a6516?sa=X&ved=2ahUKEwiz5sjCgteCAxV2cfUHHRJfCyMQ_BJ6BAhQEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/24063521",
      naverMapsUrl: "https://map.naver.com/p/entry/place/36010630",
    },
    skip: false,
  },
  {
    instagramUsername: "morene__sukha",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/%EB%AA%A8%EB%9E%98%EB%82%B4%EA%B7%B9%EB%9D%BD/data=!3m1!4b1!4m6!3m5!1s0x357c9960c1aa7dd9:0x160eb91052c04c71!8m2!3d37.5700168!4d126.9147081!16s%2Fg%2F11vd9pvjqz?entry=ttu",
      kakaoMapsUrl: "https://place.map.kakao.com/1929678823",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1598263527",
    },
    skip: false,
  },
  {
    instagramUsername: "echo.seoul",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/%EC%97%90%EC%BD%94+ECHO+%7C+MELODY+BAR/data=!3m1!4b1!4m6!3m5!1s0x357ca3a8da526017:0x6b3e86a32262ad85!8m2!3d37.5370432!4d126.9744386!16s%2Fg%2F11rgmzkdmk?entry=ttu",
      kakaoMapsUrl: "https://place.map.kakao.com/1517234066",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1668678201",
    },
    skip: false,
  },
  {
    instagramUsername: "rollinghall",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Rolling+Hall/data=!4m14!1m7!3m6!1s0x357c98d04c6b5451:0xb4eb7364af33a4e!2sRolling+Hall!8m2!3d37.5483606!4d126.9200362!16s%2Fg%2F1tcwtns7!3m5!1s0x357c98d04c6b5451:0xb4eb7364af33a4e!8m2!3d37.5483606!4d126.9200362!16s%2Fg%2F1tcwtns7?entry=ttu",
      kakaoMapsUrl: "https://place.map.kakao.com/7854938",
      naverMapsUrl: "https://map.naver.com/p/entry/place/11574607",
    },
    skip: false,
  },
  {
    instagramUsername: "unplugged_stage",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Cafe+Unplugged/@37.5554289,126.929198,15z/data=!4m2!3m1!1s0x0:0xd21b907482b4abae?sa=X&ved=2ahUKEwi6_oOglteCAxVIaN4KHa8SBSIQ_BJ6BAhAEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/27301267",
      naverMapsUrl: "https://map.naver.com/p/entry/place/34016066",
    },
    skip: false,
  },
  {
    instagramUsername: "space_hangang",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Space+Hangang+Live+Club/@37.5532595,126.9276121,15z/data=!4m2!3m1!1s0x0:0x58f4cc31d7fef342?sa=X&ved=2ahUKEwik6bDUlteCAxXogK8BHeikB6cQ_BJ6BAg-EAA",
      kakaoMapsUrl: "https://place.map.kakao.com/1178862249",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1991841630",
    },
    skip: false,
  },
  {
    instagramUsername: "club_onair",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/%ED%81%B4%EB%9F%BD+%EC%98%A8%EC%97%90%EC%96%B4/@37.5522853,126.9188982,15z/data=!4m2!3m1!1s0x0:0xe22e0ecd778c6b37?sa=X&ved=2ahUKEwjwlfWCl9eCAxWidvUHHX--DIwQ_BJ6BAhCEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/1897701926",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1196131538",
    },
    skip: false,
  },
  {
    instagramUsername: "youkillbong",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Yug-Ilbong/@37.5654653,126.9933588,15z/data=!4m2!3m1!1s0x0:0x713e306e793cff29?sa=X&ved=2ahUKEwi0sbLPl9eCAxVKavUHHYsWC9IQ_BJ6BAhGEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/683616569",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1703934087",
    },
    skip: false,
  },
  {
    instagramUsername: "mudaeruk",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/mu/@37.5459415,126.9184557,15z/data=!4m2!3m1!1s0x0:0xf3df26bd0a1eccac?sa=X&ved=2ahUKEwiV7cvtl9eCAxVNcfUHHQstCUQQ_BJ6BAhSEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/7876611",
      naverMapsUrl: "https://map.naver.com/p/entry/place/31010062",
    },
    skip: false,
  },
  {
    instagramUsername: "kill_the_youtube",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/%ED%82%AC%EB%8D%94%EC%9C%A0%ED%8A%9C%EB%B8%8C/@37.5589875,126.9460446,15z/data=!4m2!3m1!1s0x0:0x63ff528af0aff85a?sa=X&ved=2ahUKEwi5q5GZmNeCAxV7s1YBHSYCD0QQ_BJ6BAg3EAA",
      kakaoMapsUrl: "https://place.map.kakao.com/299516296",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1564017134",
    },
    skip: false,
  },
  {
    instagramUsername: "tonestudio_kr",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/%ED%86%A4%EC%8A%A4%ED%8A%9C%EB%94%94%EC%98%A4/@37.5593385,126.9154517,15z/data=!4m2!3m1!1s0x0:0xc1b5088a364f27f4?sa=X&ved=2ahUKEwikx6GImteCAxV3sFYBHUB_CEUQ_BJ6BAhEEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/25903348",
      naverMapsUrl: "https://map.naver.com/p/entry/place/12762159",
    },
    skip: false,
  },
  {
    instagramUsername: "salon.moonbow",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/%EC%82%B4%EB%A1%B1%EB%AC%B8%EB%B3%B4%EC%9A%B0/@37.554076,126.9143283,15z/data=!4m2!3m1!1s0x0:0x6269e4176fe13d4b?sa=X&ved=2ahUKEwj9jYOZmteCAxVctVYBHSowBjsQ_BJ6BAhCEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/38392222",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1264465916",
    },
    skip: false,
  },
  {
    instagramUsername: "senggistudio",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/SENGGI+STUDIO/@37.5538634,126.9285831,15z/data=!4m2!3m1!1s0x0:0x474a7e70b3de7a28?sa=X&ved=2ahUKEwjDvsy5mteCAxXnk1YBHckpC4IQ_BJ6BAhKEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/2138666623",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1336128827",
    },
    skip: false,
  },
  {
    instagramUsername: "gongsangondo",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/%EA%B3%B5%EC%83%81%EC%98%A8%EB%8F%84/@37.5575945,126.9197307,15z/data=!4m2!3m1!1s0x0:0x1b33dc40fc2964c0?sa=X&ved=2ahUKEwiugoHjmteCAxUbrlYBHSkwBg0Q_BJ6BAhJEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/27379281",
      naverMapsUrl: "https://map.naver.com/p/entry/place/37438798",
    },
    skip: false,
  },
  {
    instagramUsername: "kuchucamp_",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/%EA%B3%B5%EC%A4%91%EC%BA%A0%ED%94%84+%E7%A9%BA%E4%B8%AD%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%97+KUCHU-CAMP/@37.5542617,126.9298296,15z/data=!4m2!3m1!1s0x0:0xe35c9247002f3b6d?sa=X&ved=2ahUKEwigt-Cpm9eCAxX_efUHHQ5qCzoQ_BJ6BAhKEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/12571532",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1215598695",
    },
    skip: false,
  },
  {
    instagramUsername: "club_victim",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/53+Wausan-ro,+Mapo-gu,+Seoul/data=!4m2!3m1!1s0x357c98cff15c776b:0x84b8a9552a2ee10a?sa=X&ved=2ahUKEwjg3PbdndeCAxW0c_UHHaAUCO0Q8gF6BAgPEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/1739134352",
      naverMapsUrl: "https://map.naver.com/p/entry/place/37792895",
    },
    skip: false,
  },
  {
    instagramUsername: "petsoundsmusicpub",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Pet+sounds/@37.5391661,126.9889974,15z/data=!4m2!3m1!1s0x0:0xe87854ec77c0d48e?sa=X&ved=2ahUKEwjLs7DondeCAxV-ZvUHHZRSDo4Q_BJ6BAhIEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/24584237",
      naverMapsUrl: "https://map.naver.com/p/entry/place/35045009",
    },
    skip: false,
  },
  {
    instagramUsername: "spacestation2017",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/%ED%99%8D%EB%8C%80+%EC%9A%B0%EC%A3%BC%EC%A0%95%EA%B1%B0%EC%9E%A5/@37.5549892,126.9289772,15z/data=!4m2!3m1!1s0x0:0xf5cb7e0790279ff3?sa=X&ved=2ahUKEwjSjcOrnteCAxU1bvUHHXXrBjgQ_BJ6BAhNEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/1964441344",
      naverMapsUrl: "https://map.naver.com/p/entry/place/58461702",
    },
    skip: false,
  },
  {
    instagramUsername: "zak_eun_mul",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/%EC%9E%91%EC%9D%80%EB%AC%BC/@37.565998,126.993499,15z/data=!4m2!3m1!1s0x0:0x12eddd5bddd514b3?sa=X&ved=2ahUKEwiRjaf3nteCAxXYNt4KHb9JBvgQ_BJ6BAhEEAA",
      kakaoMapsUrl: "https://place.map.kakao.com/1902404148",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1883387105",
    },
    skip: false,
  },
  {
    instagramUsername: "acs.kr",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place//data=!4m5!1m2!2m1!1z7KSR6rWsIOyImO2RnOuhnDbquLggMTAg7KeA7ZWYMey4tQ!3m1!15sCiLspJHqtawg7IiY7ZGc66GcNuq4uCAxMCDsp4DtlZgx7Li1kgEQY29tcG91bmRfc2VjdGlvbuABAA?entry=ttu",
      kakaoMapsUrl: "https://place.map.kakao.com/1588455849",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1679293200",
    },
    skip: false,
  },
  {
    instagramUsername: "hukezliveinfo",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/Hukejeu/data=!4m6!3m5!1s0x357c9f485bcd3871:0x7e5b3fb1f7deaf14!8m2!3d37.5118681!4d126.8932476!16s%2Fg%2F11g0g6596p?entry=ttu",
      kakaoMapsUrl: "https://place.map.kakao.com/1820434609",
      naverMapsUrl: "https://map.naver.com/p/entry/place/1717890293",
    },
    skip: false,
  },
  {
    instagramUsername: "jebidabang",
    city: "Seoul",
    country: "KO",
    externalMapsJson: {
      googleMapsUrl:
        "https://www.google.com/maps/place/%EC%A0%9C%EB%B9%84%EB%8B%A4%EB%B0%A9/data=!4m6!3m5!1s0x357c98ce378bacab:0x50c5d81303cc1bd3!8m2!3d37.54656!4d126.9230958!16s%2Fg%2F1hc3j_y9y?entry=ttu",
      kakaoMapsUrl: "https://place.map.kakao.com/27194461",
      naverMapsUrl: "https://map.naver.com/p/entry/place/30830770",
    },
    skip: false,
  },
];

const busanVenues: ScrapeableVenue[] = [
  {
    instagramUsername: "the_vinyl_underground",
    city: "Busan",
    country: "KO",
    externalMapsJson: {},
    skip: false,
  },
  {
    instagramUsername: "basement_the_shizzle",
    city: "Busan",
    country: "KO",
    externalMapsJson: {},
    skip: false,
  },
  {
    instagramUsername: "someday_bar",
    city: "Busan",
    country: "KO",
    externalMapsJson: {},
    skip: false,
  },
  {
    instagramUsername: "clubrealize",
    city: "Busan",
    country: "KO",
    externalMapsJson: {},
    skip: false,
  },
  {
    instagramUsername: "ovantgarde",
    city: "Busan",
    country: "KO",
    externalMapsJson: {},
    skip: false,
  },
  {
    instagramUsername: "yugiche",
    city: "Busan",
    country: "KO",
    externalMapsJson: {},
    skip: false,
  },
  // Busan End
];

export const scrapeableVenues: ScrapeableVenue[] =
  seoulVenues.concat(busanVenues);
