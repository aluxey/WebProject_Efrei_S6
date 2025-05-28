<template>
  <GoogleLogin
    :client_id="clientId"
    :scope="'profile email'"
    @success="handleSuccess"
    @error="handleError"
  >
    <AsyncButton color="warn">
      <template #default>
        <span v-if="user">👋 {{ user.name }}</span>
        <span v-else>Se connecter avec Google</span>
      </template>
    </AsyncButton>
  </GoogleLogin>
</template>

<script setup>

</script>
