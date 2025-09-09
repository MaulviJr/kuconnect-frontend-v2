import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation, matchPath, useParams } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/gpa-calculator": "GPA Calculator",
  "/gpa-calculator/:semesterIndex": "GPA Calculator - Semester",
  "/ask-seniors": "Ask Seniors",
};

export function SiteHeader() {
  const location = useLocation();
  const { semesterIndex } = useParams();

  const matchedRoute = Object.keys(pageTitles).find((path) =>
    matchPath(path, location.pathname)
  );

  let title;
  if (
    matchedRoute === "/gpa-calculator/:semesterIndex" &&
    semesterIndex !== undefined
  ) {
    const semesterNumber = Number(semesterIndex) + 1;
    title = `GPA Calculator - Semester ${semesterNumber}`;
  } else {
    title = pageTitles[matchedRoute] || "KU Connect";
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground">
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
