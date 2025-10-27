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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function NotesPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes(courseId);
        console.log("Notes API response:", data);
        setNotes(data.data || []);
        setFilteredNotes(data.data || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      fetchNotes();
    }
  }, [courseId]);

  // Filter notes based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchTerm, notes]);

  const handleUpload = () => {
    navigate(`/courses/${courseId}/notes/upload`);
  };

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
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleUpload}>
            Upload Notes
          </Button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-8">
          <Input 
            placeholder="DSA linked list" 
            className="flex-1" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex gap-4 w-full md:w-auto">
            {/* Type Filter */}
            {/* <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lecture">Lecture Notes</SelectItem>
                <SelectItem value="pastpapers">Past Papers</SelectItem>
                <SelectItem value="assignments">Assignments</SelectItem>
              </SelectContent>
            </Select> */}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-6 mt-10 mt-10">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="border-2 border-green-500 max-w-90 min-w-full">
              <CardContent className="flex flex-col">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">{note.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {note.description}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      By {note.user_name}
                    </span>
                  </div>
                </div>
              </CardContent>
              {/* Footer Actions */}
              <CardFooter
                className={"flex items-center justify-end text-sm"}>
                
                <div className="flex gap-2 flex-wrap">
                  {/* <Button variant="outline" size="sm" onClick={() => window.open(note.url, "_blank")}>                  
                    Preview
                  </Button> */}
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(note.url, "_blank")}>
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
