import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonModule } from "primeng/button";
import { ChipModule } from "primeng/chip";
import { ContextMenuModule } from "primeng/contextmenu";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { RippleModule } from "primeng/ripple";
import { TableModule } from "primeng/table";
import { DigimonStoreModule } from "../../digimon-store.module";
import { AuthService } from "../../service/auth.service";
import { DigimonBackendService } from "../../service/digimon-backend.service";
import { DeckbuilderModule } from "../deckbuilder/deckbuilder.module";
import { SharedModule } from "../shared/shared.module";
import { DeckStatisticsComponent } from "./deck-statistics.component";
import { DecksPageComponent } from "./decks-page.component";
import { SmallCardComponent } from "./small-card.component";

@NgModule({
  declarations: [
    DecksPageComponent,
    SmallCardComponent,
    DeckStatisticsComponent
  ],
  imports: [
    CommonModule,
    DigimonStoreModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    TableModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ChipModule,
    DeckbuilderModule,
    ButtonModule,
    RippleModule,
    ContextMenuModule,
    SharedModule,
    MultiSelectModule,
    DialogModule
  ],
  providers: [AuthService, DigimonBackendService]
})
export class DecksModule {
}
