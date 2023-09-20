/* eslint-disable no-undef */



/**
 * Given the PConnect object of a Template component, retrieve the children
 * metadata of all regions.
 * @param {Function} pConnect PConnect of a Template component.
 */
export function getAllFields(pConnect) {
  const metadata = pConnect().getRawMetadata();
  if (!metadata.children) {
    return [];
  }

  let allFields = [];

  const makeField = (f) => ({
    ...pConnect().resolveConfigProps(f.config),
    type: f.type
  });

  const hasRegions = !!metadata.children[0]?.children;
  if (hasRegions) {
    allFields = metadata.children.map((region) =>
      region.children.map((field) => {
        // Do not resolve the config props if is status work, instead create component here as status badge and mark as status display
        if (field.config?.value === '@P .pyStatusWork') {
          field.type = 'TextInput';
          field.config.displayAsStatus = true;
          return pConnect().createComponent(field);
        }

        return makeField(field);
      })
    );
  } else {
    allFields = metadata.children.map(makeField);
  }

  return allFields;
}



export function getFilteredFields(getPConnect) {
  let primaryFieldsRaw;
  let secondaryFieldsRaw;
  const metadata = getPConnect().getRawMetadata();
  const hasRegions = !!metadata.children[0]?.children;
  if (hasRegions) {
    primaryFieldsRaw = metadata.children[0].children;
    secondaryFieldsRaw = metadata.children[1].children;
  } else {
    [primaryFieldsRaw, secondaryFieldsRaw] = metadata.children;
  }

  // Filter out fields that are not visible and unsupported types for primary fields (for CaseSummary)
  primaryFieldsRaw = primaryFieldsRaw.filter((item) => {
    const resolvedItem = getPConnect().resolveConfigProps(item.config);
    return resolvedItem.visibility !== false && item.type !== 'TextContent';
  });

  secondaryFieldsRaw = secondaryFieldsRaw.filter((item) => {
    const resolvedItem = getPConnect().resolveConfigProps(item.config);
    return resolvedItem.visibility !== false && item.type !== 'TextContent';
  });

  return [primaryFieldsRaw, secondaryFieldsRaw];
}

/**
 * Returns ConfigurableLayout mapped content. With pre-populated default layout configs.
 * @param {object[]} regionData template children item.
 * @returns {object[]} ConfigurableLayout content.
 */
export function getLayoutDataFromRegion(regionData) {
  const defaultLayoutConfig = {
    width: 'full',
    fillAvailable: true,
    minWidth: [300, 'px']
  };

  return regionData.props
    ?.getPConnect()
    ?.getChildren()
    ?.map((item, index) => {
      const itemPConnect = item?.getPConnect();

      return {
        id: itemPConnect?.getComponentName() ? `${itemPConnect.getComponentName()}--${index}` : `item--${index}`,
        content: itemPConnect?.getComponent(),
        layoutConfig: {
          ...defaultLayoutConfig,
          ...itemPConnect?.getConfigProps().layoutConfig
        }
      };
    });
}

/**
 * Determine if the current view is the view of the case step/assignment.
 * @param {Function} pConnect PConnect object for the component
 */
export function getIsAssignmentView(pConnect) {
  // Get caseInfo content from the store which contains the view info about the current assignment/step
  // TODO To be replaced with pConnect.getCaseInfo().getCurrentAssignmentView when it's available
  const assignmentViewClass = pConnect.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_CLASSID);
  const assignmentViewName = pConnect.getValue(PCore.getConstants().CASE_INFO.ASSIGNMENTACTION_ID);

  const assignmentViewId = `${assignmentViewName}!${assignmentViewClass}`;

  // Get the info about the current view from pConnect
  const currentViewId = `${pConnect.getCurrentView()}!${pConnect.getCurrentClassID()}`;

  return assignmentViewId === currentViewId;
}

/**
 * A hook that gets the instructions content for a view.
 * @param {Function} pConnect PConnect object for the component
 * @param {string} [instructions="casestep"] 'casestep', 'none', or the html content of a Rule-UI-Paragraph rule (processed via core's paragraph annotation handler)
 */
export function getInstructions(pConnect, instructions = 'casestep') {
  const caseStepInstructions = pConnect.getValue(PCore.getConstants().CASE_INFO.INSTRUCTIONS);

  // Determine if this view is the current assignment/step view
  const isCurrentAssignmentView = getIsAssignmentView(pConnect);

  // Case step instructions
  if (instructions === 'casestep' && isCurrentAssignmentView && caseStepInstructions?.length) {
    return caseStepInstructions;
  }

  // No instructions
  if (instructions === 'none') {
    return undefined;
  }

  // If the annotation wasn't processed correctly, don't return any instruction text
  if (instructions?.startsWith('@PARAGRAPH')) {
     /* eslint-disable no-console */
    console.error('@PARAGRAPH annotation was not processed. Hiding custom instructions.');
     /* eslint-enable no-console */
    return undefined;
  }

  // Custom instructions from the view
  // The raw metadata for `instructions` will be something like '@PARAGRAPH .SomeParagraphRule' but
  // it is evaluated by core logic to the content
  if (instructions !== 'casestep' && instructions !== 'none') {
    return instructions;
  }
  return undefined;
}
