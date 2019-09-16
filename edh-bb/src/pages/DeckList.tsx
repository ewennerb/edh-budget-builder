import React from "react";

import { MemoryRouter as Router } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Omit } from '@material-ui/types';

// The usage of React.forwardRef will no longer be required for react-router-dom v6.
// see https://github.com/ReactTraining/react-router/issues/6056
const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref} {...props} />
));

const CollisionLink = React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'innerRef' | 'to'>>(
  (props, ref) => <Link innerRef={ref} to="/getting-started/installation/" {...props} />,
);

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
