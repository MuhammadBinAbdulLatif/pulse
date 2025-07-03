"use client";
import { Project } from "@prisma/client";
import React, { useState } from "react";
import { cn, timeAgo } from "@/lib/utils";
import { useSlideStore } from "@/stores/useSlideStore";
import { useRouter } from "next/navigation";
import ThumbNailPreview from "./thumbnail-preview";
import { motion } from "framer-motion";
import { themes } from "@/constant/theme";
import AlertDialogBox from "./alert-dialog-box";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { deleteProject, recoverProject } from "@/actions/project";
type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  const { setSlides } = useSlideStore();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleNavigation = () => {
    setSlides(JSON.parse(JSON.stringify(project.slides)));
    router.push(`/presentation/${project.id}`);
  };
  const handleRecover = async () => {
    setLoading(true);
    if (!project.id) {
      setLoading(false);
      toast.error("Project not found");
      return;
    }
    try {
      const res = await recoverProject(project.id);
      if (res.status !== 200) {
        toast.error(res.message);
        throw new Error("Falied to recover project");
      }
      setOpen(false);
      router.refresh();
      toast.success("Project recovered successfully");
      setLoading(false);
    } catch (error) {
      console.error("AN error occured", error);
      toast.error("Internal server error. Please Try again.");
      setLoading(false);
    }
  };
  const theme = themes.find(
    (theme) => (theme.name = project.themeName || "Default")
  );
  const handleDelete = async () => {
    setLoading(true);
    if (!project.id) {
      setLoading(false);
      toast.error("Project not found");
      return;
    }
    try {
      const res = await deleteProject(project.id);
      if (res.status !== 200) {
        toast.error(res.message);
        throw new Error("Falied to recover project");
      }
      setOpen(false);
      setLoading(false);
      router.refresh();
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("AN error occured", error);
      toast.error("Internal server error. Please Try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={cn(
        "group w-full flex flex-col gap-y-3 rounded-xl p-3 transition-colors",
        !project.isDeleted && "hover:bg-muted/50"
      )}
    >
      <div
        className="relative aspect-[16/10 overflow-hidden rounded-lg cursor-pointer"
        onClick={handleNavigation}
      >
        <ThumbNailPreview
          theme={theme}
          slide={JSON.parse(JSON.stringify(project.slides))}
          url={project.thumbnailUrl || ""}
        />
      </div>
      <div className="w-full">
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-primary line-clamp-1">
            {project.title}
          </h3>
          <div className="flex w-full justify-between items-center gap-2">
            <p
              className="text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              {timeAgo(project.createdAt.toString())}
            </p>
            {project.isDeleted ? (
              <AlertDialogBox
                handleOpen={() => setOpen(!open)}
                onClick={handleRecover}
                loading={loading}
                open={open}
                description="This will recover your project and restore your data"
                className=""
              >
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  className="bg-gray-400 dark:hover:bg-background/55"
                  disabled={loading}
                >
                  Recover
                </Button>
              </AlertDialogBox>
            ) : (
              <AlertDialogBox
                description="This will delete your project and send to trash."
                className=""
                onClick={handleDelete}
                loading={loading}
                open={open}
                handleOpen={() => setOpen(!open)}
              >
                <Button
                  size={"sm"}
                  variant={"default"}
                  className="bg-gray-400 dark:hover:bg-background/55"
                  disabled={loading}
                >
                  Delete
                </Button>
              </AlertDialogBox>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
