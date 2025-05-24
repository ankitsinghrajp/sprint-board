"use client";
import { createProject } from "@/actions/projects";
import OrgSwitcher from "@/components/org-switcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { projectSchema } from "@/app/lib/validators";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = () => {
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();

  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(projectSchema) });

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  const {data:project,loading,error,fn:createProjectFn} = useFetch(createProject);
 
  useEffect(()=>{

    if(project){
      toast.success("Project created successfully!");
      router.push(`/project/${project.id}`)


    }

  },[loading])

  const onsubmit = async (data)=>{
        createProjectFn(data);

  }

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 my-40 items-center">
        <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-red-600 via-red-500 to-red-600 bg-clip-text tracking-tighter text-transparent pr-2 pb-2">
          Oops! Only Admins Can Create Project.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-center text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-gray-900 via-slate-600 to-gray-900 dark:from-blue-500 dark:via-blue-100 dark:to-blue-400 bg-clip-text tracking-tighter text-transparent pr-2 pb-8">
        Create New Project
      </h1>

      <form className="flex flex-col space-y-6 mx-4" onSubmit={handleSubmit(onsubmit)}>
        <div>
          <Input
            id="name"
            placeholder="Project name"
            className={"dark:bg-[#09090b] bg-white border-2 dark:border-blue-200/70 border-gray-600"}
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-600 ml-2 text-sm mt-1">
              *{errors.name.message}
            </span>
          )}
        </div>


        <div>
          <Input
            id="key"
            placeholder="Project key (Ex. R124)"
            className={"dark:bg-[#09090b] bg-white border-2 dark:border-blue-200/70 border-gray-600"}
            {...register("key")}
          />
          {errors.key && (
            <span className="text-red-600 ml-2 text-sm mt-1">
              *{errors.key.message}
            </span>
          )}
        </div>



        <div>
          <Textarea
            id="description"
            placeholder="Project Description (*Optional)"
            className={"dark:bg-[#09090b] bg-white border-2 dark:border-blue-200/70 border-gray-600 h-28"}
            {...register("description")}
          />
          {errors.description && (
            <span className="text-red-600 ml-2 text-sm mt-1">
              *{errors.description.message}
            </span>
          )}
        </div>
        <Button disabled={loading} size={'lg'} type="submit" className={'text-center font-bold cursor-pointer'}>{loading?'Creating...':'Create Project'}</Button>
        {error && <span className="mt-2 ml-2 text-red-600">*{error.message}</span>}
      </form>
    </div>
  );
};

export default Page;
