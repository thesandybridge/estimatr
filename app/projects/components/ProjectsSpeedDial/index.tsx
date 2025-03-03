'use client'

import { memo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { Dayjs } from 'dayjs'
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { useCreateProject } from '../../hooks/useCreateProject'


interface Props {
  owner: string
}

interface ProjectFormData {
  name: string
  deadline: Dayjs | null
}

const ProjectsSpeedDial = ({ owner }: Props) => {
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
      <SpeedDial
        ariaLabel='Project Actions'
        icon={<SpeedDialIcon />}
        sx={{ position: 'absolute', bottom: '1rem', right: '1rem'}}
      >
        <SpeedDialAction
          onClick={handleClick}
          icon={<FontAwesomeIcon icon={faFolderPlus} />}
          slotProps={{
            tooltip: {
              title: "Create Project"
            }
          }}
        />
      </SpeedDial>
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
            <DateTimePicker
              label="Due Date"
              onChange={handleDateChange}
              value={formData.deadline}
              slotProps={{
                textField: { fullWidth: true, required: false, margin: 'normal' },
              }}
            />
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

export default memo(ProjectsSpeedDial);
