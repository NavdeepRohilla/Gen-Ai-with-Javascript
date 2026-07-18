"use server"

import { requireUser } from "@/features/auth/action/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ConversationListItems = {
    id: String;
    title: String;
    isPinned: Boolean; 
    isArchieved: Boolean; 
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

async function assertOwnConversation(ConversationId: string, userId: string) {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: ConversationId, 
            userId
        }
    })

    if (!conversation) {
        throw new Error("Conversation not found")
    }

    return conversation;
}

export async function listConversations(): Promise<ConversationListItems[]> {
    const User = await requireUser();

    return prisma.conversation.findMany({
        where: {userId: User.id, isArchieved: false}, 
        orderBy: [{lastMessage: "desc"}, {isPinned: "desc"}],
        select: {
            id: true,
            title: true,
            isPinned: true,
            isArchieved: true,
            lastMessageAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
        
export async function createConversation(title = "New Chat") {
    const user = await requireUser();

    return prisma.conversation.create({
        data: {
            userId: user.id,
            title: title.trim() || "New Chat"
        },
    });
}       

export async function updateConversation(
    conversationId: string,
    data: { title?: string; isPinned?: boolean; isArchived?: boolean }
) {
    const user = await requireUser();
    await assertOwnConversation(conversationId, user.id);

    const conversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
            ...(data.title !== undefined ? { title: data.title.trim() || "New Chat" } : {}),
            ...(data.isPinned !== undefined ? { isPinned: data.isPinned } : {}),
            ...(data.isArchived !== undefined ? { isArchived: data.isArchived } : {}),
        },
    });

    revalidatePath("/");
    revalidatePath(`/c/${conversationId}`);
    return conversation;
}


export async function deleteConversation(ConversationId: string) {
    const user = await requireUser();
    await assertOwnConversation(ConversationId, user.id);

    await prisma.conversation.delete({
        where: { id: ConversationId },
    });

    revalidatePath("/");
    return{ id: ConversationId };
}


