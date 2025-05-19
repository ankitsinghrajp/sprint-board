import Link from "next/link";
import { ModeToggle } from "./toggle-mode";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import UserMenu from "./user-menu";
import { checkUser } from "@/lib/checkUser";
const Header = async() => {
  await checkUser()
  return (
  
    <header className="border-dotted bg-[#e0f2ff]/90 fixed z-50 top-0 w-full border-b-1 border-gray-950 dark:border-gray-500 dark:bg-[#09090b]/90">
      <div className="container mx-auto ">
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link href="/" className="flex flex-col">
         <span className="text-2xl font-bold bg-clip-text text-transparent 
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
        animate-gradient-x hover:animate-pulse">
  SprintBoard
</span>
          <span className="dark:text-gray-400 ml-3 -mt-[5px] font-semibold text-xs">&lt;by Ankit Singh Rajput&gt;</span>
        </Link>
        <div className="flex justify-center items-center gap-3">
          
            <SignedOut>
              <Button className={''} variant={'outline'} asChild>
                 <SignInButton forceRedirectUrl="/onboarding"/>
              </Button>
       
      </SignedOut>
      <SignedIn>
        <Link href={'/project/create'}>
        <Button className={'flex items-center gap-2'} variant={'destructive'}>
           <PenBox/>
          <span className="font-semibold">Create</span>
        </Button>
        </Link>
      </SignedIn>
       <ModeToggle />
       <SignedIn>
         <UserMenu/>
       </SignedIn>
      </div>
      </nav>
   
     
      </div>
    </header>

  );
};

export default Header;
