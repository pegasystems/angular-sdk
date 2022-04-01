import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";


//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})

export class ReferenceComponent implements OnInit {

  @Input() pConn$: any;
  @Input() displayOnlyFA$ : boolean;

  angularPConnectData: any = { };
  configProps$ : Object;
  componentName$: string = "";
  referencedComponent: any = null;

  /* Used to toggle some class-wide logging */
  private static bLogging = false;


  constructor(private angularPConnect: AngularPConnectService) {
    // With new static method approach, this shouldn't be called any more
    window.alert(`in ReferenceComponent constructor!`);

    console.error(`in ReferenceComponent constructor!`);
  }

  ngOnInit(): void {
    // With new static method approach, this shouldn't be called any more

  }

  // onStateChange and updateSelf methods removed from original implementation
  //  when we moved to the static method implementation.



  // STATIC method to create a normalized PConn (a fully realized View that the 'reference'
  //  component refers to) from the given pConn. Has to add in some stuff as in the constructor
  static createFullReferencedViewFromRef(inPConn: any) {

    // BAIL and ERROR if inPConn is NOT a reference!
    if (inPConn.getComponentName() !== 'reference') {
      // debugger;

      console.error( `Reference component: createFullReferencedViewFromRef inPConn is NOT a reference! ${inPConn.getComponentName()}`);
    }

    const theResolvedConfigProps = inPConn.resolveConfigProps(inPConn.getConfigProps());

    const referenceConfig = { ...inPConn.getComponentConfig() } || {};

    delete referenceConfig?.name;
    delete referenceConfig?.type;
    delete referenceConfig?.visibility;

    const viewMetadata = inPConn.getReferencedView();

    if (!viewMetadata) {
      console.log("View not found ", inPConn.getComponentConfig());
      return null;
    }

    // If we get here, we have metadata for a View component...
    const referencedComponentName = viewMetadata.type;

    const viewObject = {
      ...viewMetadata,
      config: {
        ...viewMetadata.config,
        ...referenceConfig
      }
    };

    // eslint-disable-next-line no-console
    if (ReferenceComponent.bLogging) {
      console.log( `Reference: about to call createComponent with pageReference: context: ${theResolvedConfigProps["context"]}`);
    }

    const viewComponent = inPConn.createComponent(viewObject, null, null, {
      pageReference: theResolvedConfigProps["context"]
    });

    // updating the referencedComponent should trigger a render
    const newCompPConnect = viewComponent.getPConnect();

    newCompPConnect.setInheritedConfig({
          ...referenceConfig,
          readOnly: theResolvedConfigProps["readOnly"] ? theResolvedConfigProps["readOnly"] : false,
          displayMode: theResolvedConfigProps["displayMode"] ? theResolvedConfigProps["displayMode"]: null
        }
    );

    if (ReferenceComponent.bLogging) {
      console.log(`Angular Reference component: createFullReferencedViewFromRef -> newCompPConnect configProps: ${JSON.stringify(newCompPConnect.getConfigProps())}`);
    }

    return newCompPConnect;

  }

  // STATIC method that other components can call to normalize
  //  a pConn object that might be a 'reference'. If the incoming
  //  pConn is a reference, return its deferenced View PConnect's
  //  getPConnect. Otherwise, return the passed in pConn unchanged
  //  inPConn = a PConn object (ex: { getPConnect()} )
  static normalizePConn(inPConn: any) {
    // debugger;

    let returnObj = false;
    let thePConnType = "";

    if (inPConn["getPConnect"]) {
      // inPConn is an object (ex: { getPConnect()} ), so we want to return
      //  any referenced view as the object containing the
      //  the getPConnect function
      returnObj = true;
      thePConnType = inPConn.getPConnect().getComponentName();
   } else {
      // inPConn is an object with the PConnect function, so we want
      //  to return any referenced view as the object containing the
      //  the c11n function
      returnObj = false;
      thePConnType = inPConn.getComponentName();
    }

    if (thePConnType === 'reference') {

      if (returnObj) {
        return inPConn.getPConnect().getReferencedViewPConnect();
      } else {
        const theFullRefView = this.createFullReferencedViewFromRef(inPConn);

          return theFullRefView;
      }
    } else {
      return inPConn;
    }
  }

  // STATIC method that other components can call to normalize
  //  an array of pConn objects where any of the children might
  //  be a 'reference'. The array returns an array of children
  //  where any 'reference' is replaced with its ReferencedView
  //  inPConnArray is an array of PConn objects or functions.
  //    Its value is passed to normalizePConn

  static normalizePConnArray(inPConnArray: any) {


    if (!(inPConnArray?.length > 0)) {
      // null or empty array, return what was passed in
      return inPConnArray;
    }

    const theDerefencedArray = inPConnArray.map((child) => {
      return ReferenceComponent.normalizePConn(child);
    });

    return theDerefencedArray;
  }

}