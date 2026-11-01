import React from 'react'
import './btn.scss'

const Button = ({text="", icon: Icon = null, bg="var(--blue)", color="var(--gray)", fontSize = "14px",
isBorder = false, borderValue = -1, specialClass="", flex="", padding="", clickHandler}) => {

  const borderTypes = ['normal-black', 'normal-blue', 'offset-black', 'offset-blue', 'red-border'];
  const borderClass = isBorder && borderValue !== -1 
                      ? borderTypes[borderValue]: "";

  return (
    <button className={`btn ${borderClass} ${flex} ${specialClass}`} onClick={clickHandler} style={{backgroundColor:bg, color:color, fontSize:fontSize, padding:padding}}>
        {Icon && <Icon size={18}/>}
        {text}
    </button>
  )
}

export default Button