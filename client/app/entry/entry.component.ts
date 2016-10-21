import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISquad } from '../squad/squad';
import { IPlayer } from '../players/player';
import {HomeService} from '../home/home.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
    moduleId: module.id,
  selector: 'nfl-entry',
  templateUrl: 'entry.component.html',
  styleUrls: ['entry.component.css']
})
export class EntryComponent implements OnInit {
    
    addedPlayer: IPlayer; 
    subscription: Subscription;
    addedSquad: ISquad;
    loading: boolean = false;

    entry: ISquad;
    errorMessage: string;
    currentWeek:number;

    QB: IPlayer;
    RB1: IPlayer;
    RB2: IPlayer;
    WR1: IPlayer;
    WR2: IPlayer;
    WR3: IPlayer;
    TE: IPlayer;
    FLX: IPlayer;
    DEF: IPlayer;

    totalPoints: number;

  constructor(private _homeService: HomeService) {

    this.loading = true;
          this._homeService.getSquad("5")
                .subscribe(
                    response => this.entry = response,
                    error => this.errorMessage = <any>error,
                    //() => (this.loading = this._orfileService.loading));
                    () => (this.onRequestComplete()));


/*   
this.addedSquad = null;

  this.subscription = _homeService.addSquad$.subscribe(
     squad=> { 
       this.addEntry(squad);
  });*/
  }
ngOnInit(): any{
    console.log('IN  OnInit');
this.currentWeek = this.entry.week;

    }

  ngOnDestroy() {
    console.log('IN  OnDestroy');
  }

/*  Removing to use local DB
 addEntry(squad:ISquad): void{
        //console.log('IN addEntry  SQUAD: '+ JSON.stringify(squad));
        this.addedSquad = squad;
        this.QB = this.addedSquad.QB;

 }*/


 onRequestComplete(){
    this.loading = this._homeService.loading;
  
    // add up points
    this.totalPoints = +(this.entry.QB.weekPts + this.entry.RB1.weekPts + this.entry.RB2.weekPts + this.entry.WR1.weekPts + this.entry.WR2.weekPts + this.entry.WR3.weekPts + this.entry.FLX.weekPts + this.entry.TE.weekPts + this.entry.DEF.weekPts).toFixed(2);
    
  }

   onSelectWeek(selectedId:any): void{
        console.log('IN onSelectWeek ');
        console.log('IN onSelectWeek  Week: ' + selectedId);
        this.loading = true;
          this._homeService.getSquad(selectedId)
                .subscribe(
                    response => this.entry = response,
                    error => this.errorMessage = <any>error,
                    //() => (this.loading = this._orfileService.loading));
                    () => (this.onRequestComplete()));
   
  }



}