import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Bucket = {
  id: string;
  name: string;
  created: string;
  lastModified: string;
  files: File[];
};

export type File = {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: string;
  url: string;
};

export type SharedLink = {
  id: string;
  fileId: string;
  bucketId: string;
  url: string;
  expires: string;
  created: string;
  views: number;
};

export type ApiToken = {
  id: string;
  name: string;
  permissions: ("read" | "write" | "delete")[];
  created: string;
  expires: string | null;
};

export type ActivityLog = {
  id: string;
  action: "upload" | "download" | "create" | "delete" | "share";
  description: string;
  timestamp: string;
  user: string;
  bucketId?: string;
  fileId?: string;
};

// Initial mock data
const mockBuckets: Bucket[] = [
  {
    id: "bucket-1",
    name: "assets-production",
    created: "2023-05-12T10:30:00Z",
    lastModified: "2023-11-28T14:45:00Z",
    files: [],
  },
  {
    id: "bucket-2",
    name: "user-uploads",
    created: "2023-06-03T08:15:00Z",
    lastModified: "2023-12-01T09:20:00Z",
    files: [],
  },
  {
    id: "bucket-3",
    name: "backups",
    created: "2023-07-18T16:45:00Z",
    lastModified: "2023-11-15T11:30:00Z",
    files: [],
  },
  {
    id: "bucket-4",
    name: "static-website",
    created: "2023-09-22T13:10:00Z",
    lastModified: "2023-11-30T15:25:00Z",
    files: [],
  },
  {
    id: "bucket-5",
    name: "logs",
    created: "2023-04-10T09:00:00Z",
    lastModified: "2023-12-02T10:15:00Z",
    files: [],
  },
];

// Generate mock files for each bucket
mockBuckets.forEach((bucket) => {
  const fileCount =
    bucket.name === "user-uploads"
      ? 15
      : bucket.name === "logs"
      ? 25
      : bucket.name === "assets-production"
      ? 10
      : 5;

  for (let i = 0; i < fileCount; i++) {
    const fileType =
      i % 5 === 0
        ? "image/jpeg"
        : i % 5 === 1
        ? "application/pdf"
        : i % 5 === 2
        ? "text/plain"
        : i % 5 === 3
        ? "video/mp4"
        : "application/zip";

    const fileSize = Math.floor(Math.random() * 10000000) + 100000; // Random size between 100KB and 10MB

    bucket.files.push({
      id: `file-${bucket.id}-${i}`,
      name: `${bucket.name}-file-${i}.${fileType.split("/")[1]}`,
      type: fileType,
      size: fileSize,
      lastModified: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 86400000
      ).toISOString(),
      url: `/api/files/${bucket.id}/${i}`,
    });
  }
});

// Generate mock activity logs
const generateMockActivityLogs = (): ActivityLog[] => {
  const logs: ActivityLog[] = [];
  const actions: ("upload" | "download" | "create" | "delete" | "share")[] = [
    "upload",
    "download",
    "create",
    "delete",
    "share",
  ];

  for (let i = 0; i < 30; i++) {
    const action = actions[i % actions.length];
    const bucket = mockBuckets[i % mockBuckets.length];
    const file = bucket.files[i % bucket.files.length];

    let description = "";
    switch (action) {
      case "upload":
        description = `Uploaded ${file.name} to ${bucket.name} bucket`;
        break;
      case "download":
        description = `Downloaded ${file.name} from ${bucket.name} bucket`;
        break;
      case "create":
        description =
          i % 2 === 0
            ? `Created new bucket ${bucket.name}`
            : `Created folder folder-${i} in ${bucket.name} bucket`;
        break;
      case "delete":
        description = `Deleted ${file.name} from ${bucket.name} bucket`;
        break;
      case "share":
        description = `Created shareable link for ${file.name}`;
        break;
    }

    logs.push({
      id: `log-${i}`,
      action,
      description,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(), // Each log is 1 hour apart
      user: "john.doe@example.com",
      bucketId: bucket.id,
      fileId: file.id,
    });
  }

  return logs;
};

