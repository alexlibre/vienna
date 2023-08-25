<script lang="ts" setup>
import vAlert from "@/components/ui/VAlert.vue";
</script>

<template>
  <h2>Alerts</h2>
  <p>
    The Alert component is used for inline notifications. Placed in the body of
    the page, the Alert does not disappear over time, only when the user
    performs actions aimed at solving the problem.
  </p>
  <p>
    To place temporary information about a global user error, use the
    Notification component.
  </p>
  <v-alert>Sample alert</v-alert>
  <h3>Success Alert</h3>
  <p>For positive notifications: task is saved etc.</p>
  <v-alert type="success">Success alert</v-alert>
  <h3>Error Alert</h3>
  <p>For form or page errors which can be fixed by user.</p>
  <v-alert type="error">Error alert</v-alert>
  <h3>Warning Alert</h3>
  <p>
    For notifications that often do not require a mandatory user response. For
    example, we warn that this parameter interferes with filling, but you can
    send an application with it
  </p>
  <v-alert type="warning">Warning alert</v-alert>
</template>
