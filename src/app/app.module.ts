import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { AuthService } from './_services/auth.service';
import { ServerConfigService } from './_services/server-config.service';

import { BundleSwatchComponent } from './_samples/mashup/bundle-swatch/bundle-swatch.component';
import { MCMainContentComponent } from './_samples/mashup/mc-main-content/mc-main-content.component';
import { MCNavComponent } from './_samples/mashup/mc-nav/mc-nav.component';
import { MainContentComponent } from './_samples/simple-portal/main-content/main-content.component';
import { MainScreenComponent } from './_samples/mashup/main-screen/main-screen.component';
import { NavigationComponent } from './_samples/simple-portal/navigation/navigation.component';
import { ResolutionScreenComponent } from './_samples/mashup/resolution-screen/resolution-screen.component';
import { SideBarComponent } from './_samples/simple-portal/side-bar/side-bar.component';
import { TopAppMashupComponent } from './_samples/full-portal/top-app-mashup/top-app-mashup.component';

import { ActionButtonsComponent } from './_components/action-buttons/action-buttons.component';
import { AppAnnouncementComponent } from './_components/_widgets/app-announcement/app-announcement.component';
import { AppShellComponent } from './_components/_templates/app-shell/app-shell.component';
import { AssignmentCardComponent } from './_components/assignment-card/assignment-card.component';
import { AssignmentComponent } from './_components/assignment/assignment.component';
import { AttachmentComponent } from './_components/attachment/attachment.component';
import { AutoCompleteComponent } from './_components/_forms/auto-complete/auto-complete.component';
import { CancelAlertComponent } from './_components/cancel-alert/cancel-alert.component';
import { CaseCreateStageComponent } from './_components/case-create-stage/case-create-stage.component';
import { CaseHistoryComponent } from './_components/_widgets/case-history/case-history.component';
import { CaseSummaryComponent } from './_components/_templates/case-summary/case-summary.component';
import { CaseViewComponent } from './_components/_templates/case-view/case-view.component';
import { CheckBoxComponent } from './_components/_forms/check-box/check-box.component';
import { CurrencyComponent } from './_components/_forms/currency/currency.component';
import { DataReferenceComponent } from './_components/_templates/data-reference/data-reference.component';
import { DateComponent } from './_components/_forms/date/date.component';
import { DateTimeComponent } from './_components/_forms/date-time/date-time.component';
import { DecimalComponent } from './_components/_forms/decimal/decimal.component';
import { DefaultFormComponent } from './_components/_templates/default-form/default-form.component';
import { DeferLoadComponent } from './_components/defer-load/defer-load.component';
import { DetailsComponent } from './_components/_templates/details/details.component';
import { DetailsOneColumnComponent } from './_components/_templates/details-one-column/details-one-column.component';
import { DetailsThreeColumnComponent } from './_components/_templates/details-three-column/details-three-column.component';
import { DetailsTwoColumnComponent } from './_components/_templates/details-two-column/details-two-column.component';
import { DropdownComponent } from './_components/_forms/dropdown/dropdown.component';
import { EmailComponent } from './_components/_forms/email/email.component';
import { FeedContainerComponent } from './_components/feed-container/feed-container.component';
import { FieldGroupListComponent } from './_components/_templates/field-group-list/field-group-list.component';
import { FieldGroupTemplateComponent } from './_components/_templates/field-group-template/field-group-template.component';
import { FileUtilityComponent } from './_components/_widgets/file-utility/file-utility.component';
import { FlowContainerComponent } from './_components/flow-container/flow-container.component';
import { HybridViewContainerComponent } from './_components/hybrid-view-container/hybrid-view-container.component';
import { IntegerComponent } from './_components/_forms/integer/integer.component';
import { ListPageComponent } from './_components/_templates/list-page/list-page.component';
import { ListUtilityComponent } from './_components/_widgets/list-utility/list-utility.component';
import { ListViewComponent } from './_components/_templates/list-view/list-view.component';
import { ModalViewContainerComponent } from './_components/modal-view-container/modal-view-container.component';
import { MultiReferenceReadonlyComponent } from './_components/_templates/multi-reference-readonly/multi-reference-readonly.component';
import { MultiStepComponent } from './_components/multi-step/multi-step.component';
import { NarrowWideFormComponent } from './_components/_templates/narrow-wide-form/narrow-wide-form.component';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { OneColumnComponent } from './_components/_templates/one-column/one-column.component';
import { OneColumnPageComponent } from './_components/_templates/one-column-page/one-column-page.component';
import { OneColumnTabComponent } from './_components/_templates/one-column-tab/one-column-tab.component';
import { OperatorComponent } from './_components/operator/operator.component';
import { PageComponent } from './_components/_templates/page/page.component';
import { PercentageComponent } from './_components/_forms/percentage/percentage.component';
import { PhoneComponent } from './_components/_forms/phone/phone.component';
import { PreviewViewContainerComponent } from './_components/preview-view-container/preview-view-container.component';
import { PromotedFiltersComponent } from './_components/_templates/promoted-filters/promoted-filters.component';
import { PulseComponent } from './_components/pulse/pulse.component';
import { RadioButtonsComponent } from './_components/_forms/radio-buttons/radio-buttons.component';
import { ReferenceComponent } from './_components/reference/reference.component';
import { RegionComponent } from './_components/region/region.component';
import { RepeatingStructuresComponent } from './_components/repeating-structures/repeating-structures.component';
import { RootContainerComponent } from './_components/root-container/root-container.component';
import { SemanticLinkComponent } from './_components/_forms/semantic-link/semantic-link.component';
import { SimpleTableComponent } from './_components/_templates/simple-table/simple-table.component';
import { SimpleTableManualComponent } from './_components/_templates/simple-table-manual/simple-table-manual.component';
import { SimpleTableSelectComponent } from './_components/_templates/simple-table-select/simple-table-select.component';
import { SingleReferenceReadonlyComponent } from './_components/_templates/single-reference-readonly/single-reference-readonly.component';
import { StagesComponent } from './_components//stages/stages.component';
import { TextAreaComponent } from './_components/_forms/text-area/text-area.component';
import { TextComponent } from './_components/_forms/text/text.component';
import { TextContentComponent } from './_components/_forms/text-content/text-content.component';
import { TextInputComponent } from './_components/_forms/text-input/text-input.component';
import { ThreeColumnComponent } from './_components/_templates/three-column/three-column.component';
import { ThreeColumnPageComponent } from './_components/_templates/three-column-page/three-column-page.component';
import { TimeComponent } from './_components/_forms/time/time.component';
import { TodoComponent } from './_components/todo/todo.component';
import { TopAppComponent } from './_components/top-app/top-app.component';
import { TwoColumnComponent } from './_components/_templates/two-column/two-column.component';
import { TwoColumnPageComponent } from './_components/_templates/two-column-page/two-column-page.component';
import { UrlComponent } from './_components/_forms/url/url.component';
import { UserReferenceComponent } from './_components/_forms/user-reference/user-reference.component';
import { UtilityComponent } from './_components/utility/utility.component';
import { ViewComponent } from './_components/view/view.component';
import { ViewContainerComponent } from './_components/view-container/view-container.component';
import { WideNarrowFormComponent } from './_components/_templates/wide-narrow-form/wide-narrow-form.component';
import { WideNarrowPageComponent } from './_components/_templates/wide-narrow-page/wide-narrow-page.component';

import { MaterialCaseSummaryComponent } from './_material_extensions/material-case-summary/material-case-summary.component';
import { MaterialDetailsComponent } from './_material_extensions/material-details/material-details.component';
import { MaterialSummaryItemComponent } from './_material_extensions/material-summary-item/material-summary-item.component';
import { MaterialSummaryListComponent } from './_material_extensions/material-summary-list/material-summary-list.component';
import { MaterialUtilityComponent } from './_material_extensions/material-utility/material-utility.component';
import { MaterialVerticalTabsComponent } from './_material_extensions/material-vertical-tabs/material-vertical-tabs.component';

import { FieldGroupUtils } from './_helpers/field-group-utils';
import { Utils } from './_helpers/utils';

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
    SimpleTableManualComponent,
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
    NgxIntlTelInputModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'auto' } },
    { provide: APP_BASE_HREF, useValue: '/' },
    Utils,
    ServerConfigService,
    AuthService,
    FieldGroupUtils,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
