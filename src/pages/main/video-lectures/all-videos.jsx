import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getVideos } from "@/apis/videos";
import Loader from "@/components/loader";
import { useEffect, useState } from "react";
import AppLayout from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Video } from "lucide-react";
import { FaCirclePlay } from "react-icons/fa6";

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function VideoLecturesPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos(courseId);
        console.log("Videos API response:", data);
        setVideos(data.data || []);
        setFilteredVideos(data.data || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      fetchVideos();
    }
  }, [courseId]);

  // Filter videos based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  }, [searchTerm, videos]);

  const handleUpload = () => {
    navigate(`/courses/${courseId}/lectures/upload`);
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
          <h1 className="text-3xl font-bold text-primary">Video Lectures</h1>
          <Button
            className=" cursor-pointer bg-primary hover:primary/80"
            onClick={handleUpload}
          >
            Upload Video
          </Button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-8">
          <Input
            placeholder="Search video lectures"
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex gap-4 w-full md:w-auto">
            {/* Type Filter */}
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lecture">Lecture Videos</SelectItem>
                <SelectItem value="tutorial">Tutorials</SelectItem>
                <SelectItem value="demo">Demos</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Added</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-10">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="flex flex-col  gap-2 border-2 p-2  max-w-90 border-primary "
            >
              <CardContent className=" flex w-full p-0 m-0  ">
                <div className="w-full flex justify-center border-2 border-gray-300 items-center bg-secondary  aspect-video rounded-md relative">
                  < FaCirclePlay className='w-11 h-11 text-primary'/> 

                </div>
              </CardContent>
              {/* Footer Actions */}
              <CardFooter className="p-0">
                <div className="flex-col w-full ">
                  <div className="flex px-2 flex-col text-left w-full overflow-hidden">
                    <span className="font-semibold w-full max-w-[90ch]">
                      {video.title}
                    </span>
                    <span className="text-xs w-full text-muted-foreground">
                      {video.user_name}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    className="bg-primary mt-2 hover:contrast-90 cursor-pointer w-full"
                    onClick={() => window.open(video.url, "_blank")}
                  >
                    Watch
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
