import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { DigimonStoreModule } from '../../digimon-store.module';
import { AuthService } from '../../service/auth.service';
import { CardImageComponent } from './card-image.component';
import { DeckCardComponent } from './deck-card.component';
import { DeckContainerComponent } from './deck-container.component';
import { ChangeAccessorieDialogComponent } from './dialogs/change-accessorie-dialog.component';
import { ChangelogDialogComponent } from './dialogs/changelog-dialog.component';
import { CollectionStatsDialogComponent } from './dialogs/collection-stats-dialog.component';
import { DeckDialogComponent } from './dialogs/deck-dialog.component';
import { DeckSubmissionComponent } from './dialogs/deck-submission.component';
import { ExportDeckDialogComponent } from './dialogs/export-deck-dialog.component';
import { ImportDeckDialogComponent } from './dialogs/import-deck-dialog.component';
import { ProxyPrintDialogComponent } from './dialogs/proxy-print-dialog.component';
import { SettingsDialogComponent } from './dialogs/settings-dialog.component';
import { ViewCardDialogComponent } from './dialogs/view-card-dialog.component';
import { BlockFilterComponent } from './filter/block-filter.component';
import { CardTypeFilterComponent } from './filter/card-type-filter.component';
import { ColorFilterComponent } from './filter/color-filter.component';
import { FilterAndSearchComponent } from './filter/filter-and-search.component';
import { FilterButtonComponent } from './filter/filter-button.component';
import { FilterSideBoxComponent } from './filter/filter-side-box.component';
import { LanguageFilterComponent } from './filter/language-filter.component';
import { RarityFilterComponent } from './filter/rarity-filter.component';
import { SetFilterComponent } from './filter/set-filter.component';
import { VersionFilterComponent } from './filter/version-filter.component';
import { FullCardComponent } from './full-card.component';
import { MultiButtonsComponent } from './multi-buttons.component';
import { NavbarComponent } from './navbar.component';
import { RangeSliderComponent } from './range-slider.component';
import { SingleContainerComponent } from './single-container.component';
import { SortButtonsComponent } from './sort-buttons.component';
import { ChartContainerComponent } from './statistics/chart-container.component';
import { ChartContainersComponent } from './statistics/chart-containers.component';
import { ColorSpreadComponent } from './statistics/color-spread.component';
import { DdtoSpreadComponent } from './statistics/ddto-spread.component';
import { LevelSpreadComponent } from './statistics/level-spread.component';

@NgModule({
  declarations: [
    DeckContainerComponent,
    ExportDeckDialogComponent,
    ImportDeckDialogComponent,
    SingleContainerComponent,
    ChangeAccessorieDialogComponent,
    ChangelogDialogComponent,
    CollectionStatsDialogComponent,
    ProxyPrintDialogComponent,
    SettingsDialogComponent,
    ViewCardDialogComponent,
    NavbarComponent,
    SingleContainerComponent,
    FullCardComponent,
    SortButtonsComponent,
    FilterAndSearchComponent,
    FilterButtonComponent,
    FilterSideBoxComponent,
    MultiButtonsComponent,
    RangeSliderComponent,
    DeckDialogComponent,
    DeckCardComponent,
    ChartContainersComponent,
    ChartContainerComponent,
    ColorSpreadComponent,
    DdtoSpreadComponent,
    LevelSpreadComponent,
    DeckSubmissionComponent,
    CardImageComponent,
    LanguageFilterComponent,
    ColorFilterComponent,
    CardTypeFilterComponent,
    CardTypeFilterComponent,
    BlockFilterComponent,
    VersionFilterComponent,
    RarityFilterComponent,
    SetFilterComponent,
  ],
  exports: [
    DeckContainerComponent,
    ExportDeckDialogComponent,
    ImportDeckDialogComponent,
    SingleContainerComponent,
    ChangeAccessorieDialogComponent,
    ChangelogDialogComponent,
    SettingsDialogComponent,
    ViewCardDialogComponent,
    NavbarComponent,
    FullCardComponent,
    SortButtonsComponent,
    FilterAndSearchComponent,
    FilterButtonComponent,
    FilterSideBoxComponent,
    DeckDialogComponent,
    DeckCardComponent,
    ChartContainersComponent,
    ChartContainerComponent,
    ColorSpreadComponent,
    DdtoSpreadComponent,
    LevelSpreadComponent,
    DeckSubmissionComponent,
    CardImageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    LazyLoadImageModule,
    NgxSliderModule,

    DigimonStoreModule,

    SelectButtonModule,
    ButtonModule,
    InputTextareaModule,
    ContextMenuModule,
    AutoCompleteModule,
    InputTextModule,
    DialogModule,
    ContextMenuModule,
    ConfirmPopupModule,
    MultiSelectModule,
    CKEditorModule,
    DropdownModule,
    ReactiveFormsModule,
    ChartModule,
    StyleClassModule,
    RippleModule,
    InputNumberModule,
    InputSwitchModule,
    CalendarModule,
    DragDropModule,
  ],
  providers: [AuthService, MessageService, ConfirmationService],
})
export class SharedModule {}
