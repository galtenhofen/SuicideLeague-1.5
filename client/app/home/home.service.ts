import {Component,Injectable,Input,Output,EventEmitter } from '@angular/core';
import {IPlayer} from '../players/player';
import {ISquad} from '../squad/squad';
import {IResponse} from '../players/response';
import {ILoadInfo} from '../players/loadInfo';
import {Http, Request, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';


@Injectable()
export class HomeService {
  private _playerUrl = 'http://api.fantasy.nfl.com/v1/players/stats?statType=seasonStats&season=2016&week=5&format=json';
  private _localUrl = 'http://localhost:3000/api';
  private _savedEntry= 'app/saved/squad.json'
  private _newSavedEntry= 'app/saved/entry.json'

  loading:boolean; 

  constructor(private _http: Http){ this.loading=false; }

  // Observable string sources
  public addedPlayer = new Subject<IPlayer>();
  //public addedSquad = new Subject<ISquad>();


//Removing to use local DB
  currentEntry:ISquad;
  //currentEntryJSON:JSON;

  // Observable string streams
  addPlayer$ = this.addedPlayer.asObservable();
  //addSquad$ = this.addedSquad.asObservable();
  
  
  // Service message commands
  addPlayer(player: IPlayer) {
            console.log('Adding Player: '+ JSON.stringify(player));
          this.addedPlayer.next(player);

          console.log('addedPlayer: '+ this.addedPlayer);
        }

/*  Taking this out to use local DB
  addSquad(squad: ISquad) {
        // console.log('Adding Player: '+ JSON.stringify(player));
        this.addedSquad.next(squad);
        
        //using this until it can be replaced with database calls
        this.currentEntry = squad;
 
      }

  getEntryDB(): Observable<ISquad>{
    console.log('IN getEntry ');
    return this._http.get(this._newSavedEntry) 
    .finally( () => this.loading = false)
                    .map((response: Response) => <ISquad>response.json())
                    //.do(data => console.log("IN getResponse:  " + JSON.stringify(data)))
                    .catch(this.throwStatus)
} 
*/

/*
getEntryDB(): Observable<ISquad>{
      console.log('IN getEntryDB');
      console.log('IN getEntryDB  this is the URL: ' + this._localUrl + '/squads');
      return this._http.get(this._localUrl + '/squads/5807fcf23971d82adca4ef0e') 
      .finally( () => this.loading = false)
                      .map((response: Response) => <ISquad>response.json())
                      .do(data => console.log("IN getEntryDB Response:  " + JSON.stringify(data)))
                      .catch(this.throwStatus)
        }*/

 setSquad(squad:ISquad){
   console.log('IN setSquad');
                let postUrl = this._localUrl + '/squads';
                let body = JSON.stringify(squad);
                let headers = new Headers({ 'Content-Type': 'application/json' });
                let options = new RequestOptions({ headers: headers });

                return this._http.post(postUrl , body, options)
                    .do(data => console.log("POST Response: " + JSON.stringify(data)))
                    .map(this.checkResponseStatus)
                    .catch(this.throwStatus);
 }


  getEntry():ISquad{
          return this.currentEntry
          
        } 

 getSquad(week:string): Observable<ISquad>{
          console.log("IN getSquad -   URL: " +this._localUrl+'/squads');
                     return this._http.get(this._localUrl+'/squads/'+week) 
                    .finally( () => this.loading = false)
                    .map((response: Response) => <ISquad>response.json())
                    .do(data => console.log("IN getSquad:  " + JSON.stringify(data)))
                    .catch(this.throwStatus)
          
        } 

  getAllPlayers(): Observable<IResponse>{ 
                     console.log("IN getAllPlayers -   URL: " +this._playerUrl);
                     return this._http.get(this._playerUrl) 
                    .finally( () => this.loading = false)
                    .map((response: Response) => <IResponse>response.json())
                    //.do(data => console.log("IN getResponse:  " + JSON.stringify(data)))
                    .catch(this.throwStatus)
                    

                   }

  getPlayers(): Observable<IPlayer[]>{ 
                     console.log("IN getPlayers -   URL: " +this._localUrl+'/players');
                     return this._http.get(this._localUrl+'/players') 
                    .finally( () => this.loading = false)
                    .map((response: Response) => <IPlayer[]>response.json())
                    .do(data => console.log("IN getPlayers:  " + JSON.stringify(data)))
                    .catch(this.throwStatus)
                    

                   }

loadPlayers(players:IPlayer[]){
   console.log('IN loadPlayers');
                let postUrl = this._localUrl + '/players';
                let body = JSON.stringify(players);
                let headers = new Headers({ 'Content-Type': 'application/json' });
                let options = new RequestOptions({ headers: headers });

                return this._http.post(postUrl , body, options)
                    .do(data => console.log("POST Response: " + JSON.stringify(data)))
                    .map(this.checkResponseStatus)
                    .catch(this.throwStatus);
 }

  private throwStatus(error: Response){
            console.log('IN throwStatus  error.status = ' + error.status);
            console.error(error.status);
            return Observable.throw(error.status || 'Server error');

        }

  private checkResponseStatus(res: Response) {
            console.log('IN  checkResponseStatus');
            let status:any;

            // check if empty, before call json
             if (res.status) {
                status = res.status;
                }
            console.log('IN  checkResponseStatus STATUS:' + status);
            return status || {};
        }

}