import React from 'react';

const Item = ({ item }) => {
  return (
    <a
      className="item" 
      title={item.title} 
      href={item.url} 
      target="_blank"
      >
      <img src={item.icon} alt="Logo" width={32} height={32} />
      <div className="item">
        <h4 className="item">{item.title}</h4>
        <p className="item">{item.author}</p>
        <p className="item">{item.date} &#8226; {item.length}</p>
      </div>
    </a>
  );
};

export default Item;