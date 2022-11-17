export const checkAccessRights = (page) => (dispatch, getState) => {
  let access = getState()?.CommonReducer.accessRightsData;
  if (access.includes(page)) {
    return true;
  } else {
    return false;
  }
};
