import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";

// Load Inter font with weight 400 (normal) and 700 (bold)
const interFont = Inter({
  weight: ["400", "700"],
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "SprintBoard",
  description:
    "SprintBoard is a powerful agile management tool that simplifies sprint planning, tracking, and team collaboration. Achieve faster, smarter, and more efficient sprints.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider

    appearance={{
      baseTheme:shadesOfPurple,
      variables:{
        colorPrimary: "#3b82f6",
        colorBackground: "#1a202c",
        colorInputBackground: "#2d3748",
        colorInputText: "#f3f4f6",
      },
      elements:{
        card: "bg-gray-800",
        headerTitle: "text-blue-400",
        headerSubtitle: "text-gray-400"
      }
    }}
    
    >
    <html lang="en" suppressHydrationWarning>
      <body className={`${interFont.className} bg-[#e0f2ff] dark:bg-[#09090b]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* {header} */}
          <Header/>
          <main className="min-h-screen">
          {children}
          </main>
          <footer className="border-dotted border-t-1 border-gray-950 dark:border-gray-500 py-8">
            <div className="container mx-auto"> 
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                
                <div className="flex justify-center items-center">
                  <div className="flex flex-col" >
                  <h2 className="font-bold dark:text-gray-200 mb-2 text-lg">GET IN TOUCH</h2>
                  <span className="text-sm font-semibold my-2 text-gray-800 dark:text-gray-400">Developer@ Ankit Singh Rajput </span>
                  <span className=" text-sm font-semibold my-2 text-gray-800 dark:text-gray-400">Contact: ankitcreativeworks@gmail.com</span>
                  <span className="text-center  text-sm font-semibold flex gap-3 item-center my-2">
                    <Link href={"https://github.com/ankitsinghrajp"}><Image src={'/github.png'} width={24} height={24} alt="github"/></Link>
                   <Link href="https://www.linkedin.com/in/ankit-singh-chouhan-6612bb252/"> <Image src={'/linkedin.png'} width={24} height={24} alt="linkedin"/></Link>
                   <Link href="https://www.instagram.com/"> <Image src={'/instagram.png'} width={24} height={24} alt="instagram"/></Link>
                   <Link href="https://x.com/AnkitSingh60125"> <Image src={'/twitter.png'} width={24} height={24} alt="twitter"/></Link>
                  </span>

                   <div className="flex md:hidden mt-10 flex-col">
                  <h2 className="font-bold text-lg dark:text-gray-200">MY OTHER PROJECTS</h2>
                  <Link className="text-sm my-4 text-blue-600 dark:text-blue-500" href="https://elevate-ai-iota.vercel.app/">&gt; Ankit's Elevate AI </Link>
                  <Link className="text-sm text-blue-600 dark:text-blue-500 " href="https://car-vision.vercel.app/">&gt; AI Car Market Place</Link>
                </div>
                  </div>
                  
                </div>
                <div className="flex justify-center">
                  <div className="md:flex hidden md:flex-col">
                  <h2 className="font-bold text-xl dark:text-gray-200">MY OTHER PROJECTS</h2>
                  <Link className="text-sm my-4 text-blue-500" href="https://elevate-ai-iota.vercel.app/">&gt; Ankit's Elevate AI </Link>
                  <Link className="text-sm text-blue-500 " href="https://car-vision.vercel.app/">&gt; AI Car Market Place</Link>
                </div>
</div>
              </div>
            </div>
           
          </footer>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
