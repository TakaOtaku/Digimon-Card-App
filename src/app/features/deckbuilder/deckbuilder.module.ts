import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonModule } from "primeng/button";
import { ChipModule } from "primeng/chip";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { RippleModule } from "primeng/ripple";
import { TooltipModule } from "primeng/tooltip";
import { DigimonStoreModule } from "../../digimon-store.module";
import { ObscenityPipe } from "../../pipes/obscenity.pipe";
import { AuthService } from "../../service/auth.service";
import { DigimonBackendService } from "../../service/digimon-backend.service";
import { CollectionModule } from "../collection/collection.module";
import { SharedModule } from "../shared/shared.module";
import { DeckbuilderPageComponent } from "./deckbuilder-page.component";
import { DeckMetadataComponent } from "./deckview/deck-metadata.component";
import { DeckToolbarComponent } from "./deckview/deck-toolbar.component";
import { DeckViewComponent } from "./deckview/deck-view.component";

@NgModule({
  declarations: [
    DeckbuilderPageComponent,
    DeckViewComponent,
    DeckToolbarComponent,
    DeckMetadataComponent,
    ObscenityPipe
  ],
  imports: [
    CommonModule,
    DigimonStoreModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    CollectionModule,
    DialogModule,
    ChipModule,
    InputTextModule,
    InputTextareaModule,
    TooltipModule,
    RippleModule,
    ButtonModule
  ],
  providers: [AuthService, DigimonBackendService]
})
export class DeckbuilderModule {
}
