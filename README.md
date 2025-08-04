<p align="center"><img width=60% src="docs/media/AngularSDK-Logo.png">

# Angular SDK - Release Announcement - v24.2.11

The **SDK-A v24.2.11** release is **only compatible with Pega Infinity '24.2**. This release is available in the [**release/24.2.11**](https://github.com/pegasystems/angular-sdk/tree/release/24.2.11) branch of the Angular SDK repository.

**Note**: The main branch is the active development branch for future versions of Angular SDK.

The SDK-A v24.2.11 release allows Angular SDK users to take advantage of the latest SDK enhancements and fixes. For more information, see
[What's new in SDK-A 24.2.11](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/angular-sdk-updates.html).

For information on all Angular SDK releases, see [Angular SDK updates](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/angular-sdk-updates.html).

<hr>



***IMPORTANT:***  If you are upgrading from a previous version of Angular SDK, please follow the guidelines documented in [Upgrading Angular SDK](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/upgrading-angular-sdk.html).

---

# Overview

The Angular SDK combined with Pega's client orchestration APIs (ConstellationJS APIs) provides a guided iterative development workflow experience. This accelerates integrating Pega’s Constellation DX API with an alternative (non-Pega) UI. Integrating an alternative design system is achieved using DX Components.

A DX component consists of the following:
- Component definition metadata that defines the low code developer configuration experience in App Studio and the parameters passed to the DX component for runtime rendering.
- Javascript to integrate component parameters, ConstellationJS client APIs, and alternate design system presentational components.
-	Storybook configuration and mocks for integrating with Infinity to facilitate local component testing before publication, configuration, and testing with the Infinity server.

The Angular SDK includes a ConstellationJS to Angular bridge and sample DX components. The alternative design system used in the Angular SDK is [Angular Material](https://material.angular.io/). For more information about Constellation SDKs, see the [Constellation SDKs documentation](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/constellation-sdks.html).
<br>

# Prerequisites

## Pega Infinity Server and Constellation architecture-enabled Application

This version of the Angular SDK assumes that you have access to a Pega Infinity server (**24.2.0+**) running an application that is configured to run using the Constellation UI service. 

The **MediaCo** sample application is already configured as a Constellation architecture-based application and can be found in the Angular SDK download associated with this repo which is available in the [Angular SDK Pega Marketplace page](https://community.pega.com/marketplace/components/angular-sdk). The OAuth 2.0 Client Registration records associated with the **MediaCo** application are available in the same Angular SDK download. For more information about the MediaCo sample application, see [MediaCo sample application](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/mediaco-sample-application.html).

The **Angular SDK** has been tested with:

- node 20.16.0
- npm 10.8.1

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
