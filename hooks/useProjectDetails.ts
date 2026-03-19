import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { getCurrentUserId } from "@/services/auth-storage";
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

async function fetchProjectCreatorDetails(
  data: Project,
  setProjectOwner: React.Dispatch<React.SetStateAction<User | null>>,
) {
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
}

async function fetchProjectMembersDetails(
  data: Project,
  setProjectMembers: React.Dispatch<React.SetStateAction<User[]>>,
) {
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

  const loadProject = useCallback(async () => {
    const data = await fetchProject(id);
    if (data) {
      setProject(data);
      fetchProjectCreatorDetails(data, setProjectOwner);
      fetchProjectMembersDetails(data, setProjectMembers);
    }
  }, [id]);

  const loadTasks = useCallback(async () => {
    const data = await fetchTasks(id, taskParams);
    if (data) setTasks(data);
  }, [id, taskParams]);

  const loadTags = useCallback(async () => {
    const data = await fetchTags(id);
    if (data) setTags(data);
  }, [id]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([loadProject(), loadTasks(), loadTags()]);
    setIsRefreshing(false);
  }, [loadProject, loadTasks, loadTags]);

  useFocusEffect(
    useCallback(() => {
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
    }, [id, loadProject, loadTasks, loadTags]),
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
