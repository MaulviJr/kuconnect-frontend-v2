import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getPastPapers } from "@/apis/past-papers";
import Loader from "@/components/loader";
import { useEffect, useState } from "react";
import AppLayout from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function PastPapersPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const data = await getPastPapers("CS-460"); // TODO: replace with courseId when backend supports it
        setPapers(data.pastPapers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [courseId]);

  const handleUpload = () => {
    navigate(`/courses/${courseId}/past-papers/upload`);
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
          <h1 className="text-3xl font-bold text-primary">Past Papers</h1>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleUpload}>
            Upload Past Papers
          </Button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-8">
          <Input placeholder="Search past papers..." className="flex-1" />

          <div className="flex gap-4 w-full md:w-auto">
            {/* Sort Filter */}
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {papers.map((paper) => (
            <Card key={paper.id} className="border-2 border-green-500">
              <CardContent className="p-4 flex flex-col">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">{paper.title}</span>
                    <span className="text-sm text-muted-foreground">
                      Semester {paper.semester} – {paper.year}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      By {paper.uploadedBy}
                    </span>
                  </div>
                </div>
              </CardContent>
              {/* Footer Actions */}
              <CardFooter
                className={"flex items-center justify-between mt-4 text-sm"}>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Download className="w-4 h-4" /> {paper.downloads || 0}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(paper.fileUrl, "_blank")}>
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
