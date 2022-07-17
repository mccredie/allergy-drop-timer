import { useEffect, useReducer } from 'react';

import LinearProgress from '@mui/material/LinearProgress';
import CardContent from '@mui/material/CardContent';
import Dialog from  '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import './App.css';

interface DropTodoItemProps {
  children: string,
  complete: boolean,
}

function DropTodoItem({children, complete}: DropTodoItemProps) {
  return <ListItem key={children} role="listitem">
    <ListItemIcon>
      <Checkbox checked={complete} />
    </ListItemIcon>
    <ListItemText sx={{
      textDecoration: complete ? "line-through" : "none"
    }} primary={`Take dose ${children}`} />
  </ListItem>;
}

interface State {
  dosesTaken: [string, boolean][],
  lastDoseTime: number,
  waitDialogOpen: boolean
}

enum Action {
  takeDose,
  tick
}

function reducer(state: State, action: Action) {
  switch(action) {
    case Action.takeDose:
      const nextDose = (state.dosesTaken.find(([_, taken]) => !taken) || [ "", false])[0];
      const dosesTaken: [string, boolean][] = state.dosesTaken.map(([dose, taken]) => {
          if (dose === nextDose) {
            return [dose, true];
          } else {
            return [dose, taken];
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

interface AppProps {
  doses?: string[]
}

function App({doses=[]}: AppProps) {
  const initDoses: State['dosesTaken']  = doses.map((dose) => [dose, false]);
  const [
    {
      dosesTaken,
      waitDialogOpen,
    },
    dispatch
  ] = useReducer(reducer, {
    dosesTaken: initDoses,
    waitDialogOpen: false,
    lastDoseTime: 0
  });
  const handleClick = () => {
    dispatch(Action.takeDose)
  }
  useEffect(() => {
    setInterval(() => dispatch(Action.tick), 500);
  }, [])

  return (
    <div className="App">
      <Paper sx={{mx: "auto", my: 3, width: 250}}>
        <List>
          {
            dosesTaken.map(([dose, taken]) =>
              <DropTodoItem complete={taken}>{dose}</DropTodoItem>
            )
          }
        </List>
        <Button onClick={handleClick} >Take Next Dose</Button>
      </Paper>
      <Dialog open={waitDialogOpen} >
        <Card>
          <CardContent>
            <h5>Hold under tongue for 2 minutes.</h5>
            <LinearProgress variant="indeterminate" value={0} />
          </CardContent>
        </Card>
      </Dialog>
    </div>
  );
}

export default App;
