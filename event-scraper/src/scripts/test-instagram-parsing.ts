import { ChatGptService } from "../services/chatgpt.service";
import { InstagramPost } from "../services/instagram.service";

const partialInstagramPost = {
  time: 11233,
  location: "",
  id: "1",
  accountId: "2",
  link: "3",
};

const djText = `10월 06일 금요일 밤 10시
  ⠀
  신도시의 디제잉 시리즈 ‘볼룸 신도시
  'Ballroom seendosi’ 23번째 순서가 열립니다.
  ⠀
  스물세번째 디제이는 ‘영다이 YEONG DIE’와
  함께 합니다.
  ⠀
  Ballroom seendosi
  #23
  ⠀
  YEONG DIE
  @lildead19
  ⠀
  2023.10.06 금요일 10pm -
  ⠀
  서울시 중구 수표동 11-2 5층
  @seendosi
  ⠀
  *입장료 무료
  ⠀
  기획/신도시@seendosi
  디자인/ 이병재(신도시)@qudwoqudwo
  그림/이병재(신도시)@qudwoqudwo
  ——————————————-
  ⠀
  Ballroom seendosi #23 with YEONG DIE
  Friday , Oct 06th from 10pm @seendosi 5F
  ⠀
  Free Admission
  ⠀
  Presented by seendosi
  Designed by Lee byoung jae
  Illustrated by Lee byoung jae
  Organization by seendosi
  ⠀
  ⠀
  ——————————————————`;

const musicText = `[2023.10.3] WHITE SHOES & THE COUPLES COMPANY(FROM INDONESIA) IN SEOUL 2023

인도네시아 자카르타를 대표하는 6인조 밴드 WHITE SHOES & THE COUPLES COMPANY(WSATCC)가 처음으로 한국을 방문합니다. 처음 이들의 음악을 들었을 때 어떤 배경 아래에 있어야 이런 음악을 만들 수 있는가 라는 호기심이 가득했습니다. 그 고유한 매력이 인도네시아의 리스너를 넘어 전 세계의 리스너를 이끈 것은 다름이 아닌 자신들이 좋아하는 인도네시아 팝 음악의 황금기와 70년대의 영화 OST, 클래식 재즈 등 다양한 요소와 영감을 받은 부분을 디스코 장르를 기반으로 밴드만의 색깔로 녹여낸 부분이 아닐지 싶습니다.

2002년 결성 이후 오랜 시간 동안 조바심 없이 긴 호흡으로 활동해 오고 있는 WSATCC가 2020년 발매한 세 번째 정규앨범 <2020>은 밴드의 여정과 도시 생활에 대한 이야기를 전하는 가사, 영화 같은 팝 음악을 만들기 위한 탐구가 담겨있어 밴드의 현재를 정확히 보여주는 앨범이라고 생각합니다. (이번 한국 공연에서는 2023년 아시아 투어를 기념해 재발매되는 <2020> LP도 판매될 예정입니다.) 최근 인터뷰에서 WSATCC의 음악을 레트로 팝이라고 지칭하는 것에 대해 단숨에 부정하며 "사용하는 악기와 뉘앙스가 항상 진화하고 있다. 변수를 넓혀가며 현재를 담아내는 우리가 바로 인도네시아 팝"이라고 말하는, 명실상부 인도네시아를 대표하는 밴드 WHITE SHOES & THE COUPLES COMPANY. 그 첫 한국 공연의 게스트로 쾅프로그램과 하세가와 요헤이가 등장합니다. 아시아 음악을 사랑하는 여러분의 많은 관심 부탁드립니다. 그럼, 공연장에서 만나요!

* 일시 : 2023년 10월 3일 (화) / 입장 19:30, 공연 시작 20:00
* 장소: 채널 1969(서울 마포구 연남동 227-1, https://instagram.com/channel1969.seoul/)
* 출연진 : WHITE SHOES & THE COUPLES COMPANY(FROM INDONESIA), KUANG PROGRAM. DJ HASEGAWA YOHEI
* 입장료 : 예매/현매 50,000원/60,000원 (80명 한정, 예매 : smallshowsinseoul.blogspot.com)

* 문의 : helicopter.seoul@gmail.com

WHITE SHOES & THE COUPLES COMPANY

명실상부 인도네시아 자카르타를 대표하는 6인조 밴드. 1930년대 클래식 재즈부터 1970년대 인도네시아 영화 사운드트랙, 인도네시아 팝 음악의 황금기 등 다양한 요소와 영감을 받은 부분을 디스코 장르를 기반으로 밴드만의 색깔로 녹여낸다. 한국에는 2008년 비트볼 레코드를 통해 데뷔앨범이 발매된 적이 있다. 2002년 결성 이후 처음으로 일본과 한국 투어를 진행한다.

Member
Aprilia Apsari : VOCAL, FINGER SNAPS
Rio Farabi : ACCOUSTIC GUITAR, VOCAL
Saleh Husein : ELECTRIC GUITAR, VOCAL
Ricky Surya Virgana : KONTRA BASS, CELLO, BASS, VOCAL
Aprimela Prawidyanti : PIANO, VIOLA, SYNTH, KEYBOARDS, VOCAL
John Navid : DRUMS, VIBES`;

const main = async () => {
  // const djPost = {
  //   ...partialInstagramPost,
  //   text: djText,
  // };

  const musicPost = {
    ...partialInstagramPost,
    text: musicText,
  };

  const data = await ChatGptService.parseInstagramEvent(musicPost);
  console.log("done", { data });
};

main();
