import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { RippleModule } from "primeng/ripple";
import { DigimonStoreModule } from "../../digimon-store.module";
import { AuthService } from "../../service/auth.service";
import { DigimonBackendService } from "../../service/digimon-backend.service";
import { BlogComponent } from "./blog.component";

@NgModule({
  declarations: [BlogComponent],
  imports: [
    CommonModule,
    DigimonStoreModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CKEditorModule,
    ButtonModule,
    RippleModule,
    InputTextModule
  ],
  providers: [AuthService, MessageService, DigimonBackendService]
})
export class BlogModule {
}
