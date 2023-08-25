<script lang="ts" setup>
import vNotification from "@/components/ui/VNotification.vue";
</script>

<template>
  <h2>Notifications</h2>
  <p>
    The Notification component is used for inline notifications. Placed in the
    body of the page, the Notification does not disappear over time, only when
    the user performs actions aimed at solving the problem.
  </p>
  <p>
    To place temporary information about a global user error, use the
    Notification component.
  </p>
  <v-notification text="Sample notification"></v-notification>
  <h3>Success Notification</h3>
  <p>For positive notifications: task is saved etc.</p>
  <v-notification text="Success notification" type="success"></v-notification>
  <h3>Error Notification</h3>
  <p>For form or page errors which can be fixed by user.</p>
  <v-notification text="Error notification" type="error"></v-notification>
  <h3>Warning Notification</h3>
  <p>
    For notifications that often do not require a mandatory user response. For
    example, we warn that this parameter interferes with filling, but you can
    send an application with it
  </p>
  <v-notification text="Warning notification" type="warning"></v-notification>
</template>
