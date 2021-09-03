import React, { useCallback, useState } from 'react'
import Tooltip from 'components/Tooltip'
import { PopoverProps } from '../Popover'

interface TooltipProps extends Omit<PopoverProps, 'content'> {
    text: string
}
  
export default function MenuHelper({ children, text }: Omit<TooltipProps, 'show'>) {
    const [show, setShow] = useState<boolean>(false)

    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])

    return (
        <Tooltip text={text} show={show} placement="top-start" arrow={false}>
            <div onClick={open} onMouseEnter={open} onMouseLeave={close}>
                {children}
            </div>
        </Tooltip>
    )
}