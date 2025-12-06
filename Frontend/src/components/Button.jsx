import React from 'react'
import clsx from 'clsx'
const Button = ({icon, className, label, type, onClick=()=>{}}) => {
  return (
<button
    type={type || 'button'}
    className={clsx('px-3 py-2 outline-none',className)}
    onClick={onClick}

>
    <span>{label}</span>
    {icon && <span>{icon}</span>}
</button>
  )
}

export default Button
