"use client";
import { createIssue } from "@/actions/issues";
import { getOrganizationUser } from "@/actions/organization";
import { issueSchema } from "@/app/lib/validators";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

const CreateIssueDrawer = ({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
  } = useFetch(createIssue);

  useEffect(()=>{

    if(newIssue){
       reset();
       onClose();
       onIssueCreated();
       toast.success("Issue created successfully!");
    }

  },[newIssue,createIssueLoading])

  const {
    loading: userLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUser);
  useEffect(() => {
    if (orgId && isOpen) {
      fetchUsers(orgId);
    }
  }, [isOpen, orgId]);

  const onSubmit = async (data) => {
     await createIssueFn(projectId,{...data,status,sprintId});
  };

  return (
    <Drawer className="" open={isOpen} onClose={onClose}>
      <DrawerContent className={'min-h-screen my-5 overflow-y-auto'}>
        <DrawerHeader>
          <DrawerTitle>Create New issue</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        {userLoading && <BarLoader width={"100%"} color="#36d7b7" />}
        <form className="p-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <Input
              id="title"
              {...register("title")}
              className={"border-1 dark:border-gray-700 border-gray-500"}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="assigneeId"
            >
              Assignee
            </label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  className={"border-1 dark:border-gray-700 border-gray-500"}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className={
                      "border-1 w-full dark:border-gray-700 border-gray-500"
                    }
                  >
                    <SelectValue placeholder="Select Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => {
                      return (
                        <SelectItem key={user.id} value={user.id}>
                          {user?.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assigneeId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.assigneeId.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MDEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>



          
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="priority"
            >
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  className={"border-1 dark:border-gray-700 border-gray-500"}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className={
                      "border-1 w-full dark:border-gray-700 border-gray-500"
                    }
                  >
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
         
          </div>

        {error && <p className="text-red-500 mt-2">{error.message}</p>}
        <Button
          type="submit"
          disabled={createIssueLoading}
          className={'w-full font-semibold cursor-pointer'}
        >
          {createIssueLoading ?"Creating..." :"Create Issue"}{" "}
        </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateIssueDrawer;
