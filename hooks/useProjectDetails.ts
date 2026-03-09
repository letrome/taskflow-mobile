import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { deleteToken, getCurrentUserId } from "@/services/auth-storage";
import { projectApi } from "@/services/project-api";
import { userApi } from "@/services/user-api";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";

const fetchProject = async (id: string) => {
  const response = await projectApi.getProject(id);
  if (response.ok) {
    return response.data;
  }
  if (response.status === 401) {
    await deleteToken();
    router.replace("/auth/login");
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
  if (response.status === 401) {
    await deleteToken();
    router.replace("/auth/login");
  }
  return null;
};

const fetchTags = async (id: string) => {
  const response = await projectApi.getProjectTags(id);
  if (response.ok) {
    return response.data;
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
  const [project_members, setProjectMembers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [projectOwner, setProjectOwner] = useState<User | null>(null);

  const isOwner = project?.created_by === currentUserId;

  useFocusEffect(
    useCallback(() => {
      const loadProject = async () => {
        const data = await fetchProject(id);
        if (data) {
          setProject(data);

          // Fetch project creator details
          if (data.created_by) {
            try {
              const res = await userApi.getUser(data.created_by);
              if (res.ok && res.data) {
                setProjectOwner((res.data.user || res.data) as User);
              }
            } catch (error) {
              console.error("Failed to fetch project owner:", error);
            }
          }

          // Fetch each user individually to map IDs to User objects
          if (data.members && data.members.length > 0) {
            try {
              const usersPromises = data.members.map((memberId: string) =>
                userApi.getUser(memberId),
              );
              const usersResponses = await Promise.all(usersPromises);

              const fetchedUsers = usersResponses
                .filter((res) => res.ok && res.data)
                .map((res) => {
                  return (res.data.user || res.data) as User;
                });

              setProjectMembers(fetchedUsers);
            } catch (error) {
              console.error("Failed to fetch project members details:", error);
              setProjectMembers([]);
            }
          } else {
            setProjectMembers([]);
          }
        }
      };
      const loadTasks = async () => {
        const data = await fetchTasks(id, taskParams);
        if (data) setTasks(data);
      };
      const loadTags = async () => {
        const data = await fetchTags(id);
        if (data) setTags(data);
      };

      const loadCurrentUser = async () => {
        const userId = await getCurrentUserId();
        setCurrentUserId(userId);
      };

      if (id) {
        loadProject();
        loadTasks();
        loadTags();
        loadCurrentUser();
      }
    }, [id, taskParams]),
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
    if (response.status === 401) {
      await deleteToken();
      router.replace("/auth/login");
    }
  };

  const addTag = async (name: string) => {
    const response = await projectApi.addProjectTag(id, name);
    if (response.ok && response.data) {
      setTags((prev) => [...prev, response.data]);
    } else {
      console.error("Failed to add tag", response);
    }
  };

  const deleteTag = async (tagId: string) => {
    // Optimistic update
    const previousTags = [...tags];
    setTags((prev) => prev.filter((t) => t.id !== tagId));

    const response = await projectApi.deleteTag(tagId);
    if (!response.ok) {
      // Revert on failure
      console.error("Failed to delete tag", response);
      setTags(previousTags);
    }
  };

  const addProjectMember = async (user: User) => {
    // Optimistic update
    const previousMembers = [...project_members];
    setProjectMembers((prev) => [...prev, user]);

    const response = await projectApi.addProjectMember(id, user.id);
    if (!response.ok) {
      // Revert on failure
      console.error("Failed to add project member", response);
      setProjectMembers(previousMembers);
    }
  };

  const deleteProjectMember = async (user_id: string) => {
    // Optimistic update
    const previousProjectMembers = [...project_members];
    setProjectMembers((prev) => prev.filter((t) => t.id !== user_id));

    const response = await projectApi.deleteProjectMember(id, user_id);
    if (!response.ok) {
      // Revert on failure
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
    project_members,
    currentUserId,
    isOwner,
    updateProject,
    addTag,
    deleteTag,
    addProjectMember,
    deleteProjectMember,
  };
}
