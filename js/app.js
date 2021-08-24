ngrokUrl = "https://bot-node-app.firebaseapp.com/";

var routerApp = angular.module("webApp", ["ui.router"]);
routerApp.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("home");
  $stateProvider
    // HOME STATES AND NESTED VIEWS ========================================
    .state("home", {
      url: "/home",
      templateUrl: "./views/home.html",
      controller: "homeController",
    })
    .state("products", {
      url: "/products",
      templateUrl: "./views/products.html",
      controller: "productsController",
    })
    .state("product-detail", {
      url: "/product-detail",
      templateUrl: "./views/product-detail.html",
      controller: "productController",
    })
    .state("cart", {
      url: "/cart",
      templateUrl: "./views/cart.html",
      controller: "cartController",
    })
    .state("shipping", {
      url: "/shipping",
      templateUrl: "./views/shipping.html",
      controller: "shippingController",
    })
    .state("order-complete", {
      url: "/order-complete",
      templateUrl: "./views/order-complete.html",
      controller: "orderCompleteController",
    })
    .state("contact-us", {
      url: "/contact-us",
      templateUrl: "./views/contact-us.html",
      controller: "contactController",
    })
    .state("faq", {
      url: "/faq",
      templateUrl: "./views/faq.html",
      controller: "faqController",
    })
    .state("privacy", {
      url: "/privacy",
      templateUrl: "./views/privacy.html",
      controller: "privacyController",
    })
    .state("terms", {
      url: "/terms",
      templateUrl: "./views/terms.html",
      controller: "termsController",
    });
});

routerApp.controller("homeController", function ($scope, $state, $timeout) {});
routerApp.controller(
  "contactController",
  function ($scope, $state, $timeout) {}
);
routerApp.controller("faqController", function ($scope, $state, $timeout) {});
routerApp.controller(
  "privacyController",
  function ($scope, $state, $timeout) {}
);
routerApp.controller("termsController", function ($scope, $state, $timeout) {});
routerApp.controller(
  "productController",
  function ($scope, $state, $timeout) {}
);
routerApp.controller(
  "productsController",
  function ($scope, $state, $timeout) {}
);
routerApp.controller("cartController", function ($scope, $state, $timeout) {});
routerApp.controller(
  "orderCompleteController",
  function ($scope, $state, $timeout) {}
);
routerApp.controller(
  "shippingController",
  function ($scope, $state, $timeout) {}
);
