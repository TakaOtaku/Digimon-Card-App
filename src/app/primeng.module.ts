import { NgModule } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    AutoCompleteModule,
    ChipsModule,
    ChipModule,
    TagModule,
    TableModule,
    RatingModule,
    ToastModule,
    ChartModule,
    DropdownModule,
    ContextMenuModule,
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
    RadioButtonModule,
    SidebarModule,
    StyleClassModule,
  ],
  providers: [MessageService, ConfirmationService],
  exports: [
    SidebarModule,
    AutoCompleteModule,
    ChipsModule,
    ChipModule,
    TagModule,
    TableModule,
    RatingModule,
    RadioButtonModule,
    ToastModule,
    ChartModule,
    DropdownModule,
    ContextMenuModule,
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
    StyleClassModule,
  ],
})
export class PrimeNGModule {}
