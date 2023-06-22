<template>
  <div v-if="product">
    <div class="image-wrap">
      <img :src="product.imageUrl" alt="" />
    </div>
    <div class="product-details">
      <h1>{{ product.name }}</h1>
      <h3 class="price">{{ product.price }}</h3>
      <button @click="addToCart" class="add-to-cart" v-if="!itemIsInCart">
        Add to Cart
      </button>
      <button class="grey-button" v-else>Item is already in Cart</button>
      <button class="sign-in" @click="signIn">Sign in to ad to Cart</button>
    </div>
  </div>
  <div v-else>
    <NotFoundPage />
  </div>
</template>
<script>
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase";

import axios from "axios";
import NotFoundPage from "./NotFoundPage.vue";

export default {
  name: "ProductDetailPage",
  data() {
    return {
      product: {},
      cartItems: [],
    };
  },
  computed: {
    itemIsInCart() {
      return this.cartItems.some(
        (item) => item.id === this.$route.params.productId
      );
    },
  },
  methods: {
    async addToCart() {
      await axios.post("/api/users/12345/cart", {
        id: this.$route.params.productId,
      });
      alert("Succesfully added item to cart!");
    },

    async signIn() {
      const email = prompt("Please enter your email to sign in");
      const auth = getAuth();
      const actionCodeSettings = {
        url: `http://localhost:8080/products/${this.$route.params.product.productId}`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      alert("A login link was sent to your email");
      window.localStorage.setItem("emailForSignIn", email);
    },
  },
  components: { NotFoundPage },
  async created() {
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn");
      await signInWithEmailLink(auth, email, window.location.href);
      alert("Successfully signed in!");
      window.localStorage.removeItem("emailForSignIn");
    }

    const response = await axios.get(
      `/api/products/${this.$route.params.productId}`
    );
    const product = response.data;
    this.product = product;

    const cartResponse = await axios.get("/api/users/12345/cart");
    const cartItems = cartResponse.data;
    this.cartItems = cartItems;
  },
};
</script>
