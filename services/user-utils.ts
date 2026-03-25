import { userApi } from "./user-api";
import type { User } from "@/types/user";
import type { Project } from "@/types/project";

export const fetchProjectCreatorDetails = async (
  data: Project,
  setProjectOwner: (user: User | null) => void,
) => {
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
};

export const fetchProjectMembersDetails = async (
  data: Project,
  setProjectMembers: (users: User[]) => void,
) => {
  if (data.members && data.members.length > 0) {
    try {
      const usersPromises = data.members.map((memberId: string) =>
        userApi.getUser(memberId),
      );
      const usersResponses = await Promise.all(usersPromises);

      const fetchedUsers = usersResponses
        .filter((res) => res.ok && res.data)
        .map((res) => {
          const userData = res.data.user || res.data;
          // Basic check to ensure it looks like a User object
          if (userData && typeof userData === 'object' && 'id' in userData) {
            return userData as User;
          }
          return null;
        })
        .filter((user): user is User => user !== null);

      setProjectMembers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch project members details:", error);
      setProjectMembers([]);
    }
  } else {
    setProjectMembers([]);
  }
};
