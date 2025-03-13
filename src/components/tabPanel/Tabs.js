import React, { useState } from "react";
import './Tabs.css';

const Tabs = ({ selected = 0, children, isReadOnly }) => {
  const [selectedIndex, setSelectedIndex] = useState(selected);

  const handleChange = (index) => {
    if(!isReadOnly){
      setSelectedIndex(index);
    }
  };

  return (
    <>
      <ul style={{ marginBottom: "0px"}}>
        {children.map((elem, index) => {
          let style = index === selectedIndex ? "selected" : "";
          return (
            <li
              key={index}
              className={style}
              onClick={() => handleChange(index)}
            >
              <div >{elem.props.title + " | "}</div>
            </li>
          );
        })}
      </ul>
      <div className="tab">{children[selectedIndex]}</div>
    </>
  );
};

export default Tabs;