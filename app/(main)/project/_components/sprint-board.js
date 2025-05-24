"use client";

import { useEffect, useState } from "react";
import SprintManager from "./sprint-manager";
import statuses from "@/data/status";
import CreateIssueDrawer from "./create-issue";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";
import { BarLoader } from "react-spinners";
import IssueCard from "@/components/issue-card";
import { toast } from "sonner";
import BoardFilters from "./board-filters";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const SprintBoard = ({ sprints = [], projectId, orgId }) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0] || null
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const {
    loading: issueLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);

  const {
    fn: updateIssueOrderFn,
    loading: updateIssueLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueOrder);

  const [filteredIssues, setFilteredIssues] = useState([]);

  useEffect(() => {
    if (currentSprint?.id) {
      fetchIssues(currentSprint.id);
    }
  }, [currentSprint?.id]);

  // Sync filtered issues with full issue list
  useEffect(() => {
    if (issues) {
      setFilteredIssues(issues);
    }
  }, [issues]);

 const handleFilterChange = (newFilteredIssue) => {
  if (newFilteredIssue.length === 0) {
    // No filters selected, show all issues
    setFilteredIssues(issues);
  } else {
    setFilteredIssues(newFilteredIssue);
  }
};


  const onDragEnd = async (result) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to move issues");
      return;
    }

    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot move issues after sprint completed");
      return;
    }

    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderData = [...issues];

    const sourceList = newOrderData.filter(
      (list) => list.status === source.droppableId
    );
    const destinationList = newOrderData.filter(
      (list) => list.status === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reordered = reorder(sourceList, source.index, destination.index);
      reordered.forEach((card, index) => {
        card.order = index;
      });
    } else {
      const [movedCard] = sourceList.splice(source.index, 1);
      movedCard.status = destination.droppableId;
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, index) => {
        card.order = index;
      });
      destinationList.forEach((card, index) => {
        card.order = index;
      });
    }

    const sortedIssues = newOrderData.sort((a, b) => a.order - b.order);
    setIssues(sortedIssues); // ✅ FIXED: only one argument
    updateIssueOrderFn(sortedIssues); // update in backend
  };

  const handleIssueCreated = () => {
    fetchIssues(currentSprint.id); // refresh issues
  };

  if (issuesError) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Error loading issues
      </div>
    );
  }

  if (!currentSprint) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        No active sprints available.
      </div>
    );
  }

  return (
    <div>
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {issues && !issueLoading && (
        <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
      )}

      {updateIssuesError && (
        <p className="text-red-500 mt-2">{updateIssuesError.message}</p>
      )}

      {(issueLoading || updateIssueLoading) && (
        <BarLoader className="mt-4 mx-auto" width={"90%"} color="#36d7b7" />
      )}

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

                  {filteredIssues
                    ?.filter((issue) => issue.status === column.key)
                    .map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={updateIssueLoading}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard
                              issue={issue}
                              onDelete={() => fetchIssues(currentSprint.id)}
                              onUpdate={(updated) => {
                                setIssues((prevIssues) =>
                                  prevIssues.map((i) =>
                                    i.id === updated.id ? updated : i
                                  )
                                );
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}

                  {column.key === "TODO" &&
                    currentSprint.status !== "COMPLETED" && (
                      <Button
                        onClick={() => handleAddIssue(column.key)}
                        variant={"outline"}
                        className="flex w-full gap-1 justify-center items-center font-semibold"
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
  );
};

export default SprintBoard;

