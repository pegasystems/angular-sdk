declare var PCore;

function hasNotificationMessages(pConnect) {
    return !!pConnect.getValue("caseMessages");
};

function isCaseWideLocalAction(pConnect) {
    const { CASE_INFO } = PCore.getConstants();
    const actionID = pConnect.getValue(CASE_INFO.ACTIVE_ACTION_ID);
    const caseActions = pConnect.getValue(CASE_INFO.CASE_INFO_ACTIONS);
    if (caseActions && actionID) {
        const activeAction = caseActions.find(
            (caseAction) => caseAction.ID === actionID
        );
        return activeAction?.type === "Case";
    }
    return false;
};

function getChildCaseAssignments(pConnect) {
    const childCases = pConnect.getValue(PCore.getConstants().CASE_INFO.CHILD_ASSIGNMENTS);
    let allAssignments = [];
    if (childCases && childCases.length > 0) {
        childCases.forEach(({ assignments = [], Name }) => {
            const childCaseAssignments = assignments.map((assignment) => ({
                ...assignment,
                caseName: Name
            }));
            allAssignments = allAssignments.concat(childCaseAssignments);
        });
    }
    return allAssignments;
}


function hasAssignments(pConnect) {
    const { CASE_INFO } = PCore.getConstants();
    const assignments = pConnect.getValue(CASE_INFO.D_CASE_ASSIGNMENTS_RESULTS);
    const childCasesAssignments = getChildCaseAssignments(pConnect);

    if (assignments || childCasesAssignments || isCaseWideLocalAction(pConnect)) {
        return true;
    }
    return false;
};

export const showBanner = (getPConnect) => {
    const pConnect = getPConnect;
    return hasNotificationMessages(pConnect) || !hasAssignments(pConnect);
};


function getActiveCaseActionName(pConnect) {
    const caseActions = pConnect.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ACTIONS);
    const activeActionID = pConnect.getValue(PCore.getConstants().CASE_INFO.ACTIVE_ACTION_ID);
    const activeAction = caseActions.find((action) => action.ID === activeActionID);
    return activeAction?.name || '';
}

function showTodo(pConnect) {
    const caseViewMode = pConnect.getValue('context_data.caseViewMode');
    return caseViewMode !== 'perform';
}


export function getToDoAssignments(pConnect) {
    const caseActions = pConnect.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ACTIONS);
    const assignmentLabel = pConnect.getValue(PCore.getConstants().CASE_INFO.ASSIGNMENT_LABEL);
    const assignments = pConnect.getValue(PCore.getConstants().CASE_INFO.D_CASE_ASSIGNMENTS_RESULTS) || [];
    const childCasesAssignments = getChildCaseAssignments(pConnect) || [];
    let childCasesAssignmentsCopy = JSON.parse(JSON.stringify(childCasesAssignments));

    childCasesAssignmentsCopy = childCasesAssignmentsCopy.map((assignment) => {
        assignment.isChild = true;
        return assignment;
    });

    const todoAssignments = [...assignments, ...childCasesAssignmentsCopy];
    let todoAssignmentsCopy = JSON.parse(JSON.stringify(todoAssignments));

    if (caseActions && !showTodo(pConnect)) {
        todoAssignmentsCopy = todoAssignmentsCopy.map((assignment) => {
            assignment.name = getActiveCaseActionName(pConnect) || assignmentLabel;
            return assignment;
        });
    }

    return todoAssignmentsCopy;
}
