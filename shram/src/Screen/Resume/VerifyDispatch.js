export const logAnswers = (data, index, type) => async (dispatch) => {
  if (type === 'industry') {
    await dispatch({
      type: 'Assessment_Change',
      payload: {data: data, index: index},
    });
  } else if (type === 'trade') {
    await dispatch({
      type: 'Trade_Change',
      payload: {data, index},
    });
  } else if (type === 'skill') {
    await dispatch({
      type: 'Skill_Change',
      payload: {data, index},
    });
  } else if (type === 'computer') {
    await dispatch({
      type: 'Computer_Change',
      payload: {data, index},
    });
  }
};
