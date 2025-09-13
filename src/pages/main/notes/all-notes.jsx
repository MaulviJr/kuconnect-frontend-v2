import AppLayout from "@/components/layout";
import { useParams } from "react-router-dom";

export default function NotesPage() {
  const { courseId } = useParams();
  return (
    <AppLayout>
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Notes for {courseId}</h1>
        <p className="text-muted-foreground mt-2">Coming soon...</p>
      </div>
    </AppLayout>
  );
}
