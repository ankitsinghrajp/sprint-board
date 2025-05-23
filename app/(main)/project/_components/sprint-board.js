"use client"

import { useState } from "react"
import SprintManager from "./sprint-manager"
import statuses from "@/data/status"
import CreateIssueDrawer from "./create-issue"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const SprintBoard = ({ sprints = [], projectId, orgId }) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0] || null
  )

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(null)

  const handleAddIssue = (status) => {
    setSelectedStatus(status)
    setIsDrawerOpen(true)
  }

  const onDragEnd = () => {
    // Logic to move issue between columns
  }

  const handleIssueCreated = () => {
    // Optional callback when an issue is created
  }

  if (!currentSprint) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        No active sprints available.
      </div>
    )
  }

  return (
    <div>
      {/* Sprint Manager */}
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 mx-4 mr-5 rounded-lg bg-slate-50 dark:bg-black">
          {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <h3 className="font-bold mb-2 text-center">{column.name}</h3>

                  {/* Issues would go here */}

                  {provided.placeholder}

                  {column.key === "TODO" &&
                    currentSprint.status !== "COMPLETED" && (
                      <Button
                        onClick={() => handleAddIssue(column.key)}
                        variant={"outline"}
                        className={
                          "flex w-full gap-1 justify-center items-center font-semibold"
                        }
                      >
                        <Plus className="h-4 w-4" />
                        Create Issue
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Issue Creation Drawer */}
      <CreateIssueDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  )
}

export default SprintBoard
