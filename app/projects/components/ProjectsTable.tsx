'use client'
import Link from 'next/link'
import useFetchProjects from "../hooks/useFetchProjects"
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import dayjs from 'dayjs'
import { useDeleteProject } from '../hooks/useDeleteProject'

export default function Projects({userId}) {
  const { data, isPending } = useFetchProjects()
  const { mutate: deleteProject, isPending: pendingDelete } = useDeleteProject()

  if (isPending) return <p>Loading...</p>

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>Name</TableCell>
            <TableCell align='right'>Deadline</TableCell>
            <TableCell align='right'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? data.map(project => (
            <TableRow key={project.id}>
              <TableCell colSpan={2}>
                <Link href={`/projects/${project.uuid}`}>
                  {project.name}
                </Link>
              </TableCell>
              <TableCell align='right'>
                {project.deadline ?
                  dayjs(project.deadline).format("MMM D, YYYY")
                  : "N/A"
                }
              </TableCell>
              <TableCell align='right'>
                {project.owner === userId && (
                  <Button
                    onClick={() => deleteProject(project.uuid)}
                    disabled={pendingDelete}
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )) :
            <TableRow>
              <TableCell colSpan={4} align="center">
                No projects
              </TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}
