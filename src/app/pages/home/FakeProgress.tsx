"use client"

import * as React from "react"

import { Progress } from "./../../../components/ui/Progress"

export function FakeProgress() {
  const [progress, setProgress] = React.useState(21)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 150)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} className="bg-yellow-100 [&>*]:bg-yellow-500" />
}
