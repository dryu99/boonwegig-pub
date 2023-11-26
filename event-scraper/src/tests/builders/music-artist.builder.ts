import {
  MusicArtistModel,
  NewMusicArtist,
} from "../../database/models/music-artist";

export class MusicArtistBuilder {
  private musicArtist: NewMusicArtist;

  constructor() {
    this.musicArtist = MusicArtistModel.toNew("billjohn");
  }

  public withName(name: string) {
    this.musicArtist.name = name;
    return this;
  }

  public withCountry(country: string) {
    this.musicArtist.country = country;
    return this;
  }

  public build() {
    return this.musicArtist;
  }
}
