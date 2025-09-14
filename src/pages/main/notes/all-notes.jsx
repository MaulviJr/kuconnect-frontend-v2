import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getNotes } from "@/apis/notes";
import Loader from "@/components/loader";
import { useEffect, useState } from "react";
import AppLayout from "@/components/layout";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function NotesPage() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes("CS-460");
        setNotes(data.notes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [courseId]);

  if (loading) {
    return (
      <AppLayout>
        <Loader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Download Notes</h1>
          <Button className="bg-green-600 hover:bg-green-700">
            Upload Notes
          </Button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-8">
          <Input placeholder="DSA linked list" className="flex-1" />

          <div className="flex gap-4 w-full md:w-auto">
            {/* Type Filter */}
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lecture">Lecture Notes</SelectItem>
                <SelectItem value="pastpapers">Past Papers</SelectItem>
                <SelectItem value="assignments">Assignments</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Added</SelectItem>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {notes.map((note) => (
            <Card key={note.id} className="border-2 border-green-500">
              <CardContent className="p-4 flex flex-col">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">{note.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {note.courseName} – Semester {note.semester}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      By {note.uploadedBy}
                    </span>
                  </div>
                </div>
              </CardContent>
              {/* Footer Actions */}
              <CardFooter
                className={"flex items-center justify-between mt-4 text-sm"}>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Download className="w-4 h-4" /> {note.downloads || 0}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(note.fileUrl, "_blank")}>
                    Download
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
