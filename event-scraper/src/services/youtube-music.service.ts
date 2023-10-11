export class YoutubeMusicService {
  public static getArtistSearchUrl(artistName: string): string {
    return `https://music.youtube.com/search?q=${artistName}`;
  }
}
