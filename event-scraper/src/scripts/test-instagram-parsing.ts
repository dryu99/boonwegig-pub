import { ChatGptService } from "../services/chatgpt.service";
import { InstagramPost } from "../services/instagram.service";

const djPost: InstagramPost = {
  time: 11233,
  location: "",
  id: "1",
  accountId: "2",
  link: "3",
  text: `10월 06일 금요일 밤 10시
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
  ——————————————————`,
};

const main = async () => {
  const data = await ChatGptService.extractInstagramPostEventData(djPost);
  console.log("done", data);
};

main();