// Generate mock shared links
const generateMockSharedLinks = (): SharedLink[] => {
  const links: SharedLink[] = [];

  for (let i = 0; i < 5; i++) {
    const bucket = mockBuckets[i % mockBuckets.length];
    const file = bucket.files[i % bucket.files.length];

    links.push({
      id: `link-${i}`,
      fileId: file.id,
      bucketId: bucket.id,
      url: `https://share.betterflare.io/${bucket.id}/${file.id}`,
      expires: new Date(Date.now() + (i + 1) * 86400000).toISOString(), // Expires in 1-5 days
      created: new Date(Date.now() - i * 86400000).toISOString(), // Created 0-4 days ago
      views: Math.floor(Math.random() * 50),
    });
  }

  return links;
};

// Generate mock API tokens
const generateMockApiTokens = (): ApiToken[] => {
  return [
    {
      id: "token-1",
      name: "Upload Token",
      permissions: ["write"],
      created: "2023-11-15T10:30:00Z",
      expires: "2024-02-15T10:30:00Z",
    },
    {
      id: "token-2",
      name: "Read-only Token",
      permissions: ["read"],
      created: "2023-10-22T14:45:00Z",
      expires: null,
    },
    {
      id: "token-3",
      name: "Admin Token",
      permissions: ["read", "write", "delete"],
      created: "2023-09-05T09:15:00Z",
      expires: "2024-03-05T09:15:00Z",
    },
    {
      id: "token-4",
      name: "Backup Token",
      permissions: ["read", "write"],
      created: "2023-11-30T16:20:00Z",
      expires: "2023-12-30T16:20:00Z",
    },
  ];
};

// Store interface
interface StoreState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  // Buckets
  buckets: Bucket[];
  createBucket: (name: string) => Promise<Bucket>;
  deleteBucket: (id: string) => Promise<void>;

  // Files
  uploadFile: (bucketId: string, file: File) => Promise<File>;
  deleteFile: (bucketId: string, fileId: string) => Promise<void>;

  // Shared Links
  sharedLinks: SharedLink[];
  createSharedLink: (
    bucketId: string,
    fileId: string,
    expiresInDays: number
  ) => Promise<SharedLink>;
  deleteSharedLink: (id: string) => Promise<void>;

  // API Tokens
  apiTokens: ApiToken[];
  createApiToken: (
    name: string,
    permissions: ("read" | "write" | "delete")[],
    expiresInDays: number | null
  ) => Promise<ApiToken>;
  deleteApiToken: (id: string) => Promise<void>;

  // Activity Logs
  activityLogs: ActivityLog[];

  // Storage Stats
  getTotalStorageUsed: () => number;
  getTotalStorageLimit: () => number;
  getStoragePercentage: () => number;
}

