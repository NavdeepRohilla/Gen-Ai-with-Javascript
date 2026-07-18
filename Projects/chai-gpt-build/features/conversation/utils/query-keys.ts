export const queryKeys = {
    conversations: {
        all: ["conversations"] as const,
        detail: (id: string) => ["conversation", id] as const,
    },

    messages: {
        byConversation: (conversationId: string) => 
            ["messages",conversationId] as const,
    },
};