import CompanyCarousel from "@/components/company-carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart, Calendar, ChevronRight, Layout } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import faqs from "@/data/faqs";
import Link from "next/link";

const features = [
  {
    title: "Visual Task Management",
    description:
      "Easily organize your projects and tasks with clear, customizable boards that offer full control.",
    icon: Layout,
  },
  {
    title: "Effective Sprint Management",
    description:
      "Set up and monitor sprints efficiently, ensuring your team stays aligned and meets deadlines.",
    icon: Calendar,
  },
  {
    title: "Advanced Analytics & Reporting",
    description:
      "Access comprehensive reports that provide actionable insights for smarter decision-making.",
    icon: BarChart,
  },
];

export default function HOME() {
  return (
    <>
      <div className="pt-24 min-h-screen">
        {/* Hero Section is here  */}
        <section className="dotted-background py-20 border-dotted border-b-1 border-gray-950 dark:border-gray-500 pb-2 ">
          <div className="container mx-auto pb-40 py-20 text-center">
            <h1
              className="text-6xl sm:text-6xl lg:text-7xl gradient-title flex flex-col 
          font-extrabold bg-gradient-to-br mb-2 from-gray-900 via-slate-600 to-gray-900 dark:from-blue-500 dark:via-blue-100 dark:to-blue-400 bg-clip-text tracking-tighter text-transparent pr-2 pb-2
          "
            >
              Unleash Your Team&apos;s Potential with
              <br />
              <span>
                <span
                  className="text-6xl ml-3 sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent 
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
        animate-gradient-x animate-pulse"
                >
                  SprintBoard
                </span>
              </span>
            </h1>
            <p className="text-xl text-gray-900 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Simplify teamwork with our smart project management solution that helps teams plan, execute, and achieve goals effortlessly.
            </p>
            <Link href="/onboarding">
              <Button size={"lg"} className={" font-semibold cursor-pointer mr-4"}>
                Get Started
                <ChevronRight className="ml-1" size={18} />
              </Button>
            </Link>

            <Link href="#features">
              <Button  className="cursor-pointer" size={"lg"} variant={"outline"}>
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section
          id="features"
          className="border-dotted border-b-1 border-gray-950 dark:border-gray-500 pb-2 "
        >
          <div className="py-20 container mx-auto">
            <h3 className="text-center text-3xl font-bold dark:text-gray-200 text-gray-800  mb-12">
              Key Features
            </h3>
            <div className="grid grid-cols-1 mx-5 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                return (
                  <Card key={index} className={"bg-blue-100 dark:bg-[#09090b]"}>
                    <CardContent
                      className={"flex items-center text-center flex-col"}
                    >
                      <feature.icon className="h-12 w-12 mb-4 text-blue-600 dark:text-blue-400" />
                      <h2 className="text-xl font-semibold mb-2 dark:text-gray-200 text-gray-900">
                        {feature.title}
                      </h2>
                      <p className="dark:text-gray-300 text-gray-800">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-dotted border-b-1 border-gray-950 dark:border-gray-500 pb-2 dotted-background ">
          <div className="py-20 container mx-auto">
            <h3 className="text-center text-3xl font-bold dark:text-gray-200 text-gray-800  mb-12">
              Recognized by Industry Pioneers
            </h3>
            <CompanyCarousel />
          </div>
        </section>

        <section className="border-dotted border-b-1  border-gray-950 dark:border-gray-500 pb-2  ">
          <div className="py-20 container mx-auto">
            <h3 className="text-center text-3xl font-bold dark:text-gray-200 text-gray-800  mb-12">
              Frequently Asked Questions
            </h3>

            <Accordion className="mx-5" type="single" collapsible>
              {faqs.map((faq,index)=>{

                return  <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className={'text-[17px] py-4 tex-gray-900 dark:text-gray-200'}>{faq.question}</AccordionTrigger>
                <AccordionContent className={'text-[17px] text-gray-800 dark:text-gray-300'}>
                 {faq.answer}
                </AccordionContent>
              </AccordionItem>

              })}
             
            </Accordion>
          </div>
        </section>

          <section className="border-dotted border-b-1 text-center border-gray-950 dark:border-gray-500 pb-2 dotted-background ">
          <div className="py-20 container mx-auto">
           
           <h3 className="text-3xl font-bold dark:text-gray-200 text-gray-800 mb-12">Ready to supercharge your productivity effortlessly.</h3>
           <p className="text-xl mb-12 dark:text-gray-300 text-gray-600">Thousands of teams rely on SprintBoard to keep their projects on track and collaborate seamlessly. Discover how easy productivity and teamwork can be with SprintBoard by your side.</p>
           <Link href={'/onboarding'}>
           <Button className={'font-semibold cursor-pointer animate-bounce'} size={'lg'}>Start For Free
            <ArrowRight className="h-5 ml-2 w-5"/>
            </Button></Link>
          </div>
        </section>
      </div>
    </>
  );
}
