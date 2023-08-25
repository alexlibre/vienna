<template>
  <div class="components">
    <div class="components__header">
      <h1>Components</h1>
    </div>
    <ul class="components__menu">
      <li>
        <router-link class="components__item" to="/components/alert"
          >Alert</router-link
        >
      </li>
      <li>
        <router-link class="components__item" to="/components/button"
          >Button</router-link
        >
      </li>
      <li>
        <router-link class="components__item" to="/components/notification"
          >Notification</router-link
        >
      </li>
    </ul>
    <div class="components__content">
      <div class="component-description">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.components {
  display: grid;
  grid-template-areas: "header header" "menu content";
  grid-template-columns: 250px 1fr;

  &__header {
    grid-area: header;
  }
  &__menu {
    grid-area: menu;
    list-style: none;
    padding: 32px 0;
  }

  &__content {
    grid-area: content;
    padding: 32px 0;
  }
}
</style>
