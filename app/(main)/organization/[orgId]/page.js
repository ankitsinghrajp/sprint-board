import { fetchOrganizationBySlug } from "@/actions/organization.js";
import OrgSwitcher from "@/components/org-switcher";
import UserLoading from "@/components/user-loading";
import ProjectList from "./_components/project-list";

const Page = async({params}) => {
    const {orgId} = await params;

    const organization = await fetchOrganizationBySlug(orgId);
  return (
    <>
    <UserLoading/>
    <div className="container mx-auto">
    <div className="mb-4 pt-5 flex flex-col px-5 sm:flex-row justify-between items-start">
      <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-gray-900 via-slate-600 to-gray-900 dark:from-blue-500 dark:via-blue-100 dark:to-blue-400 bg-clip-text tracking-tighter text-transparent  pr-2 pb-5">{organization.name}&apos;s project
        </h1>
      <OrgSwitcher/>
      </div>
      <div className="mb-4">
          <ProjectList orgId={organization.id} />
      </div>
      <div className="mt-8">
          Show user assigned and reported issues here
      </div>
      </div>


    </>
  )
}

export default Page