import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopAppComponent } from './_components/top-app/top-app.component';
import { TopAppMashupComponent } from './_samples/full-portal/top-app-mashup/top-app-mashup.component';
import { AppShellComponent } from "./_components/_templates/app-shell/app-shell.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule} from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule }  from '@angular/cdk/drag-drop';
import { MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Utils } from './_helpers/utils';
import { ViewContainerComponent } from './_components/view-container/view-container.component';
import { ViewComponent } from './_components/view/view.component';
import { PageComponent } from './_components/_templates/page/page.component';
import { TwoColumnComponent } from './_components/_templates/two-column/two-column.component';
import { RegionComponent } from './_components/region/region.component';
import { PulseComponent } from './_components/pulse/pulse.component';
import { TodoComponent } from './_components/todo/todo.component';
import { FlowContainerComponent } from './_components/flow-container/flow-container.component';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { CaseViewComponent } from './_components/_templates/case-view/case-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogClose } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { LayoutModule } from '@angular/cdk/layout';
import { CaseSummaryComponent } from './_components/_templates/case-summary/case-summary.component';
import { UtilityComponent } from './_components/utility/utility.component';
import { MaterialCaseSummaryComponent } from './_material_extensions/material-case-summary/material-case-summary.component';
import { MaterialUtilityComponent } from './_material_extensions/material-utility/material-utility.component';
import { StagesComponent } from './_components//stages/stages.component';
import { OneColumnComponent } from './_components/_templates/one-column/one-column.component';
import { TextInputComponent } from './_components/_forms/text-input/text-input.component';
import { TextAreaComponent } from './_components/_forms/text-area/text-area.component';
import { CheckBoxComponent } from './_components/_forms/check-box/check-box.component';
import { RepeatingStructuresComponent } from './_components/repeating-structures/repeating-structures.component';
import { MaterialVerticalTabsComponent } from './_material_extensions/material-vertical-tabs/material-vertical-tabs.component';
import { IntegerComponent } from './_components/_forms/integer/integer.component';
import { DateComponent } from './_components/_forms/date/date.component';
import { EmailComponent } from './_components/_forms/email/email.component';
import { UrlComponent } from './_components/_forms/url/url.component';
import { CurrencyComponent } from './_components/_forms/currency/currency.component';
import { DecimalComponent } from './_components/_forms/decimal/decimal.component';
import { PhoneComponent } from './_components/_forms/phone/phone.component';
import { RadioButtonsComponent } from './_components/_forms/radio-buttons/radio-buttons.component';
import { DropdownComponent } from './_components/_forms/dropdown/dropdown.component';
import { DeferLoadComponent } from './_components/defer-load/defer-load.component';
import { APP_BASE_HREF } from '@angular/common';
import { FeedContainerComponent } from './_components/feed-container/feed-container.component';
import { AutoCompleteComponent } from './_components/_forms/auto-complete/auto-complete.component';
import { TextComponent } from './_components/_forms/text/text.component';
import { TextContentComponent } from './_components/_forms/text-content/text-content.component';
import { ActionButtonsComponent } from './_components/action-buttons/action-buttons.component';
import { AssignmentCardComponent } from './_components/assignment-card/assignment-card.component';
import { MultiStepComponent } from './_components/multi-step/multi-step.component';

import { NavigationComponent } from './_samples/simple-portal/navigation/navigation.component';
import { SideBarComponent } from './_samples/simple-portal/side-bar/side-bar.component';
import { MainContentComponent } from './_samples/simple-portal/main-content/main-content.component';

