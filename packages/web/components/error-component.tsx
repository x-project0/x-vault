'use server'
import React from 'react'

export  function ErrorComponent({error}: {error: string}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl text-center font-semibold mb-4">
        Error
      </h1>
      <p className="text-xl text-muted-foreground sm:text-2xl">
        {error}
      </p>
    </div>
  )
}
