'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useCreateProject } from '../hooks/useCreateProject'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { Dayjs } from 'dayjs'


interface Props {
  owner: string
}

interface ProjectFormData {
  name: string
  deadline: Dayjs | null
}

export default function CreateProject({ owner }: Props) {
  const { mutate: createProject, isPending } = useCreateProject()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    deadline: null,
  })

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setFormData({
      name: '',
      deadline: null,
    })
  }

  const open = Boolean(anchorEl)
  const id = open ? 'create-project-popover' : undefined

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateChange = (newValue: Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      deadline: newValue
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    const uuid = uuidv4()
    createProject({
      name: formData.name,
      deadline: formData.deadline ? formData.deadline.toISOString() : null,
      uuid,
      owner
    })
    handleClose()
  }

  return (
    <>
      <Button variant="contained" onClick={handleClick}>
        Create Project
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 3, width: 300 }}>
          <Typography variant="h6" gutterBottom>
            Create New Project
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Project Name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Due Date"
                onChange={handleDateChange}
                value={formData.deadline}
                slotProps={{
                  textField: { fullWidth: true, required: true, margin: 'normal' },
                }}
              />
            </LocalizationProvider>
            <Button
              type="submit"
              disabled={isPending}
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              {isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </form>
        </Box>
      </Popover>
    </>
  )
}
