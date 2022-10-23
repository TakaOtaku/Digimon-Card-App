import { Component, OnInit } from '@angular/core';
import {TIERLIST} from "../../../../models";
import {setCommunityDeckSearch} from "../../../store/digimon.actions";
import {JAPTIERLIST} from "../../../../models/japtierlist.data";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";

@Component({
  selector: 'digimon-tierlist',
  templateUrl: './tierlist.component.html',
  styleUrls: ['./tierlist.component.css']
})
export class TierlistComponent {
  currentRegion = 'GLOBAL';
  tierlist = TIERLIST;
  tiers = [
    { tier: 'S', color: 'bg-red-500' },
    { tier: 'A', color: 'bg-orange-500' },
    { tier: 'B', color: 'bg-yellow-500' },
    { tier: 'C', color: 'bg-green-500' },
    { tier: 'D', color: 'bg-blue-500' },
  ];

  constructor(private store: Store, private router: Router) {
  }

  openCommunityWithSearch(card: string) {
    this.store.dispatch(setCommunityDeckSearch({ communityDeckSearch: card }));
    this.router.navigateByUrl('/community');
  }

  switchRegion() {
    if (this.currentRegion === 'GLOBAL') {
      this.currentRegion = 'JAPAN';
      this.tierlist = JAPTIERLIST;
    } else {
      this.currentRegion = 'GLOBAL';
      this.tierlist = TIERLIST;
    }
  }

}
