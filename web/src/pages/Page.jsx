import React from 'react'
import { useParams } from 'react-router-dom'
import { Blocks } from '../ui/Blocks.jsx'

export default function Page(){
  const { slug } = useParams()
  return <Blocks slug={slug} />
}
