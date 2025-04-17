<template>
    <div class="mention-input relative">
        <Textarea ref="textareaRef"
            v-model="text"
            class="min-h-[120px]"
            @input="handleInput"
            @keydown="handleKeyDown" />

        <Popover v-model:open="showCombobox">
            <PopoverAnchor :style="comboboxPosition" />
            <PopoverContent class="w-[300px] p-0"
                :style="comboboxPosition"
                @pointer-down-outside="closeCombobox">
                <Combobox @update:model-value="insertMention">
                    <ComboboxInput v-model="mentionQuery"
                        class="w-full"
                        placeholder="Search users..." />
                    <ComboboxList class="max-h-[200px] overflow-y-auto">
                        <ComboboxEmpty>No users found</ComboboxEmpty>
                        <ComboboxItem v-for="user in filteredUsers"
                            :key="user.id"
                            :value="user"
                            class="px-4 py-2 hover:bg-accent cursor-pointer">
                            {{ user.name }} {{ user.surname }}
                        </ComboboxItem>
                    </ComboboxList>
                </Combobox>
            </PopoverContent>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { Textarea } from '@/components/ui/textarea'

import {
    Combobox,
    ComboboxInput,
    ComboboxList,
    ComboboxItem,
    ComboboxEmpty
} from '@/components/ui/combobox'

import {
    Popover,
    PopoverAnchor,
    PopoverContent
} from '@/components/ui/popover'

interface User {
    id: number
    name: string
    surname: string
    username: string
}

const props = defineProps<{
    users: User[]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const text = ref('')
const showCombobox = ref(false)
const mentionQuery = ref('')
const mentionPosition = ref(0)
const selectedUserIds = ref<number[]>([])
const comboboxPosition = ref({ top: '0', left: '0' })

const filteredUsers = computed(() => {
    return props.users.filter(user =>
        `${user.name} ${user.surname}`
            .toLowerCase()
            .includes(mentionQuery.value.toLowerCase())
    )
})

watch(text, () => updateSelectedUserIds())

const handleInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement
    text.value = target.value
    checkForMention(target.selectionStart)
}

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Backspace') handleBackspace()
    if (e.key === '@') showCombobox.value = true
}

const checkForMention = (cursorPos: number) => {
    const textBeforeCursor = text.value.slice(0, cursorPos)
    const lastAtPos = textBeforeCursor.lastIndexOf('@')

    if (lastAtPos === -1 || /\s/.test(textBeforeCursor.slice(lastAtPos + 1))) {
        showCombobox.value = false
        return
    }

    mentionQuery.value = textBeforeCursor.slice(lastAtPos + 1)
    mentionPosition.value = lastAtPos
    updateComboboxPosition()
    showCombobox.value = true
}

const insertMention = (user: User) => {
    const mention = `@${user.username}`
    const newText =
        text.value.slice(0, mentionPosition.value) +
        mention +
        text.value.slice(mentionPosition.value + mentionQuery.value.length + 1)

    text.value = newText
    selectedUserIds.value = [...new Set([...selectedUserIds.value, user.id])]
    showCombobox.value = false

    nextTick(() => {
        const newCursorPos = mentionPosition.value + mention.length
        if (textareaRef.value) {
            textareaRef.value.selectionStart = newCursorPos
            textareaRef.value.selectionEnd = newCursorPos
        }
    })
}

const handleBackspace = () => {
    const cursorPos = textareaRef.value?.selectionStart || 0
    const textBeforeCursor = text.value.slice(0, cursorPos)
    const lastAtPos = textBeforeCursor.lastIndexOf('@')

    if (lastAtPos === -1) return

    const textAfterAt = text.value.slice(lastAtPos)
    const nextSpace = textAfterAt.indexOf(' ')
    const mentionEnd = nextSpace > -1 ? lastAtPos + nextSpace : text.value.length

    if (cursorPos > lastAtPos && cursorPos <= mentionEnd) {
        const mentionText = text.value.slice(lastAtPos, mentionEnd)
        const username = mentionText.substring(1)
        const user = props.users.find(u => u.username === username)

        if (user) {
            selectedUserIds.value = selectedUserIds.value.filter(id => id !== user.id)
        }

        text.value = text.value.slice(0, lastAtPos) + text.value.slice(mentionEnd)
        nextTick(() => {
            if (textareaRef.value) {
                textareaRef.value.selectionStart = lastAtPos
                textareaRef.value.selectionEnd = lastAtPos
            }
        })
    }
}

const updateSelectedUserIds = () => {
    const mentions = text.value.match(/@(\w+)/g) || []
    selectedUserIds.value = mentions
        .map(mention => {
            const username = mention.substring(1)
            const user = props.users.find(u => u.username === username)
            return user?.id
        })
        .filter(Boolean) as number[]
}

const updateComboboxPosition = () => {
    if (!textareaRef.value) return

    const textarea = textareaRef.value
    const { offsetTop, offsetLeft } = textarea
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20

    const linesBeforeCursor = (text.value.slice(0, mentionPosition.value).match(/\n/g) || []).length
    const topPosition = offsetTop + (linesBeforeCursor * lineHeight) + lineHeight

    comboboxPosition.value = {
        top: `${topPosition}px`,
        left: `${offsetLeft + 10}px`
    }
}

const closeCombobox = () => {
    showCombobox.value = false
}

defineExpose({
    selectedUserIds: computed(() => selectedUserIds.value)
})
</script>

<style scoped>
.mention-input :deep(.mention) {
    color: #3b82f6;
    font-weight: 500;
}
</style>