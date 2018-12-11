import React from 'react';

const App = () => {
  const props = {
    className: 'app',
    id: 'app',
    'data-root': 'root',
  };
  return (
    <div {...props}>hello</div>
  );
};

export default App;
