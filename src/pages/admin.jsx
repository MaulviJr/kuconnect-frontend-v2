import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { useToast } from '@/components/ui/use-toast';
import { Search, PlusCircle, Edit, Trash2, ShieldCheck } from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import * as authApi from "@/apis/auth";
import AppLayout from "@/components/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminCatalogPanel() {
  const [activeTab, setActiveTab] = useState("departments");
  const [openModal, setOpenModal] = useState(null); // 'create', 'update', 'delete'
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({});
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  //   const { toast } = useToast();

  // Clear form data and results when closing dialog or switching tabs
  const handleCloseModal = () => {
    setOpenModal(null);
    setFormData({});
    setSearchResult(null);
    setSearchTerm("");
  };

  // Clear form data when switching tabs
  const handleTabChange = (value) => {
    setActiveTab(value);
    setFormData({});
    setSearchResult(null);
    setSearchTerm("");
  };

  const searchEntity = async () => {
    if (!searchTerm) return;
    let endpoint = "";
    if (activeTab === "departments")
      endpoint = `/catalog/search/departments?code=${searchTerm}`;
    if (activeTab === "programs")
      endpoint = `/catalog/search/programs?code=${searchTerm}`;
    if (activeTab === "courses")
      endpoint = `/catalog/search/courses?code=${searchTerm}`;

    try {
      setSearchLoading(true);
      const res = await fetch(`${BASE_URL}${endpoint}`);
      const data = await res.json();
      if (data.success && data.data) {
        // API sometimes returns an array (e.g. [{...}]) — pick the first item
        const record = Array.isArray(data.data) ? data.data[0] : data.data;
        if (record) {
          setSearchResult(record);
          // autofill form data from response (object)
          setFormData(record || {});
        } else {
          setSearchResult(null);
          setFormData({});
        }
      } else {
        setSearchResult(null);
        setFormData({});
      }
      //    else toast({ title: "No record found", variant: "destructive" });
    } catch (err) {
      console.error(err);
      //   toast({ title: "Error searching record", variant: "destructive" });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSaveOrUpdate = async () => {
    let endpoint = "";
    if (activeTab === "departments") endpoint = "/catalog/departments";
    if (activeTab === "programs") endpoint = "/catalog/programs";
    if (activeTab === "courses") endpoint = "/catalog/courses";

    try {
      setActionLoading(true);
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        // toast({ title: `${activeTab.slice(0, -1)} ${type}d successfully` });
        setOpenModal(null);
        setFormData({});
        setSearchResult(null);
      }
    } catch (err) {
      console.error(err);
      // toast({ title: `Error performing ${type}`, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    let endpoint = "";
    if (activeTab === "departments")
      endpoint = `/catalog/departments/${searchTerm}`;
    if (activeTab === "programs") endpoint = `/catalog/programs/${searchTerm}`;
    if (activeTab === "courses") endpoint = `/catalog/courses/${searchTerm}`;

    try {
      setActionLoading(true);
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        // toast({ title: `${activeTab.slice(0, -1)} deleted successfully` });
        setSearchResult(null);
        setSearchTerm("");
        setOpenModal(null);
      }
    } catch (err) {
      console.error(err);
      //   toast({ title: 'Error deleting record', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-white text-gray-800 p-6 space-y-6">
        <Card className="shadow-md border-green-200">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-green-700">
              Catalog Management
            </h2>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="bg-green-50">
                <TabsTrigger value="departments">Departments</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
              </TabsList>

              {["departments", "programs", "courses"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <Card className="p-6 flex flex-col items-center justify-center border-green-200 hover:shadow">
                      <PlusCircle size={40} className="text-green-600 mb-2" />
                      <Button
                        onClick={() => setOpenModal("create")}
                        className="bg-green-600 hover:bg-green-700 w-full"
                      >
                        Create {tab.slice(0, -1)}
                      </Button>
                    </Card>

                    <Card className="p-6 flex flex-col items-center justify-center border-green-200 hover:shadow">
                      <Edit size={40} className="text-green-600 mb-2" />
                      <Button
                        onClick={() => setOpenModal("update")}
                        className="bg-green-600 hover:bg-green-700 w-full"
                      >
                        Update {tab.slice(0, -1)}
                      </Button>
                    </Card>

                    <Card className="p-6 flex flex-col items-center justify-center border-green-200 hover:shadow">
                      <Trash2 size={40} className="text-green-600 mb-2" />
                      <Button
                        onClick={() => setOpenModal("delete")}
                        className="bg-green-600 hover:bg-green-700 w-full"
                      >
                        Delete {tab.slice(0, -1)}
                      </Button>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={!!openModal} onOpenChange={handleCloseModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="capitalize">
                {openModal} {activeTab.slice(0, -1)}
              </DialogTitle>
            </DialogHeader>

            {(openModal === "update" || openModal === "delete") && (
              <div className="flex gap-2 ">
                <Input
                  placeholder={`Enter ${activeTab.slice(0, -1)} code`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  onClick={searchEntity}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={searchLoading}
                >
                  {searchLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size={16} />
                      <span className="sr-only">Searching</span>
                    </div>
                  ) : (
                    <Search size={18} />
                  )}
                </Button>
              </div>
            )}
            <Separator orientation="horizontal" className="m-2 my-0 " />

            {openModal === "create" ||
            (searchResult &&
              (openModal === "update" || openModal === "delete")) ? (
              <form className="space-y-3">
                {/* For delete, show read-only fields autofilled from searchResult */}
                <Input
                  placeholder="Code"
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  disabled={openModal === "delete"}
                />
                <Input
                  placeholder="Name / Title"
                  value={formData.name || formData.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      title: e.target.value,
                    })
                  }
                  disabled={openModal === "delete"}
                />
                <Input
                  placeholder="Description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  disabled={openModal === "delete"}
                />
                {activeTab === "programs" && (
                  <>
                    <Input
                      placeholder="Department Code"
                      value={formData.department_code || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          department_code: e.target.value,
                        })
                      }
                      disabled={openModal === "delete"}
                    />
                    <Input
                      placeholder="Level"
                      value={formData.level || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      disabled={openModal === "delete"}
                    />
                    <Input
                      placeholder="Duration"
                      value={formData.duration || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: e.target.value,
                        })
                      }
                      disabled={openModal === "delete"}
                    />
                  </>
                )}
                {activeTab === "courses" && (
                  <>
                    <Input
                      placeholder="Program Code"
                      value={formData.program_code || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          program_code: e.target.value,
                        })
                      }
                      disabled={openModal === "delete"}
                    />
                    <Input
                      placeholder="Credits"
                      value={formData.credits || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          credits: e.target.value,
                        })
                      }
                      disabled={openModal === "delete"}
                    />
                    <Input
                      placeholder="Semester"
                      value={formData.semester || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          semester: e.target.value,
                        })
                      }
                      disabled={openModal === "delete"}
                    />
                  </>
                )}
                <Separator
                  orientation="horizontal"
                  className="mx-2 mb-4 mt-4 "
                />
                {openModal === "delete" ? (
                  <Button
                    onClick={handleDelete}
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size={16} /> Deleting...
                      </div>
                    ) : (
                      "Confirm Delete"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSaveOrUpdate}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size={16} />{" "}
                        {openModal === "create" ? "Saving..." : "Updating..."}
                      </div>
                    ) : openModal === "create" ? (
                      "Save"
                    ) : (
                      "Update"
                    )}
                  </Button>
                )}
              </form>
            ) : (
              openModal !== "create" && (
                <p className="text-gray-500 text-center">
                  Search to view details
                </p>
              )
            )}
          </DialogContent>
        </Dialog>
        {/* Control Management Section */}
        <Card className="shadow-md border-green-200">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-green-700">
              Control Management
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="p-6 flex flex-col items-center justify-center border-green-200 hover:shadow">
                <ShieldCheck size={40} className="text-green-600 mb-2" />
                <Button
                  onClick={() => setOpenModal("role")}
                  className="bg-green-600 hover:bg-green-700 w-full"
                >
                  Update Roles
                </Button>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Role Update Dialog */}
        <Dialog open={openModal === "role"} onOpenChange={handleCloseModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update User Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="User Email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Select
                value={formData.role || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleUpdateRole}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size={16} /> Updating...
                  </div>
                ) : (
                  "Update Role"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );

  async function handleUpdateRole() {
    try {
      setActionLoading(true);
      const response = await authApi.updateRole(formData.email, formData.role);
      if (response.success) {
        // toast({ title: "Role updated successfully" });
        setOpenModal(null);
        setFormData({});
      }
    } catch (err) {
      console.error(err);
      // toast({ title: "Error updating role", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  }
}
