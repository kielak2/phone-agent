// Typed Convex models derived from schema
import { Doc } from "../../convex/_generated/dataModel"

export type ConversationModel = Doc<"conversation">
export type UserModel = Doc<"user">
export type PhoneNumberModel = Doc<"phoneNumber">

// Branded types for IDs to prevent mixing them up
export type ConversationId = ConversationModel["_id"]
export type UserId = UserModel["_id"]
export type PhoneNumberId = PhoneNumberModel["_id"]
