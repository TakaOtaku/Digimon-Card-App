import {Component, OnInit} from '@angular/core';
import {ISave} from "../../models";
import {loadSave} from "../../store/actions/save.actions";

@Component({
  selector: 'digimon-import-deck',
  templateUrl: './import-deck.component.html',
  styleUrls: ['./import-deck.component.css']
})
export class ImportDeckComponent {
  public importPlaceholder = "" +
    "Paste Deck here\n" +
    "\n" +
    " Format:\n" +
    "   Qty Name Id\n" +
    "   Name is optional. Qty(quantity) must be positiv\n" +
    "   Each card can only be declared once\n" +
    "   Import will always pick the regular art card\""

  public deckText = '';

  //Import -> Ask for Name, Description, Color, SelectCardID for Image or let empty
  constructor() { }

  public handleFileInput(input: any) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        console.log(fileReader.result as string);
        debugger;
        //const save: ISave = JSON.parse(fileReader.result as string);
        //this.store.dispatch(loadSave({save}));
      } catch (e) {

      }
    }
    fileReader.readAsText(input.files[0]);
  }

  public importDeck() {

  }
}
