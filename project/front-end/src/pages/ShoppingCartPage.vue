<template>
  <h1>Shopping Cart</h1>
  <!-- v-if="" -->
  <div v-if="cartItems.length > 0">
    <ShoppingCartList :products="cartItems" />
    <button class="checkout-button">Proceed to Checkout</button>
  </div>
  <!-- v-else -->
  <div v-else>You currently have no items in your cart</div>
</template>
<script>
import ShoppingCartList from "@/components/ShoppingCartList.vue";
import { cartItems } from "@/temp-data";

export default {
  name: "ShoppingCartPage",
  components: {
    ShoppingCartList,
  },
  data() {
    return {
      cartItems,
    };
  },
};
</script>
