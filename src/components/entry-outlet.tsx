import React from "react"
import { Outlet } from "react-router-dom"

type EntryOutletProps = {
  component: React.FC<{ children: any }>
}

const EntryOutlet: React.FC<EntryOutletProps> = ({ component: Wrapper }) => {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  )
}

export default EntryOutlet
