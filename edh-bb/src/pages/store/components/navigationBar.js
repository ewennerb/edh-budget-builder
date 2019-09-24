import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import { Route, Switch } from "react-router-dom";

import DeckList from '../../DeckList';
import CreateDeck from '../../CreateDeck';
import CardSearch from '../../CardSearch';
import ChangeUsername from '../../ChangeUsername';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={event => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function NavTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          <LinkTab label="Home/My Decks" href="/deck-list" {...a11yProps(0)} />
          <LinkTab label="Create Deck" href="/create-deck" {...a11yProps(1)} />
          <LinkTab label="Card Search" href="/search" {...a11yProps(2)} />
          <LinkTab label="Something else" href="/" {...a11yProps(3)} />
          
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Switch>
          <Route exact path="/" component={DeckList} />
        </Switch>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Switch>
          <Route exact path="/" component={CreateDeck} />
        </Switch>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Switch>
          <Route exact path="/" component={CardSearch} />
        </Switch>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Switch>
          Something else
        </Switch>
      </TabPanel>


    </div>
  );
}