import Image from "next/image";

export const GoogleMapsLink = ({ url }: { url: string }) => {
  return (
    <a href={url} data-umami-event="google-maps-link">
      <Image
        src="/icons/google-maps.png"
        alt="Google Maps Icon"
        width={36}
        height={36}
      />
    </a>
  );
};

export const NaverMapsLink = ({ url }: { url: string }) => {
  return (
    <a href={url} data-umami-event="naver-maps-link">
      <Image
        src="/icons/naver-maps.png"
        alt="Naver Maps Icon"
        width={36}
        height={36}
        className="rounded"
      />
    </a>
  );
};

export const KakaoMapsLink = ({ url }: { url: string }) => {
  return (
    <a href={url} data-umami-event="naver-maps-link">
      <Image
        src="/icons/kakao-maps.png"
        alt="Kakao Maps Icon"
        width={36}
        height={36}
        className="rounded"
      />
    </a>
  );
};