// Create store with persistence
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Authentication
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // For demo purposes, any email/password combination works
        const user: User = {
          id: "user-1",
          name: email
            .split("@")[0]
            .split(".")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" "),
          email,
          avatar: undefined,
        };

        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      // Buckets
      buckets: mockBuckets,
      createBucket: async (name) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newBucket: Bucket = {
          id: `bucket-${Date.now()}`,
          name,
          created: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          files: [],
        };

        set((state) => ({
          buckets: [...state.buckets, newBucket],
          activityLogs: [
            {
              id: `log-${Date.now()}`,
              action: "create",
              description: `Created new bucket ${name}`,
              timestamp: new Date().toISOString(),
              user: state.user?.email || "unknown",
              bucketId: newBucket.id,
            },
            ...state.activityLogs,
          ],
        }));

        return newBucket;
      },
      deleteBucket: async (id) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const bucketToDelete = get().buckets.find((b) => b.id === id);

        set((state) => ({
          buckets: state.buckets.filter((b) => b.id !== id),
          activityLogs: [
            {
              id: `log-${Date.now()}`,
              action: "delete",
              description: `Deleted bucket ${bucketToDelete?.name || id}`,
              timestamp: new Date().toISOString(),
              user: state.user?.email || "unknown",
            },
            ...state.activityLogs,
          ],
        }));
      },

      // Files
      uploadFile: async (bucketId, file) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newFile: File = {
          id: `file-${Date.now()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: new Date().toISOString(),
          url: URL.createObjectURL(file as any),
        };

        set((state) => {
          const updatedBuckets = state.buckets.map((bucket) => {
            if (bucket.id === bucketId) {
              return {
                ...bucket,
                lastModified: new Date().toISOString(),
                files: [...bucket.files, newFile],
              };
            }
            return bucket;
          });

          return {
            buckets: updatedBuckets,
            activityLogs: [
              {
                id: `log-${Date.now()}`,
                action: "upload",
                description: `Uploaded ${file.name} to ${
                  state.buckets.find((b) => b.id === bucketId)?.name
                } bucket`,
                timestamp: new Date().toISOString(),
                user: state.user?.email || "unknown",
                bucketId,
                fileId: newFile.id,
              },
              ...state.activityLogs,
            ],
          };
        });

        return newFile;
      },
      deleteFile: async (bucketId, fileId) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        set((state) => {
          const bucket = state.buckets.find((b) => b.id === bucketId);
          const fileToDelete = bucket?.files.find((f) => f.id === fileId);

          const updatedBuckets = state.buckets.map((bucket) => {
            if (bucket.id === bucketId) {
              return {
                ...bucket,
                lastModified: new Date().toISOString(),
                files: bucket.files.filter((f) => f.id !== fileId),
              };
            }
            return bucket;
          });

          return {
            buckets: updatedBuckets,
            activityLogs: [
              {
                id: `log-${Date.now()}`,
                action: "delete",
                description: `Deleted ${fileToDelete?.name || fileId} from ${
                  bucket?.name || bucketId
                } bucket`,
                timestamp: new Date().toISOString(),
                user: state.user?.email || "unknown",
                bucketId,
              },
              ...state.activityLogs,
            ],
          };
        });
      },

      // Shared Links
      sharedLinks: generateMockSharedLinks(),
      createSharedLink: async (bucketId, fileId, expiresInDays) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const bucket = get().buckets.find((b) => b.id === bucketId);
        const file = bucket?.files.find((f) => f.id === fileId);

        const newLink: SharedLink = {
          id: `link-${Date.now()}`,
          fileId,
          bucketId,
          url: `https://share.betterflare.io/${bucketId}/${fileId}?token=${Date.now()}`,
          expires: expiresInDays
            ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
            : "",
          created: new Date().toISOString(),
          views: 0,
        };

        set((state) => ({
          sharedLinks: [...state.sharedLinks, newLink],
          activityLogs: [
            {
              id: `log-${Date.now()}`,
              action: "share",
              description: `Created shareable link for ${file?.name || fileId}`,
              timestamp: new Date().toISOString(),
              user: state.user?.email || "unknown",
              bucketId,
              fileId,
            },
            ...state.activityLogs,
          ],
        }));

        return newLink;
      },
      deleteSharedLink: async (id) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        set((state) => ({
          sharedLinks: state.sharedLinks.filter((link) => link.id !== id),
        }));
      },

      // API Tokens
      apiTokens: generateMockApiTokens(),
      createApiToken: async (name, permissions, expiresInDays) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newToken: ApiToken = {
          id: `token-${Date.now()}`,
          name,
          permissions,
          created: new Date().toISOString(),
          expires: expiresInDays
            ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
            : null,
        };

        set((state) => ({
          apiTokens: [...state.apiTokens, newToken],
        }));

        return newToken;
      },
      deleteApiToken: async (id) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        set((state) => ({
          apiTokens: state.apiTokens.filter((token) => token.id !== id),
        }));
      },

      // Activity Logs
      activityLogs: generateMockActivityLogs(),

      // Storage Stats
      getTotalStorageUsed: () => {
        return get().buckets.reduce((total, bucket) => {
          return (
            total +
            bucket.files.reduce(
              (bucketTotal, file) => bucketTotal + file.size,
              0
            )
          );
        }, 0);
      },
      getTotalStorageLimit: () => {
        // 250 GB in bytes
        return 250 * 1024 * 1024 * 1024;
      },
      getStoragePercentage: () => {
        const used = get().getTotalStorageUsed();
        const limit = get().getTotalStorageLimit();
        return Math.round((used / limit) * 100);
      },
    }),
    {
      name: "betterflare-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        buckets: state.buckets,
        sharedLinks: state.sharedLinks,
        apiTokens: state.apiTokens,
        activityLogs: state.activityLogs,
      }),
    }
  )
);

// Helper functions
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000; // seconds in a year

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000; // seconds in a month
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400; // seconds in a day
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600; // seconds in an hour
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60; // seconds in a minute
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

export const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type === "application/pdf") return "pdf";
  if (type === "application/zip" || type === "application/x-zip-compressed")
    return "archive";
  if (type === "text/plain") return "text";
  if (type === "application/json") return "code";
  return "file";
};
