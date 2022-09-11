import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Button, Popover } from 'antd';

const Navbar = ({ content }) => {

  return (
    <Popover content={content} title="Title" trigger="click">
      <Button>Click me</Button>
    </Popover>
  );
};

export default Navbar;
