# Conversation Service

`ConversationService` 负责 ChatLuna 会话、绑定、约束、ACL、归档和导出。

可以通过 `ctx.chatluna.conversation` 获取实例。

## 基础查询

### conversation.getConversation()

- **id**: `string`
- 返回值: `Promise<ConversationRecord | undefined>`

### conversation.getBinding()

- **bindingKey**: `string`
- 返回值: `Promise<BindingRecord | undefined>`

### conversation.getArchive()

- **id**: `string`
- 返回值: `Promise<ArchiveRecord | undefined>`

### conversation.getArchiveByConversationId()

- **conversationId**: `string`
- 返回值: `Promise<ArchiveRecord | undefined>`

### conversation.listConstraints()

- 返回值: `Promise<ConstraintRecord[]>`

## 解析和路由

### conversation.resolveConstraint()

- **session**: `Session`
- **options**: `ResolveConversationOptions | undefined`
- 返回值: `Promise<ResolvedConstraint>`

### conversation.resolveConversation()

- **session**: `Session`
- **options**: `ResolveConversationOptions | undefined`
- 返回值: `Promise<ConversationResolution>`

### conversation.ensureActiveConversation()

- **session**: `Session`
- **options**: `ResolveConversationOptions | undefined`
- 返回值: `Promise<ConversationRecord>`

确保返回当前生效会话，不存在时按规则创建。

## 会话生命周期

### conversation.createConversation()

- **session**: `Session`
- **options**: `ResolveConversationOptions | undefined`
- 返回值: `Promise<ConversationRecord>`

### conversation.setActiveConversation()

- **bindingKey**: `string`
- **conversationId**: `string`
- 返回值: `Promise<void>`

### conversation.touchConversation()

- **conversation**: `ConversationRecord`
- 返回值: `Promise<void>`

### conversation.claimAutoTitle()

- **conversationId**: `string`
- 返回值: `Promise<void>`

### conversation.listConversations()

- **session**: `Session`
- **options**: `ListConversationsOptions | undefined`
- 返回值: `Promise<ConversationListEntry[] | ConversationRecord[]>`

### conversation.listConversationEntries()

- **session**: `Session`
- **options**: `ListConversationsOptions | undefined`
- 返回值: `Promise<ConversationListEntry[] | ConversationRecord[]>`

### conversation.switchConversation()

- **session**: `Session`
- **targetConversation**: `string`
- **options**: `ResolveConversationOptions | undefined`
- 返回值: `Promise<ConversationRecord>`

### conversation.reopenConversation()

- **session**: `Session`
- **targetConversation**: `string`
- 返回值: `Promise<ConversationRecord>`

### conversation.renameConversation()

- **conversationId**: `string`
- **title**: `string`
- 返回值: `Promise<void>`

### conversation.deleteConversation()

- **conversationId**: `string`
- 返回值: `Promise<void>`

### conversation.updateConversationUsage()

- **conversationId**: `string`
- 返回值: `Promise<void>`

### conversation.recordCompression()

- **conversationId**: `string`
- **result**: `CompressContextResult`
- 返回值: `Promise<void>`

## 消息和 ACL

### conversation.listMessages()

- **conversationId**: `string`
- 返回值: `Promise<MessageRecord[]>`

### conversation.listAcl()

- **conversationId**: `string`
- 返回值: `Promise<ACLRecord[]>`

### conversation.upsertAcl()

- **conversationId**: `string`
- **record**: `ACLRecord`
- 返回值: `Promise<void>`

### conversation.replaceAcl()

- **conversationId**: `string`
- **records**: `ACLRecord[]`
- 返回值: `Promise<void>`

### conversation.removeAcl()

- **conversationId**: `string`
- 返回值: `Promise<void>`

## 归档和导出

### conversation.exportConversation()

- **conversationId**: `string`
- 返回值: `Promise<ConversationArchivePayload>`

### conversation.archiveConversation()

- **conversation**: `ConversationRecord`
- 返回值: `Promise<ArchiveRecord | undefined>`

### conversation.archiveConversationById()

- **conversationId**: `string`
- **archivedAt**: `Date | undefined`
- 返回值: `Promise<ArchiveRecord | undefined>`

### conversation.restoreConversation()

- **archiveId**: `string`
- 返回值: `Promise<ConversationRecord | undefined>`

### conversation.exportMarkdown()

- **conversation**: `ConversationRecord`
- 返回值: `Promise<string>`

## 管理约束

### conversation.getManagedConstraint()

- **session**: `Session`
- 返回值: `Promise<ConstraintRecord | undefined>`

### conversation.getManagedConstraintByBindingKey()

- **bindingKey**: `string`
- 返回值: `Promise<ConstraintRecord | undefined>`

### conversation.updateManagedConstraint()

- **session**: `Session`
- **options**: `ResolveConversationOptions | undefined`
- **changes**: `Partial<ConstraintRecord>`
- 返回值: `Promise<void>`

## 其他

### conversation.resolveConversationContext()

内部方法，文档上不建议直接依赖。
