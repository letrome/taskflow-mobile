import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { projectApi } from "@/services/project-api";
import { taskApi } from "@/services/task-api";
import { userApi } from "@/services/user-api";
import { fetchProjectMembersDetails } from "@/services/user-utils";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";

const fetchTask = async (id: string) => {
  const response = await taskApi.fetchTask(id);
  if (response.ok) {
    return response.data;
  }
  return null;
};

const fetchProjectTags = async (projectId: string) => {
  const response = await projectApi.getProjectTags(projectId);
  if (response.ok && Array.isArray(response.data)) {
    return response.data.filter(
      (t: { id: string; name: string }) =>
        (t.id && t.id.trim() !== "") || (t.name && t.name.trim() !== ""),
    );
  }
  return [];
};

const mapTagsFromIds = (
  tagIds: string[],
  projectTags: { id: string; name: string }[],
) => {
  return tagIds.map((tagId) => {
    const found = projectTags.find((pt) => pt.id === tagId);
    return found ? { id: tagId, name: found.name } : { id: tagId, name: tagId };
  });
};

export function useTaskDetails(id: string) {
  const [task, setTask] = useState<Task | null>(null);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [assigneeUser, setAssigneeUser] = useState<User | null>(null);
  const [projectTags, setProjectTags] = useState<
    { value: string; label: string }[]
  >([]);
  const [projectMembers, setProjectMembers] = useState<User[]>([]);

  const loadAssignee = useCallback(async (assigneeId: string | null) => {
    if (!assigneeId) {
      setAssigneeUser(null);
      return;
    }
    const userRes = await userApi.getUser(assigneeId);
    if (userRes.ok && userRes.data) {
      const userData = userRes.data.user || userRes.data;
      if (userData && typeof userData === 'object' && 'id' in userData) {
        setAssigneeUser(userData as User);
      }
    }
  }, []);

  const loadData = useCallback(async () => {
    const data = await fetchTask(id);
    if (!data) return;

    setTask(data);
    
    const promises: Promise<void>[] = [loadAssignee(data.assignee)];
    
    if (data.project) {
      const projectId = data.project;
      const taskTags = data.tags || [];
      
      const fetchProjectInfo = async () => {
        const [allProjectTags, projectRes] = await Promise.all([
          fetchProjectTags(projectId),
          projectApi.getProject(projectId),
        ]);

        setProjectTags(
          allProjectTags.map((t) => ({ value: t.id, label: t.name })),
        );
        setTags(
          taskTags.length > 0 ? mapTagsFromIds(taskTags, allProjectTags) : [],
        );

        if (projectRes.ok && projectRes.data) {
          await fetchProjectMembersDetails(projectRes.data, setProjectMembers);
        }
      };
      
      promises.push(fetchProjectInfo());
    }

    await Promise.all(promises);
  }, [id, loadAssignee]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadData().catch(err => console.error("Error loading task details:", err));
      }
    }, [id, loadData]),
  );

  const updateTask = async (updates: Partial<Task> = {}) => {
    if (!task) return;
    const updatedTask = { ...task, ...updates };

    const response = await taskApi.updateTask(id, {
      title: updatedTask.title,
      description: updatedTask.description,
      state: updatedTask.state,
      priority: updatedTask.priority,
      due_date: updatedTask.due_date,
      assignee: updatedTask.assignee,
    });

    if (response.ok) {
      const newData = response.data;
      setTask(newData);
      if (newData.assignee !== assigneeUser?.id) {
        await loadAssignee(newData.assignee);
      }
    }
  };

  const deleteCurrentTask = async () => {
    const response = await taskApi.deleteTask(id);
    if (response.ok) {
      router.back();
    }
  };

  const addTag = async (tagId: string, name: string) => {
    const previousTags = [...tags];
    setTags((prev) => [...prev, { id: tagId, name }]);
    const response = await taskApi.addTaskTag(id, tagId);
    if (!response.ok) {
      setTags(previousTags);
    }
  };

  const addTagByTagName = async (name: string) => {
    if (!task?.project) return;
    let tagId: string | undefined = projectTags.find(
      (t) => t.label.toLowerCase() === name.toLowerCase(),
    )?.value;

    if (!tagId) {
      const response = await projectApi.addProjectTag(task.project, name);
      if (response.ok && response.data) {
        tagId = response.data.id;
        setProjectTags((prev) => [
          ...prev,
          { value: response.data.id, label: response.data.name },
        ]);
      }
    }

    if (tagId) {
      await addTag(tagId, name);
    }
  };

  const removeTag = async (tagId: string) => {
    const previousTags = [...tags];
    setTags((prev) => prev.filter((t) => t.id !== tagId));

    const response = await taskApi.removeTaskTag(id, tagId);
    if (!response.ok) {
      setTags(previousTags);
    }
  };

  return {
    task,
    setTask,
    tags,
    projectTags,
    projectMembers,
    assigneeUser,
    updateTask,
    deleteCurrentTask,
    addTag: addTagByTagName,
    removeTag,
  };
}
