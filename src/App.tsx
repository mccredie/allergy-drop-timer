import { useEffect, useReducer, forwardRef } from 'react';
import { toWordsOrdinal } from 'number-to-words';

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
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import './App.css';
import { DropAction, DropState, dropReducer } from './features/drops';

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
    }} primary={`Take ${children} dose`} />
  </ListItem>;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

interface AppProps {
  doses?: number
}

function App({doses=1}: AppProps) {
  const initDoses: DropState['dosesTaken'] = Array(doses).fill(false);
  const [
    {
      dosesTaken,
      waitDialogOpen,
    },
    dispatch
  ] = useReducer(dropReducer, {
    dosesTaken: initDoses,
    waitDialogOpen: false,
    lastDoseTime: 0
  });
  const handleClick = () => {
    dispatch(DropAction.takeDose)
  }
  useEffect(() => {
    setInterval(() => dispatch(DropAction.tick), 500);
  }, [])

  return (
    <div className="App">
      <Paper sx={{mx: "auto", my: 3, width: 250}}>
        <List>
          {
            dosesTaken.map((taken, index) =>
              <DropTodoItem complete={taken}>{toWordsOrdinal(index + 1)}</DropTodoItem>
            )
          }
        </List>
        <Button onClick={handleClick} >Take Next Dose</Button>
      </Paper>
        <Dialog open={waitDialogOpen} TransitionComponent={Transition} >
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