import { MCNavComponent } from './_samples/mashup/mc-nav/mc-nav.component';
import { BundleSwatchComponent } from './_samples/mashup/bundle-swatch/bundle-swatch.component';
import { MainScreenComponent } from './_samples/mashup/main-screen/main-screen.component';
import { MCMainContentComponent } from './_samples/mashup/mc-main-content/mc-main-content.component';
import { ResolutionScreenComponent } from './_samples/mashup/resolution-screen/resolution-screen.component';
import { RootContainerComponent } from './_components/root-container/root-container.component';
import { HybridViewContainerComponent } from './_components/hybrid-view-container/hybrid-view-container.component';
import { PreviewViewContainerComponent } from './_components/preview-view-container/preview-view-container.component';
import { ModalViewContainerComponent } from './_components/modal-view-container/modal-view-container.component';
import { AppAnnouncementComponent } from './_components/_widgets/app-announcement/app-announcement.component';
import { TwoColumnPageComponent } from './_components/_templates/two-column-page/two-column-page.component';
import { OneColumnPageComponent } from './_components/_templates/one-column-page/one-column-page.component';
import { ThreeColumnComponent } from './_components/_templates/three-column/three-column.component';
import { ThreeColumnPageComponent } from './_components/_templates/three-column-page/three-column-page.component';
import { ListPageComponent } from './_components/_templates/list-page/list-page.component';
import { ListViewComponent } from './_components/_templates/list-view/list-view.component';
import { CaseCreateStageComponent } from './_components/case-create-stage/case-create-stage.component';
import { AssignmentComponent } from './_components/assignment/assignment.component';
import { CancelAlertComponent } from './_components/cancel-alert/cancel-alert.component';
import { UserReferenceComponent } from './_components/_forms/user-reference/user-reference.component';
import { OperatorComponent } from './_components/operator/operator.component';
import { MaterialSummaryItemComponent } from './_material_extensions/material-summary-item/material-summary-item.component';
import { FileUtilityComponent } from './_components/_widgets/file-utility/file-utility.component';
import { ListUtilityComponent } from './_components/_widgets/list-utility/list-utility.component';
import { MaterialSummaryListComponent } from './_material_extensions/material-summary-list/material-summary-list.component';
import { AttachmentComponent } from './_components/attachment/attachment.component';
import { DefaultFormComponent } from './_components/_templates/default-form/default-form.component';
import { DateTimeComponent } from './_components/_forms/date-time/date-time.component';
import { TimeComponent } from './_components/_forms/time/time.component';
import { DetailsComponent } from './_components/_templates/details/details.component';
import { DetailsTwoColumnComponent } from './_components/_templates/details-two-column/details-two-column.component';
import { MaterialDetailsComponent } from './_material_extensions/material-details/material-details.component';
import { DetailsOneColumnComponent } from './_components/_templates/details-one-column/details-one-column.component';
import { DetailsThreeColumnComponent } from './_components/_templates/details-three-column/details-three-column.component';
import { PercentageComponent } from './_components/_forms/percentage/percentage.component';
import { CaseHistoryComponent } from './_components/_widgets/case-history/case-history.component';
import { ServerConfigService } from './_services/server-config.service';
import { NarrowWideFormComponent } from './_components/_templates/narrow-wide-form/narrow-wide-form.component';
import { WideNarrowFormComponent } from './_components/_templates/wide-narrow-form/wide-narrow-form.component';
import { WideNarrowPageComponent } from './_components/_templates/wide-narrow-page/wide-narrow-page.component';
import { SimpleTableComponent } from './_components/_templates/simple-table/simple-table.component';
import { ReferenceComponent } from './_components/reference/reference.component';
import { OneColumnTabComponent } from './_components/_templates/one-column-tab/one-column-tab.component';
import { AuthService } from './_services/auth.service';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DataReferenceComponent } from './_components/_templates/data-reference/data-reference.component';
import { SimpleTableSelectComponent } from './_components/_templates/simple-table-select/simple-table-select.component';
import { PromotedFiltersComponent } from './_components/_templates/promoted-filters/promoted-filters.component';
import { SingleReferenceReadonlyComponent } from './_components/_templates/single-reference-readonly/single-reference-readonly.component';
import { SemanticLinkComponent } from './_components/_forms/semantic-link/semantic-link.component';
import { MultiReferenceReadonlyComponent } from './_components/_templates/multi-reference-readonly/multi-reference-readonly.component';
import { FieldGroupTemplateComponent } from './_components/_templates/field-group-template/field-group-template.component';
import { FieldGroupListComponent } from './_components/_templates/field-group-list/field-group-list.component';
import { FieldGroupUtils } from './_helpers/field-group-utils';
import { SimpleTableManualComponent } from './_components/_templates/simple-table-manual/simple-table-manual.component';
@NgModule({
  declarations: [
    AppComponent,
    TopAppComponent,
    AppShellComponent,
    ViewContainerComponent,
    ViewComponent,
    PageComponent,
    TwoColumnComponent,
    RegionComponent,
    PulseComponent,
    TodoComponent,
    FlowContainerComponent,
    NavbarComponent,
    CaseViewComponent,
    CaseSummaryComponent,
    UtilityComponent,
    MaterialCaseSummaryComponent,
    MaterialUtilityComponent,
    StagesComponent,
    OneColumnComponent,
    TextInputComponent,
    TextAreaComponent,
    CheckBoxComponent,
    RepeatingStructuresComponent,
    MaterialVerticalTabsComponent,
    IntegerComponent,
    DateComponent,
    EmailComponent,
    UrlComponent,
    CurrencyComponent,
    DecimalComponent,
    PhoneComponent,
    RadioButtonsComponent,
    DropdownComponent,
    DeferLoadComponent,
    FeedContainerComponent,
    AutoCompleteComponent,
    TextComponent,
    TextContentComponent,
    ActionButtonsComponent,
    AssignmentCardComponent,
    MultiStepComponent,
    NavigationComponent,
    SideBarComponent,
    MainContentComponent,
    BundleSwatchComponent,
    MCMainContentComponent,
    MCNavComponent,
    MainScreenComponent,
    ResolutionScreenComponent,
    RootContainerComponent,
    HybridViewContainerComponent,
    PreviewViewContainerComponent,
    ModalViewContainerComponent,
    AppAnnouncementComponent,
    TwoColumnPageComponent,
    OneColumnPageComponent,
    ThreeColumnComponent,
    ThreeColumnPageComponent,
    ListPageComponent,
    ListViewComponent,
    CaseCreateStageComponent,
    AssignmentComponent,
    CancelAlertComponent,
    UserReferenceComponent,
    OperatorComponent,
    MaterialSummaryItemComponent,
    FileUtilityComponent,
    ListUtilityComponent,
    MaterialSummaryListComponent,
    AttachmentComponent,
    TopAppMashupComponent,
    DefaultFormComponent,
    DateTimeComponent,
    TimeComponent,
    DetailsComponent,
    DetailsTwoColumnComponent,
    MaterialDetailsComponent,
    DetailsOneColumnComponent,
    DetailsThreeColumnComponent,
    PercentageComponent,
    CaseHistoryComponent,
    NarrowWideFormComponent,
    WideNarrowFormComponent,
    WideNarrowPageComponent,
    SimpleTableComponent,
    ReferenceComponent,
    OneColumnTabComponent,
    DataReferenceComponent,
    SimpleTableSelectComponent,
    PromotedFiltersComponent,
    SingleReferenceReadonlyComponent,
    SemanticLinkComponent,
    MultiReferenceReadonlyComponent,
    FieldGroupTemplateComponent,
    FieldGroupListComponent,
    SimpleTableManualComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    DragDropModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSortModule,
    MatSelectModule,
    MatTabsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatDialogModule,
    MatStepperModule,
    NgxIntlTelInputModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'auto'} },
    { provide: APP_BASE_HREF, useValue: '/'},
    Utils, ServerConfigService, AuthService, FieldGroupUtils
  ],
  bootstrap: [AppComponent]
})



export class AppModule {
}
