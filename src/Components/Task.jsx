import React from 'react'

const Task = ({task}) => {
  return (
    <div className='bg-yellow-400 py-4 px-5 mb-3 rounded-lg'>
      <h2 className='font-bold text-3xl'>{task.taskTitle}</h2>
    </div>
  )
}

export default Task
