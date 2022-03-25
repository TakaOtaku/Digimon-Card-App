import {NgModule} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {ChartModule} from "primeng/chart";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ContextMenuModule} from "primeng/contextmenu";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
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
import {ToastModule} from "primeng/toast";

@NgModule({
  imports: [
    ToastModule,
    ChartModule,
    DropdownModule,
    ContextMenuModule,
    CardModule,
    InputNumberModule,
    MultiSelectModule,
    InputTextModule,
    InputTextareaModule,
    ConfirmDialogModule,
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
    ToastModule,
    ChartModule,
    DropdownModule,
    ContextMenuModule,
    CardModule,
    InputNumberModule,
    MultiSelectModule,
    InputTextModule,
    InputTextareaModule,
    ConfirmDialogModule,
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
