<p align="center"><img width=60% src="docs/media/AngularSDK-Logo.png">

# Angular SDK - Release Announcement - v23.1.10

The **SDK-A v23.1.10** release is **only compatible with Pega Infinity '23**. This release is related to the [**release/23.1.10** branch of the Angular SDK repository](https://github.com/pegasystems/angular-sdk/tree/release/23.1.10).
<br>

**Note**: From **SDK-A v23.1.10** onwards, the **main** branch will be the development branch for future versions or the latest version of Infinity. If you are currently using the Angular SDK with Pega Infinity 8.8, please use the [release/8.8.10 branch](https://github.com/pegasystems/angular-sdk/tree/release/8.8.10) instead of the main branch.

The SDK-A v23.1.10 release upgrades the Angular version to Angular 16 and the Material version to Material 16 and allows Angular SDK users to take advantage of the latest SDK enhancements and fixes. For more information, see
[What's new in SDK-A 23.1.10](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/angular-sdk-updates.html).
<br />

<hr>

## Previous releases

### Angular SDK - Release Announcement - v8.8.10 - June 2023

This version of the Angular SDK uses <strong>Angular 15 and Material 15</strong>, and <strong>only</strong> supports Pega Infinity&trade; 8.8.0 and higher versions. This is a <strong>significant update</strong> to the Angular SDK <strong>main</strong> branch. We strongly advise current SDK users to prepare for converting their changes to the SDK code to Angular 15.

For more information about this release, see [What's new in SDK-A 8.8.10](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/angular-sdk-updates.html#d8250e70).



---

***IMPORTANT:***  If you are upgrading from a previous version of Angular SDK, please follow the guidelines documented in [Upgrading Angular SDK](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/upgrading-angular-sdk.html).

---

# Overview of Angular SDK

The **Angular SDK** provides Pega customers with the ability to build DX components that connect Pega’s ConstellationJS Engine APIs to a design system other than Pega's Constellation design system.

The Angular SDK differs from out-of-the-box Constellation design system because it provides and demonstrates the use of a design system that is not the Pega **Constellation** design system. The alternative design system used in this Angular SDK is [Angular Material](https://material.angular.io/) - open-source components that integrate seamlessly with Angular.

The Angular SDK is built on a new and modernized UI technology stack (the Constellation JavaScript Engine and Constellation JavaScript API).

<br>

# Prerequisites

## Pega Infinity Server and Constellation architecture-enabled Application

This version of the Angular SDK assumes that you have access to a Pega Infinity server (**23.1.0+**) running an application that is configured to run using the Constellation UI service. _(If you need to use Infinity 8.8.x, please use the **release/8.8.10** branch instead of this **main** branch.)_

The **MediaCo** sample application is already configured as a Constellation architecture-based application and can be found in the Angular SDK download associated with this repo which is available in the [Angular SDK Pega Marketplace page](https://community.pega.com/marketplace/components/angular-sdk). The OAuth 2.0 Client Registration records associated with the **MediaCo** application are available in the same Angular SDK download. For more information about the MediaCo sample application, see [MediaCo sample application](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/mediaco-sample-application.html).

The **Angular SDK** has been tested with:

- node 18.12.1/18.13.0
- npm 8.19.2/8.19.3

Future updates to the SDK will support more recent LTS versions of node as the Constellation architecture supports them.

**Before** installing and running the SDK code, refer to the [Angular SDK Guide](https://community.pega.com/marketplace/component/angular-sdk) in the Pega Marketplace for the procedure to prepare your Infinity server and node environment so you can proceed with the steps in the next section.

<br>

---
# Troubleshooting
If you are facing any issues, please see [Troubleshooting Constellation SDKs](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/troubleshooting-constellation-sdks.html).


---

## License

This project is licensed under the terms of the **Apache 2** license.

> You can see the full license [here](LICENSE) or directly on [apache.org](https://www.apache.org/licenses/LICENSE-2.0).

<br>

---

## Contributing

We welcome contributions to the Angular SDK project.

Refer to our [guidelines for contributors](./docs/CONTRIBUTING.md) if you are interested in contributing to the project.

<br>

---

## Additional Resources

- **KeyReleaseUpdates.md**: A summary of the latest updates to the **@pega/angular-sdk-components** and **@pega/angular-sdk-overrides** used by the Angular SDK can be found in the [**KeyReleaseUpdates.md**](./node_modules/@pega/angular-sdk-components/lib/doc/KeyReleaseUpdates.md) file of the angular-sdk-components package.
  - To see if there are updates in the @pega/angular-sdk-components and @pega/angular-sdk-overrides packages published in a newer version than is
currently installed, check the [**KeyReleaseUpdates.md**](https://github.com/pegasystems/angular-sdk-components/blob/master/packages/angular-sdk-components/doc/KeyReleaseUpdates.md) file of the package of the main GitHub repo.
- [Angular](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [Constellation SDKs Documentation](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/constellation-sdks.html)
- [Troubleshooting Constellation SDKs](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/troubleshooting-constellation-sdks.html)
- [MediaCo sample application](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/mediaco-sample-application.html)
