import React from "react";

import "./index.css";

const Avatar = ({ address }: { address: string }) => {
  return (
    <div className='avatar'>
      <img src={`https://mint.fun/api/avatar/${address}?size=150`} />
    </div>
  );
};

export default Avatar;
