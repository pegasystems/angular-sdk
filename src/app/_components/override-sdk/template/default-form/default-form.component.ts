import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ReferenceComponent } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';
import { TemplateUtils } from '@pega/angular-sdk-components';
import { FormTemplateBase } from '@pega/angular-sdk-components';

interface DefaultFormProps {
  // If any, enter additional props that only exist on this component
  NumCols: string;
  instructions: string;
}

@Component({
  selector: 'app-default-form',
  templateUrl: './default-form.component.html',
  styleUrls: ['./default-form.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class DefaultFormComponent extends FormTemplateBase implements OnInit {
  @Input() override pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  arChildren$: any[];
  divClass$: string;
  instructions: string;

  constructor(private templateUtils: TemplateUtils) {
    super();
  }

  ngOnInit(): void {
    const configProps = this.pConn$.getConfigProps() as DefaultFormProps;
    const kids = this.pConn$.getChildren();
    this.instructions = this.templateUtils.getInstructions(this.pConn$, configProps?.instructions);

    const numCols = configProps.NumCols ? configProps.NumCols : '1';
    switch (numCols) {
      case '1':
        this.divClass$ = 'psdk-default-form-one-column';
        break;
      case '2':
        this.divClass$ = 'psdk-default-form-two-column';
        break;
      case '3':
        this.divClass$ = 'psdk-default-form-three-column';
        break;
      default:
        this.divClass$ = 'psdk-default-form-one-column';
        break;
    }

    // repoint children before getting templateArray
    // Children may contain 'reference' component, so we need to
    //  normalize them
    this.arChildren$ = ReferenceComponent.normalizePConnArray(kids[0].getPConnect().getChildren());
  }
}
