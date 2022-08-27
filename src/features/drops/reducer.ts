import Action from './action';
import State from './state';

function reducer(state: State, action: Action) {
  switch(action) {
    case Action.takeDose:
      const nextDose = state.dosesTaken.findIndex((taken) => !taken);
      const dosesTaken: boolean[] = state.dosesTaken.map((taken, index) => {
          if (index === nextDose) {
            return true;
          } else {
            return taken;
          }
      })

      return {
        dosesTaken,
        waitDialogOpen: true,
        lastDoseTime: Date.now()
      };
    case Action.tick:
      if (state.waitDialogOpen && Date.now() > state.lastDoseTime + 120 * 1000) {
        return { ...state, waitDialogOpen: false}
      }
      return state;
    default:
      return state;
  }
}

export default reducer;
