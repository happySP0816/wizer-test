import React from 'react'
import type { PropsWithChildren } from 'react'
import { StackContainerNav } from '../../styles/style-people-navbar'

interface ITeamsNavbar {
  margin?: number
}

const PeopleNavbar: React.FC<PropsWithChildren<ITeamsNavbar>> = ({ children, margin }: PropsWithChildren<ITeamsNavbar>) => {
  return <StackContainerNav mb={margin ? `${margin}px` : '67px'}>{children}</StackContainerNav>
}

export default PeopleNavbar
