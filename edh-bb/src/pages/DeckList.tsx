import React from "react";

import { Link, LinkProps } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref} {...props} />
));

const DeckList: React.FC = () => {
  // TODO
  return (
    <div>
      <h1>[DeckList]</h1>
  
      <Button color="primary" component={AdapterLink} to="/create-deck">
        Create New Deck
      </Button>

    </div>
    
  );
}

export default DeckList;
