# Angular PConnect: Usage

The Angular PConnect Service provides a sample Bridge that connects an Angular application to the Constellation Core.

This document describes the steps that should be taken in each of your application's Container Components to connect it to the Bridge.

## When creating a new Angular Container Component

When creating a new Angular Container Component, the following steps should be taken to connect the component to the AngularPConnect bridge:

1. Import the **AngularPConnect Service**

    > import { **AngularPConnectService** } from "../../_bridge/angular-pconnect";  

2. Inject the bridge into your component's constructor

    > constructor( **private *angularPConnect: AngularPConnectService***, ...) {}

3. Add 1 input variable and 1 class variable to your component: :  
***pConn$***: an Input variable used by every component to receive information about the component context from Pega  
***angularPConnectData***: a class variable that will be populated with a JSON object with information related to the component's use of the store.  This JSON object will be populated with the following keys when the component calls **registerAndSubscribeComponent**:
   * **compID**: the unique ID associated with this component,
   * **unsubscribeFn**: the function to be called when the component needs to unsubscribe from the store,
   * **validateMessage**: any validation/error message that gets generated for this object,
   * **actions**: any actions that are defined for this object

    > @Input() **pConn$**: any;  
    >  
    > **angularPConnectData**: any = { };  

4. Add code to your component's **ngOnInit** to register and subscribe to the Bridge. Set the **angularPConnectData** class variable defined in your component to the object returned by this call.

    > // First thing in initialization is registering and subscribing to the AngularPConnect service  
    >  
    > this.**angularPConnectData** = this.**angularPConnect.registerAndSubscribeComponent**(this, this.onStateChange);  
    >  
    >  // Then, continue on with other initialization


5. Add an **onStateChange** method to your component class (that was referred to in the previous step). This method is a callback that will be called when the applications's state changes once the component is registered and subscribed with the Bridge.  
The pattern that is used in your callback is to:  
    * Call the Bridge's **shouldComponentUpdate** method passing in your component's *this* value.
    * If *shouldComponentUpdate* returns ***true***, call your component's method that updates itself. In this example, this method is called ***updateSelf***().

    > // Callback passed when subscribing to store change  
**onStateChange**() {  
&nbsp; &nbsp; &nbsp; &nbsp; // Should always check the bridge to see if the component should  
&nbsp; &nbsp; &nbsp; &nbsp; //  update itself (re-render)  
&nbsp; &nbsp; &nbsp; &nbsp; const **bUpdateSelf** = this.**angularPConnect.shouldComponentUpdate( this )**;  
&nbsp; &nbsp; &nbsp; &nbsp;  
&nbsp; &nbsp; &nbsp; &nbsp; // ONLY call updateSelf when the component should update  
&nbsp; &nbsp; &nbsp; &nbsp; if (**bUpdateSelf**) {  
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; this.**updateSelf()**;  
&nbsp; &nbsp; &nbsp; &nbsp; }  
}

6. Assuming you have centralized the code that updates your component in the **updateSelf**() function as
described above, call **updateSelf**() in the component's **ngOnInit** to make sure that it is updated when it
is initialized.

    > **ngOnInit**(): void {  
&nbsp; &nbsp; &nbsp; &nbsp; *[ the **registerAndSubcribeComponent** code above and any other initialization code you need ]*  
&nbsp; &nbsp; &nbsp; &nbsp;          
&nbsp; &nbsp; &nbsp; &nbsp; // call updateSelf when initializing  
&nbsp; &nbsp; &nbsp; &nbsp;    this.**updateSelf**();  
    }

7. If your component supports events such as **onChange** or **onBlur**, pass the component and event to the apprpropriate entry in **actions** that was populated in angularPConnectData when the component was registered.
    
    > **fieldOnChange**(event: any) {  
&nbsp; &nbsp; &nbsp; &nbsp; this.**angularPConnectData.actions.onChange**( this, event);  
  }
&nbsp; &nbsp; &nbsp; &nbsp;  
&nbsp; &nbsp; &nbsp; &nbsp;  
**fieldOnBlur**(event: any) {  
&nbsp; &nbsp; &nbsp; &nbsp; this.**angularPConnectData.actions.onBlur**( this, event);  
  }

8. Add code to your component's **ngDestroy** method to unsubscribe from the application's store using the unsubscribe method returned in **angularPConnectData** when we called the Bridge **registerAndSubscribeComponent**.

    > **ngOnDestroy**(): void {  
&nbsp; &nbsp; &nbsp; &nbsp; if (this.angularPConnectData.unsubscribeFn) {  
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; this.**angularPConnectData.unsubscribeFn**();  
&nbsp; &nbsp; &nbsp; &nbsp; }  
}