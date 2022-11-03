import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';
import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { templateJitUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    return this.http.get(this.expressBaseUrl + endpoint).toPromise();
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    return this.sendRequestToExpress('/search/' + category + '/' + encodeURIComponent(resource)).then(data => {
      var searchResult = [];
      if (category == 'artist') {
        data['artists']['items'].forEach(x => searchResult.push(new ArtistData(x)));
        return searchResult;
      } else if (category == 'track') {
        data['tracks']['items'].forEach(x => searchResult.push(new TrackData(x)));
        return searchResult;
      } else if (category == 'album') {
        data['albums']['items'].forEach(x => searchResult.push(new AlbumData(x)));
        return searchResult;
      }
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    return this.sendRequestToExpress('/artist/' + encodeURIComponent(artistId)).then((data) => {
      return new ArtistData(data);
    });
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    return this.sendRequestToExpress('/artist-related-artists/' + encodeURIComponent(artistId)).then((data) => {
      var relatedArtists = [];
      data['artists'].forEach(x => relatedArtists.push(new ArtistData(x)));
      return relatedArtists;
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    return this.sendRequestToExpress('/artist-top-tracks/' + encodeURIComponent(artistId)).then((data) => {
      var topTracks = []
      data['tracks'].forEach(x => topTracks.push(new TrackData(x)));
      return topTracks;
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    return this.sendRequestToExpress('/artist-albums/' + encodeURIComponent(artistId)).then((data) => {
      var artistAlbums = [];
      data['items'].forEach(x => artistAlbums.push(new AlbumData(x)));
      return artistAlbums;
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    return this.sendRequestToExpress('/album/' + encodeURIComponent(albumId)).then((data) => {
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    return this.sendRequestToExpress('/album-tracks/' + encodeURIComponent(albumId)).then((data) => {
      var albumTracks = [];
      data['items'].forEach(x => albumTracks.push(new TrackData(x)));
      return albumTracks;
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    return this.sendRequestToExpress('/track/' + encodeURIComponent(trackId)).then((data) => {
      return new TrackData(data);
    });
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    return this.sendRequestToExpress('/track-audio-features/' + encodeURIComponent(trackId)).then((data) => {
      console.log(data);
      var trackStats = [];
      for (const k in data) {
        if (TrackFeature.FeatureTypes.includes(k)) {
          trackStats.push(new TrackFeature(k, data[k]));
        }
      }
      return trackStats;
    });
  }
}
