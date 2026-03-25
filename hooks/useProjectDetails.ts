import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { getCurrentUserId } from "@/services/auth-storage";
import { projectApi } from "@/services/project-api";
import { fetchProjectCreatorDetails, fetchProjectMembersDetails } from "@/services/user-utils";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";

const fetchProject = async (id: string) => {
  const response = await projectApi.getProject(id);
  if (response.ok) {
    return response.data;
  }
  return null;
};

const fetchTasks = async (
  id: string,
  params?: {
    state?: string[];
    priority?: string[];
    tags?: string[];
    sort?: string[];
  },
) => {
  const response = await projectApi.getTasks(id, params);
  if (response.ok) {
    return response.data;
  }
  return null;
};

const fetchTags = async (id: string) => {
  const response = await projectApi.getProjectTags(id);
  if (response.ok && Array.isArray(response.data)) {
    return response.data.filter(
      (t: { id: string; name: string }) =>
        (t.id && t.id.trim() !== "") || (t.name && t.name.trim() !== ""),
    );
  }
  return [];
};

export function useProjectDetails(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [taskParams, setTaskParams] = useState<{
    state?: string[];
    priority?: string[];
    tags?: string[];
    sort?: string[];
  }>({});
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [projectOwner, setProjectOwner] = useState<User | null>(null);

  const isOwner = project?.created_by === currentUserId;

  const loadData = useCallback(async () => {
    const [projectData, tasksData, tagsData, userId] = await Promise.all([
      fetchProject(id),
      fetchTasks(id, taskParams),
      fetchTags(id),
      getCurrentUserId()
    ]);

    if (projectData) {
      setProject(projectData);
      // Wait for creator and members details sequentially or in parallel
      await Promise.all([
        fetchProjectCreatorDetails(projectData, setProjectOwner),
        fetchProjectMembersDetails(projectData, setProjectMembers)
      ]);
    }
    
    if (tasksData) setTasks(tasksData);
    if (tagsData) setTags(tagsData);
    setCurrentUserId(userId);
  }, [id, taskParams]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadData().catch(err => console.error("Error loading project data:", err));
      }
    }, [id, loadData]),
  );

  const updateProject = async (updates: Partial<Project> = {}) => {
    if (!project) return;
    const updatedProject = { ...project, ...updates };

    const response = await projectApi.updateProject(id, {
      title: updatedProject.title,
      description: updatedProject.description,
      start_date: updatedProject.start_date || undefined,
      end_date: updatedProject.end_date || undefined,
      status: updatedProject.status,
    });

    if (response.ok) {
      setProject(response.data);
    }
  };

  const addTagByName = async (name: string) => {
    const tag = tags.find((t) => t.name.toLowerCase() === name.toLowerCase());

    if (!tag) {
      const response = await projectApi.addProjectTag(id, name);
      if (response.ok && response.data) {
        setTags((prev) => [...prev, response.data]);
      } else {
        console.error("Failed to add tag", response);
        return;
      }
    }
  };

  const deleteTag = async (tagId: string) => {
    const previousTags = [...tags];
    setTags((prev) => prev.filter((t) => t.id !== tagId));

    const response = await projectApi.deleteTag(tagId);
    if (!response.ok) {
      console.error("Failed to delete tag", response);
      setTags(previousTags);
    }
  };

  const addProjectMember = async (user: User) => {
    const previousMembers = [...projectMembers];
    setProjectMembers((prev) => [...prev, user]);

    const response = await projectApi.addProjectMember(id, user.id);
    if (!response.ok) {
      console.error("Failed to add project member", response);
      setProjectMembers(previousMembers);
    }
  };

  const deleteProjectMember = async (user_id: string) => {
    const previousProjectMembers = [...projectMembers];
    setProjectMembers((prev) => prev.filter((t) => t.id !== user_id));

    const response = await projectApi.deleteProjectMember(id, user_id);
    if (!response.ok) {
      console.error("Failed to delete project member", response);
      setProjectMembers(previousProjectMembers);
    }
  };

  return {
    project,
    projectOwner,
    setProject,
    tasks,
    taskParams,
    setTaskParams,
    tags,
    projectMembers,
    currentUserId,
    isOwner,
    isRefreshing,
    refresh,
    updateProject,
    addTag: addTagByName,
    deleteTag,
    addProjectMember,
    deleteProjectMember,
  };
}
