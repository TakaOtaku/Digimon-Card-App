import {NgModule} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {DialogModule} from "primeng/dialog";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {MenuModule} from "primeng/menu";
import {MessageModule} from "primeng/message";
import {MessagesModule} from "primeng/messages";
import {MultiSelectModule} from "primeng/multiselect";
import {RippleModule} from "primeng/ripple";
import {SelectButtonModule} from "primeng/selectbutton";
import {SliderModule} from "primeng/slider";

@NgModule({
  imports: [
    InputNumberModule,
    MultiSelectModule,
    InputTextModule,
    InputTextareaModule,
    ConfirmPopupModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    MenuModule,
    ButtonModule,
    RippleModule,
    SelectButtonModule,
    SliderModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  exports: [
    InputNumberModule,
    MultiSelectModule,
    InputTextModule,
    InputTextareaModule,
    ConfirmPopupModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    MenuModule,
    ButtonModule,
    RippleModule,
    SelectButtonModule,
    SliderModule
  ]
})
export class PrimeNGModule { }
