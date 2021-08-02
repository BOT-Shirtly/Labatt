ngrokUrl = "https://bot-node-app.firebaseapp.com/";

var routerApp = angular.module("webApp", ["ui.router"]);
routerApp.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("main");
  $stateProvider
    // HOME STATES AND NESTED VIEWS ========================================

    .state("main", {
      url: "/main",
      templateUrl: "./views/main.html",
      controller: "mainController",
    })
    .state("return", {
      url: "/return",
      templateUrl: "./views/return.html",
      controller: "returnController",
    })
    .state("privacy", {
      url: "/privacy",
      templateUrl: "./views/privacy.html",
      controller: "privacyController",
    })
    .state("apparel", {
      url: "/apparel",
      templateUrl: "./views/apparel.html",
      controller: "apparelController",
    })
    .state("shipping", {
      url: "/shipping",
      templateUrl: "./views/shipping.html",
      controller: "shippingController",
    })
    .state("faq", {
      url: "/faq",
      templateUrl: "./views/faq.html",
      controller: "faqController",
    })
    .state("rewardFaq", {
      url: "/rewardFaq",
      templateUrl: "./views/rewardFaq.html",
      controller: "rewardFaqController",
    });
});

routerApp.controller("mainController", function ($scope, $state, $timeout) {
  var scroll_pos = 0;
  $("html, body").animate(
    {
      scrollTop: scroll_pos,
    },
    "2000"
  );
  if (
    localStorage.getItem("__SickKidsShopUser__") == undefined ||
    localStorage.getItem("__SickKidsShopUser__") == null ||
    localStorage.getItem("__SickKidsShopUser__") == ""
  ) {
    $("#majorTeamEmail span").text("Login to view your Team Email.");
    $("#currUserRewardPin").html("");
    $("#sickKidsLogin").modal("show");
    $("#currUser").fadeOut().find("span").text("Loading..");
    $("#currUser1").fadeOut().find("span").text("Loading..");
  } else {
    $("#skSiteLoading").modal({
      backdrop: "static",
    });
    $("#currUser").fadeIn();
    var currUser = localStorage.getItem("__SickKidsShopUser__");
    $.ajax({
      url: ngrokUrl + "getSKRewardUserDataInfo",
      type: "POST",
      data: JSON.stringify({ currentUser: currUser }),
      contentType: "application/json",
      success: function (getSKRewardUserData) {
        if (getSKRewardUserData == "No User") {
          $("#majorTeamEmail span").text("Login to view your Team Email.");
          $("#currUserRewardPin").html("");
          $("#sickKidsLogin").modal("show");
          localStorage.removeItem("__SickKidsShopUser__");
          $("#currUser").fadeOut().find("span").text("Loading..");
          $("#currUser1").fadeOut().find("span").text("Loading..");
          $("#skSiteLoading").modal("hide");
        } else {
          $("#majorTeamEmail span").text(getSKRewardUserData.memail);
          $("#currUser").fadeIn().find("span").text(getSKRewardUserData.name);
          $("#currUser1").fadeIn().find("span").text(getSKRewardUserData.name);
          if ($("#currUserRewardPin").html().trim() == "") {
            var html =
              '<option value="" selected>Select Your Gift Card</option>';
            html +=
              '<option value="' +
              getSKRewardUserData.code +
              '">' +
              getSKRewardUserData.code +
              "</option>";
            $("#currUserRewardPin").append(html);
          }
          $("#personName").val(
            getSKRewardUserData.name.split(",")[0] +
              " " +
              getSKRewardUserData.lastName
          );
          $("#address1").val(getSKRewardUserData.shipInfo.address1);
          $("#city").val(getSKRewardUserData.shipInfo.city);
          $("#zip").val(getSKRewardUserData.shipInfo.zip);
          $("#email").val(localStorage.getItem("__SickKidsShopUser__"));
          $("#skSiteLoading").modal("hide");
        }
      },
    });
  }
  $.ajax({
    url: ngrokUrl + "shopUserData",
    type: "POST",
    data: JSON.stringify({ currentUser: "SickKids" }),
    contentType: "application/json",
    success: function (data) {
      $("#productList").html("");
      for (var i = 0; i < data[2].prodList.length; i++) {
        var html =
          '<div class="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center" style="cursor: pointer;margin-bottom:20px;" data-toggle="modal" data-target="#productInfo" prodId="' +
          data[2].prodList[i].prodId +
          '" id="' +
          data[2].prodList[i].prodId +
          '" onclick="openThisProdInfo(this)"><a style="display:inline-block;">';
        html +=
          '<img src="' +
          data[2].prodList[i].images[0].src +
          '" class="front" style="width:70%;margin-bottom:0px;">';
        if (data[2].prodList[i].images[1] != undefined) {
          html +=
            '<img src="' +
            data[2].prodList[i].images[1].src +
            '" class="back" style="width:100%;margin-bottom:0px;display:none;">';
        }
        html +=
          '<p style="margin-bottom:8px;font-size: 14px;">' +
          data[2].prodList[i].prodTittle +
          "</p>";
        html +=
          '<p style="margin:0px;color: #a1a1a1;font-family:Montserrat Regular,sans-serif;">CAD $' +
          data[2].prodList[i].prodPrice +
          "</p>";
        html += "</a></div>";
        $("#productList").append(html);
      }
    },
  });
  $scope.addThisProdtoCart = function () {
    var price = $("#thisProdPrice span").text();
    var prodColor = $("#thisProdColor .selected").attr("value");
    var prodSize = $("#thisProdSize").val();
    var prodQty = $("#thisProdQty").val();
    var prodName = $("#thisProdName").text();
    var prodSku = $("#thisProdSku span").text();
    var prodImage = $("#thisProdImg").attr("src");
    var prodArtImage = $("#thisProdArtImg").attr("src");
    var prodBackArtImage = $("#thisProdBackArtImg").attr("src");
    var prodType = $("#thisProdType span").text();
    if ($("#shoppingCartProds div").hasClass("noProdInCart")) {
      $("#shoppingCartProds").html("");
    }
    if (
      prodQty == "" ||
      prodQty == "e" ||
      prodQty == null ||
      prodQty == undefined
    ) {
      $("#errorMsg").modal("show").find("p").text("Please enter Quantity !!");
    } else {
      if (localStorage.getItem("__SickKidsShopUser__") == undefined) {
        $("#productInfo").modal("hide");
        $("#sickKidsLogin").modal("show");
      } else {
        $("#addToCartBtn")
          .html(
            '<div class="spinner-border" role="status" style="width:15px;height:15px;"><span class="sr-only">Loading...</span></div>'
          )
          .prop("disabled", true);
        var currUser = localStorage.getItem("__SickKidsShopUser__");
        $("#addToCartBtn").html("Add to cart").prop("disabled", false);

        if ($("#shoppingCartProds .col-12").length > 0) {
          $("#shoppingCartProds .col-12").each(function (index) {
            if (
              prodName == $(this).find(".thisCartProdName").text() &&
              prodSize == $(this).find(".thisCartProdSize span").text()
            ) {
              $("#errorMsg")
                .modal("show")
                .find("p")
                .text(
                  "Product is already in Cart. Please update the Quantity !!"
                );
              $("#productInfo").modal("hide");
              $("#shoppingCart").modal("show");
              return false;
            } else {
              if (index == $("#shoppingCartProds .col-12").length - 1) {
                var html =
                  '<div class="col-12" style="border: 1px solid #ccc;margin-bottom: 20px;padding-bottom: 10px;">';
                html += '<div class="row">';
                html +=
                  '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2 text-center">';
                html += '        <p class="prodHeading">Image</p>';
                html +=
                  '        <img class="thisCartProdImage" src="' +
                  prodImage +
                  '" style="width:100%;">';
                html +=
                  '        <img class="thisCartProdArtImage" src="' +
                  prodArtImage +
                  '" style="width:100%;display:none;">';
                html +=
                  '        <img class="thisCartProdBackArtImage" src="' +
                  prodBackArtImage +
                  '" style="width:100%;display:none;">';
                html += "    </div>";
                html +=
                  '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-4 text-lleft">';
                html += '        <p class="prodHeading">Information</p>';
                html +=
                  '        <div style="line-height: 16px;"><p class="thisCartProdName" style="margin: 0px;font-size: 16px;">' +
                  prodName +
                  "</p>";
                html +=
                  '        <p class="thisCartProdSku" style="margin: 0px;font-size: 12px;">SKU:<span>' +
                  prodSku +
                  "</span></p>";
                html +=
                  '        <p class="thisCartProdType" style="margin: 0px;font-size: 12px;">Type:<span>' +
                  prodType +
                  "</span></p>";
                html +=
                  '        <p class="thisCartProdColor" style="margin: 0px;font-size: 12px;">Color:<span>' +
                  prodColor +
                  "</span></p>";
                html +=
                  '        <p class="thisCartProdSize" style="margin: 0px;font-size: 12px;">Size:<span>' +
                  prodSize +
                  "</span></p></div>";
                html += "    </div>";
                html +=
                  '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2 text-center">';
                html += '        <p class="prodHeading">Price</p>';
                html +=
                  '        <p class="thisCartProdPrice">$<span>' +
                  price +
                  "</span></p>";
                html += "    </div>";
                html +=
                  '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-1 text-center">';
                html += '        <p class="prodHeading">Quantity</p>';
                html +=
                  '        <input type="number" class="thisCartProdQty" style="width: 100%;margin-bottom: 10px;" value="' +
                  prodQty +
                  '" onchange="changeProdPrice(this)" min="1">';
                html += "    </div>";
                html +=
                  '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2 text-center">';
                html += '        <p class="prodHeading">Total</p>';
                var totalPrice = parseFloat(price) * parseFloat(prodQty);
                html +=
                  '        <p class="thisCartProdTotal">$<span>' +
                  totalPrice.toFixed(2) +
                  "</span></p>";
                html += "    </div>";
                html +=
                  '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-1 text-center">';
                html += '        <p class="prodHeading">Delete</p>';
                html +=
                  '        <button class="btn btn-block" style="padding: 5px 0px;background-color:#00ACD7 !important;color: #fff;" onclick="deleteThisProdFromCart(this)"><i class="far fa-trash-alt"></i></button>';
                html += "    </div>";
                html += "</div>";
                html += "</div>";
                $("#shoppingCartProds").append(html);
                $("#productInfo").modal("hide");
                $(".cartLength").text($("#shoppingCartProds .col-12").length);
                $("#shoppingCart").modal("show");
                calculateTotalProdPrice();
              }
            }
          });
        } else {
          var html =
            '<div class="col-12" style="border: 1px solid #ccc;margin-bottom: 20px;padding-bottom: 10px;">';
          html += '<div class="row">';
          html +=
            '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2 text-center">';
          html += '        <p class="prodHeading">Image</p>';
          html +=
            '        <img class="thisCartProdImage" src="' +
            prodImage +
            '" style="width:100%;">';
          html +=
            '        <img class="thisCartProdArtImage" src="' +
            prodArtImage +
            '" style="width:100%;display:none;">';
          html +=
            '        <img class="thisCartProdBackArtImage" src="' +
            prodBackArtImage +
            '" style="width:100%;display:none;">';
          html += "    </div>";
          html +=
            '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-4 text-lleft">';
          html += '        <p class="prodHeading">Information</p>';
          html +=
            '        <div style="line-height: 16px;"><p class="thisCartProdName" style="margin: 0px;font-size: 16px;">' +
            prodName +
            "</p>";
          html +=
            '        <p class="thisCartProdSku" style="margin: 0px;font-size: 12px;">SKU:<span>' +
            prodSku +
            "</span></p>";
          html +=
            '        <p class="thisCartProdType" style="margin: 0px;font-size: 12px;">Type:<span>' +
            prodType +
            "</span></p>";
          html +=
            '        <p class="thisCartProdColor" style="margin: 0px;font-size: 12px;">Color:<span>' +
            prodColor +
            "</span></p>";
          html +=
            '        <p class="thisCartProdSize" style="margin: 0px;font-size: 12px;">Size:<span>' +
            prodSize +
            "</span></p></div>";
          html += "    </div>";
          html +=
            '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2 text-center">';
          html += '        <p class="prodHeading">Price</p>';
          html +=
            '        <p class="thisCartProdPrice">$<span>' +
            price +
            "</span></p>";
          html += "    </div>";
          html +=
            '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-1 text-center">';
          html += '        <p class="prodHeading">Quantity</p>';
          html +=
            '        <input type="number" class="thisCartProdQty" style="width: 100%;margin-bottom: 10px;" value="' +
            prodQty +
            '" onchange="changeProdPrice(this)" min="1">';
          html += "    </div>";
          html +=
            '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2 text-center">';
          html += '        <p class="prodHeading">Total</p>';
          var totalPrice = parseFloat(price) * parseFloat(prodQty);
          html +=
            '        <p class="thisCartProdTotal">$<span>' +
            totalPrice.toFixed(2) +
            "</span></p>";
          html += "    </div>";
          html +=
            '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-1 text-center">';
          html += '        <p class="prodHeading">Delete</p>';
          html +=
            '        <button class="btn btn-block" style="padding: 5px 0px;background-color:#00ACD7 !important;color: #fff;" onclick="deleteThisProdFromCart(this)"><i class="far fa-trash-alt"></i></button>';
          html += "    </div>";
          html += "</div>";
          html += "</div>";
          $("#shoppingCartProds").append(html);
          $("#productInfo").modal("hide");
          $(".cartLength").text($("#shoppingCartProds .col-12").length);
          $("#shoppingCart").modal("show");
          calculateTotalProdPrice();
        }
      }
    }
  };
});
routerApp.controller("returnController", function ($scope, $state, $timeout) {
  var scroll_pos = 0;
  $("html, body").animate(
    {
      scrollTop: scroll_pos,
    },
    "2000"
  );
});
routerApp.controller("privacyController", function ($scope, $state, $timeout) {
  var scroll_pos = 0;
  $("html, body").animate(
    {
      scrollTop: scroll_pos,
    },
    "2000"
  );
});
routerApp.controller("shippingController", function ($scope, $state, $timeout) {
  var scroll_pos = 0;
  $("html, body").animate(
    {
      scrollTop: scroll_pos,
    },
    "2000"
  );
});
routerApp.controller("faqController", function ($scope, $state, $timeout) {
  var scroll_pos = 0;
  $("html, body").animate(
    {
      scrollTop: scroll_pos,
    },
    "2000"
  );
});
routerApp.controller(
  "rewardFaqController",
  function ($scope, $state, $timeout) {
    var scroll_pos = 0;
    $("html, body").animate(
      {
        scrollTop: scroll_pos,
      },
      "2000"
    );
  }
);
routerApp.controller("apparelController", function ($scope, $state, $timeout) {
  var scroll_pos = 0;
  $("html, body").animate(
    {
      scrollTop: scroll_pos,
    },
    "2000"
  );

  $.ajax({
    url: ngrokUrl + "shopUserData",
    type: "POST",
    data: JSON.stringify({ currentUser: "SickKids" }),
    contentType: "application/json",
    success: function (data) {
      $("#apparelProductList").html("");

      for (var i = 0; i < data[0].prodList.length; i++) {
        var html =
          '<div class="col-sm-12 col-md-4 col-lg-3 col-xl-3 text-center" style="cursor: pointer;margin-bottom:10px;" data-toggle="modal" data-target="#productInfo" prodId="' +
          data[0].prodList[i].prodId +
          '" id="' +
          data[0].prodList[i].prodId +
          '" onclick="openThisProdInfo(this)">';
        html +=
          '<img src="' +
          data[0].prodList[i].images[0].src +
          '" class="front" style="width:100%;">';
        html +=
          '<img src="' +
          data[0].prodList[i].images[1].src +
          '" class="back" style="width:100%;display:none;">';

        html +=
          '<p style="margin-bottom:8px;margin-top:20px;font-size: 14px;">' +
          data[0].prodList[i].prodTittle +
          "</p>";
        html +=
          '<div style="display:inline-block;width:100%;" class="colorDiv"></div>';

        html +=
          '<p style="margin:0px;color: #a1a1a1;font-family: Montserrat Regular,sans-serif;">CAD $' +
          data[0].prodList[i].prodPrice +
          "</p>";
        html += "</div>";
        $("#apparelProductList").append(html);
        $("#apparelProductList .text-center").mouseover(function () {
          $(this).find(".front").hide();
          $(this).find(".back").show();
        });
        $("#apparelProductList .text-center").mouseout(function () {
          $(this).find(".back").hide();
          $(this).find(".front").show();
        });

        if (i == data[0].prodList.length - 1) {
          setTimeout(function () {
            $("#apparelProductList .colorDiv").html("");
            for (var i = 0; i < data[0].prodList.length; i++) {
              for (
                var k = 0;
                k < data[0].prodList[i].options[0].values.length;
                k++
              ) {
                $("#apparelProductList .col-sm-12").each(function () {
                  if ($(this).attr("prodid") == data[0].prodList[i].prodId) {
                    $(this)
                      .find(".colorDiv")
                      .append(
                        '<div data-placement="bottom" data-toggle="tooltip" title="' +
                          data[0].prodList[i].options[0].values[k].split(
                            "-"
                          )[0] +
                          '" class="colorBox z-depth-1" style="margin: 2px;display: inline-block;width:20px;height:20px;background-color:' +
                          data[0].prodList[i].options[0].values[k].split(
                            "-"
                          )[1] +
                          '"></div>'
                      );
                  }
                });
              }
              $(function () {
                $('[data-toggle="tooltip"]').tooltip();
              });
            }
          }, 1000);
        }
      }
    },
  });

  $scope.addThisProdtoCart = function () {
    var price = $("#thisProdPrice span").text();
    var prodColor = $("#thisProdColor .selected").attr("value");
    var prodSize = $("#thisProdSize").val();
    var prodQty = $("#thisProdQty").val();
    var prodName = $("#thisProdName").text();
    var prodSku = $("#thisProdSku span").text();
    var prodImage = $("#thisProdImg").attr("src");
    var prodArtImage = $("#thisProdArtImg").attr("src");
    var prodBackArtImage = $("#thisProdBackArtImg").attr("src");
    var prodType = $("#thisProdType span").text();
    if ($("#shoppingCartProds div").hasClass("noProdInCart")) {
      $("#shoppingCartProds").html("");
    }
    if (
      prodQty == "" ||
      prodQty == "e" ||
      prodQty == null ||
      prodQty == undefined
    ) {
      $("#errorMsg").modal("show").find("p").text("Please enter Quantity !!");
    } else {
      var html =
        '<div class="col-12" style="border: 1px solid #ccc;margin-bottom: 20px;padding-bottom: 10px;">';
      html += '<div class="row">';
      html +=
        '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2 text-center">';
      html += '        <p class="prodHeading">Image</p>';
      html +=
        '        <img class="thisCartProdImage" src="' +
        prodImage +
        '" style="width:100%;">';
      html +=
        '        <img class="thisCartProdArtImage" src="' +
        prodArtImage +
        '" style="width:100%;display:none;">';
      html +=
        '        <img class="thisCartProdBackArtImage" src="' +
        prodBackArtImage +
        '" style="width:100%;display:none;">';
      html += "    </div>";
      html +=
        '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-4 text-lleft">';
      html += '        <p class="prodHeading">Information</p>';
      html +=
        '        <div style="line-height: 16px;"><p class="thisCartProdName" style="margin: 0px;font-size: 16px;">' +
        prodName +
        "</p>";
      html +=
        '        <p class="thisCartProdSku" style="margin: 0px;font-size: 12px;">SKU:<span>' +
        prodSku +
        "</span></p>";
      html +=
        '        <p class="thisCartProdType" style="margin: 0px;font-size: 12px;">Type:<span>' +
        prodType +
        "</span></p>";
      html +=
        '        <p class="thisCartProdColor" style="margin: 0px;font-size: 12px;">Color:<span>' +
        prodColor +
        "</span></p>";
      html +=
        '        <p class="thisCartProdSize" style="margin: 0px;font-size: 12px;">Size:<span>' +
        prodSize +
        "</span></p></div>";
      html += "    </div>";
      html +=
        '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2 text-center">';
      html += '        <p class="prodHeading">Price</p>';
      html +=
        '        <p class="thisCartProdPrice">$<span>' + price + "</span></p>";
      html += "    </div>";
      html +=
        '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-1 text-center">';
      html += '        <p class="prodHeading">Qunatity</p>';
      html +=
        '        <input type="number" class="thisCartProdQty" style="width: 100%;margin-bottom: 10px;" value="' +
        prodQty +
        '" onchange="changeProdPrice(this)" min="1">';
      html += "    </div>";
      html +=
        '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2 text-center">';
      html += '        <p class="prodHeading">Total</p>';
      var totalPrice = parseFloat(price) * parseFloat(prodQty);
      html +=
        '        <p class="thisCartProdTotal">$<span>' +
        totalPrice.toFixed(2) +
        "</span></p>";
      html += "    </div>";
      html +=
        '    <div class="col-sm-12 col-md-12 col-lg-2 col-xl-1 text-center">';
      html += '        <p class="prodHeading">Delete</p>';
      html +=
        '        <button class="btn btn-block" style="padding: 5px 0px;background-color:#00ACD7 !important;color: #fff;" onclick="deleteThisProdFromCart(this)"><i class="far fa-trash-alt"></i></button>';
      html += "    </div>";
      html += "</div>";
      html += "</div>";
      $("#shoppingCartProds").append(html);
      $("#successMsg")
        .modal("show")
        .find("p")
        .text("Product Successfully added to Cart !!");
      $("#productInfo").modal("hide");
      $(".cartLength").text($("#shoppingCartProds .col-12").length);
      $("#shoppingCart").modal("show");
      calculateTotalProdPrice();
    }
  };
});

function logOut() {
  localStorage.removeItem("__SickKidsShopUser__");
  location.reload();
}

function rewardCustomerSignIn(e) {
  var username = $("#skUsername").val();
  var password = $("#skPassword").val();
  if (
    username == "" ||
    username == undefined ||
    username == null ||
    password == "" ||
    password == undefined ||
    password == null
  ) {
    $("#errorMsg")
      .modal("show")
      .find("p")
      .text("Email or Password is invalid !!");
  } else {
    $(e)
      .html(
        '<div class="spinner-border" role="status" style="width:15px;height:15px;"><span class="sr-only">Loading...</span></div>'
      )
      .prop("disabled", true);
    $.ajax({
      url: ngrokUrl + "getSKRewardUserData",
      type: "POST",
      data: JSON.stringify({
        currentUser: username,
        currentPassword: password,
      }),
      contentType: "application/json",
      success: function (getSKRewardUserData) {
        $("#majorTeamEmail span").text("Login to view your Team Email.");
        $("#currUserRewardPin").html("");
        $("#userCodeElligibleProd").fadeOut();
        $("#currUserRewardPin").val("");
        $("#shoppingCartProds").html("");
        $(".cartLength").text($("#shoppingCartProds .col-12").length);

        if (getSKRewardUserData == "Bad Authorization") {
          $("#majorTeamEmail span").text("Login to view your Team Email.");
          $("#errorMsg")
            .modal("show")
            .find("p")
            .text("Email or Password is invalid !!");
          $(e).html("SIGN IN").prop("disabled", false);
          localStorage.removeItem("__SickKidsShopUser__");
          $("#currUser").fadeOut().find("span").text("Loading..");
          $("#currUser1").fadeOut().find("span").text("Loading..");
        } else {
          $("#majorTeamEmail span").text(getSKRewardUserData.memail);
          $("#sickKidsLogin").modal("hide");
          $(e).html("SIGN IN").prop("disabled", false);
          localStorage.setItem(
            "__SickKidsShopUser__",
            getSKRewardUserData.email
          );
          $("#currUser").fadeIn().find("span").text(getSKRewardUserData.name);
          $("#currUser1").fadeIn().find("span").text(getSKRewardUserData.name);
          var html = '<option value="" selected>Select Your Gift Card</option>';
          html +=
            '<option value="' +
            getSKRewardUserData.code +
            '">' +
            getSKRewardUserData.code +
            "</option>";
          $("#currUserRewardPin").append(html);

          $("#personName").val(
            getSKRewardUserData.name.split(",")[0] +
              " " +
              getSKRewardUserData.lastName
          );
          $("#address1").val(getSKRewardUserData.shipInfo.address1);
          $("#city").val(getSKRewardUserData.shipInfo.city);
          $("#zip").val(getSKRewardUserData.shipInfo.zip);
          $("#email").val(localStorage.getItem("__SickKidsShopUser__"));
        }
      },
    });
  }
}

function checkEnteredRewarCred() {
  $("#cartLoading").fadeIn();
  $("#skSiteLoading").modal({
    backdrop: "static",
  });
  var code = $("#currUserRewardPin").val();
  var currUser = localStorage.getItem("__SickKidsShopUser__");
  if (code != "") {
    $.ajax({
      url: ngrokUrl + "getSKRewardUserDataInfo",
      type: "POST",
      data: JSON.stringify({ currentUser: currUser }),
      contentType: "application/json",
      success: function (getSKRewardUserData) {
        $("#cartLoading").fadeOut();
        $("#skSiteLoading").modal("hide");
        if (getSKRewardUserData.codeStatus == "Active") {
          $("#alreadyUsedReward").fadeOut();
          $("#userCodeElligibleProd")
            .fadeIn()
            .find("span")
            .text(getSKRewardUserData.rewardProd.join("\r\n"));
          $(".currUserRewardAmnt span").text(getSKRewardUserData.amount);
          if (
            getSKRewardUserData.amount >=
            parseInt($(".allCartProdTotal span").text())
          ) {
            $("#enoughRewardAmnt").fadeOut();
            $("#checkOutBtn").prop("disabled", false);
          } else {
            $("#enoughRewardAmnt").fadeIn();
            $("#checkOutBtn").prop("disabled", true);
            //$("#userCodeElligibleProd").fadeIn().find("span").text(getSKRewardUserData.rewardProd.join())
          }

          // HATS
          var hatArr = [];
          $("#shoppingCartProds .col-12").each(function () {
            if ($(this).find(".thisCartProdType span").text() == "Hat") {
              hatArr.push(parseInt($(this).find(".thisCartProdQty").val()));
            }
          });
          var totalhatsInCart = hatArr.reduce(function (a, b) {
            return a + b;
          }, 0);

          // Adult Hoodie
          var hoodieArr = [];
          $("#shoppingCartProds .col-12").each(function () {
            if (
              $(this).find(".thisCartProdType span").text() == "Adult_Hoodie" ||
              $(this).find(".thisCartProdType span").text() == "Youth_Hoodie"
            ) {
              hoodieArr.push(parseInt($(this).find(".thisCartProdQty").val()));
            }
          });
          var totalHoodiesInCart = hoodieArr.reduce(function (a, b) {
            return a + b;
          }, 0);

          // Youth T-Shirt
          var tshirtArr = [];
          $("#shoppingCartProds .col-12").each(function () {
            if (
              $(this).find(".thisCartProdType span").text() == "Youth_Tshirt" ||
              $(this).find(".thisCartProdType span").text() == "Adult_Tshirt"
            ) {
              tshirtArr.push(parseInt($(this).find(".thisCartProdQty").val()));
            }
          });
          var totalTshirtsInCart = tshirtArr.reduce(function (a, b) {
            return a + b;
          }, 0);

          $("#shoppingCartProds .col-12").each(function () {
            currCartProdLine = $(this);
            thisProdType = $(this).find(".thisCartProdType span").text();
            if (thisProdType == "Hat") {
              for (var i = 0; i < getSKRewardUserData.rewardProd.length; i++) {
                if (getSKRewardUserData.rewardProd[i].split(" ")[1] == "Hat") {
                  var allowedHats =
                    getSKRewardUserData.rewardProd[i].split(" ")[0];
                  if (totalhatsInCart > allowedHats) {
                    $(this).addClass("errorProd");
                    $("#checkOutBtn").prop("disabled", true);
                  } else {
                    $(this).removeClass("errorProd");
                  }
                  break;
                } else {
                  if (i == getSKRewardUserData.rewardProd.length - 1) {
                    if (
                      getSKRewardUserData.rewardProd[i].split(" ")[1] == "Hat"
                    ) {
                      var allowedToques =
                        getSKRewardUserData.rewardProd[i].split(" ")[0];
                      if (totalhatsInCart > allowedHats) {
                        $(this).addClass("errorProd");
                        $("#checkOutBtn").prop("disabled", true);
                      } else {
                        $(this).removeClass("errorProd");
                      }
                      break;
                    } else {
                      $(this).addClass("errorProd");
                      $("#checkOutBtn").prop("disabled", true);
                      break;
                    }
                  }
                }
              }
            } else if (thisProdType == "Adult_Tshirt") {
              for (var i = 0; i < getSKRewardUserData.rewardProd.length; i++) {
                if (
                  getSKRewardUserData.rewardProd[i].split(" ")[1] == "Tshirt"
                ) {
                  var allowedTshirts =
                    getSKRewardUserData.rewardProd[i].split(" ")[0];
                  if (totalTshirtsInCart > allowedTshirts) {
                    $(this).addClass("errorProd");
                    $("#checkOutBtn").prop("disabled", true);
                  } else {
                    $(this).removeClass("errorProd");
                  }
                  break;
                } else {
                  if (i == getSKRewardUserData.rewardProd.length - 1) {
                    if (
                      getSKRewardUserData.rewardProd[i].split(" ")[1] ==
                      "Tshirt"
                    ) {
                      var allowedTshirts =
                        getSKRewardUserData.rewardProd[i].split(" ")[0];
                      if (totalTshirtsInCart > allowedTshirts) {
                        $(this).addClass("errorProd");
                        $("#checkOutBtn").prop("disabled", true);
                      } else {
                        $(this).removeClass("errorProd");
                      }
                      break;
                    } else {
                      $(this).addClass("errorProd");
                      $("#checkOutBtn").prop("disabled", true);
                      break;
                    }
                  }
                }
              }
            } else if (thisProdType == "Youth_Tshirt") {
              for (var i = 0; i < getSKRewardUserData.rewardProd.length; i++) {
                if (
                  getSKRewardUserData.rewardProd[i].split(" ")[1] == "Tshirt"
                ) {
                  var allowedTshirts =
                    getSKRewardUserData.rewardProd[i].split(" ")[0];
                  if (totalTshirtsInCart > allowedTshirts) {
                    $(this).addClass("errorProd");
                    $("#checkOutBtn").prop("disabled", true);
                  } else {
                    $(this).removeClass("errorProd");
                  }
                  break;
                } else {
                  if (i == getSKRewardUserData.rewardProd.length - 1) {
                    if (
                      getSKRewardUserData.rewardProd[i].split(" ")[1] ==
                      "Tshirt"
                    ) {
                      var allowedTshirts =
                        getSKRewardUserData.rewardProd[i].split(" ")[0];
                      if (totalTshirtsInCart > allowedTshirts) {
                        $(this).addClass("errorProd");
                        $("#checkOutBtn").prop("disabled", true);
                      } else {
                        $(this).removeClass("errorProd");
                      }
                      break;
                    } else {
                      $(this).addClass("errorProd");
                      $("#checkOutBtn").prop("disabled", true);
                      break;
                    }
                  }
                }
              }
            } else if (thisProdType == "Adult_Hoodie") {
              for (var i = 0; i < getSKRewardUserData.rewardProd.length; i++) {
                if (
                  getSKRewardUserData.rewardProd[i].split(" ")[1] == "Hoodie"
                ) {
                  var allowedHoodies =
                    getSKRewardUserData.rewardProd[i].split(" ")[0];
                  if (totalHoodiesInCart > allowedHoodies) {
                    $(this).addClass("errorProd");
                    $("#checkOutBtn").prop("disabled", true);
                  } else {
                    $(this).removeClass("errorProd");
                  }
                  break;
                } else {
                  if (i == getSKRewardUserData.rewardProd.length - 1) {
                    if (
                      getSKRewardUserData.rewardProd[i].split(" ")[1] ==
                      "Hoodie"
                    ) {
                      var allowedHoodies =
                        getSKRewardUserData.rewardProd[i].split(" ")[0];
                      if (totalHoodiesInCart > allowedHoodies) {
                        $(this).addClass("errorProd");
                        $("#checkOutBtn").prop("disabled", true);
                      } else {
                        $(this).removeClass("errorProd");
                      }
                      break;
                    } else {
                      $(this).addClass("errorProd");
                      $("#checkOutBtn").prop("disabled", true);
                      break;
                    }
                  }
                }
              }
            } else if (thisProdType == "Youth_Hoodie") {
              for (var i = 0; i < getSKRewardUserData.rewardProd.length; i++) {
                if (
                  getSKRewardUserData.rewardProd[i].split(" ")[1] == "Hoodie"
                ) {
                  var allowedHoodies =
                    getSKRewardUserData.rewardProd[i].split(" ")[0];
                  if (totalHoodiesInCart > allowedHoodies) {
                    $(this).addClass("errorProd");
                    $("#checkOutBtn").prop("disabled", true);
                  } else {
                    $(this).removeClass("errorProd");
                  }
                  break;
                } else {
                  if (i == getSKRewardUserData.rewardProd.length - 1) {
                    if (
                      getSKRewardUserData.rewardProd[i].split(" ")[1] ==
                      "Hoodie"
                    ) {
                      var allowedHoodies =
                        getSKRewardUserData.rewardProd[i].split(" ")[0];
                      if (totalHoodiesInCart > allowedHoodies) {
                        $(this).addClass("errorProd");
                        $("#checkOutBtn").prop("disabled", true);
                      } else {
                        $(this).removeClass("errorProd");
                      }
                      break;
                    } else {
                      $(this).addClass("errorProd");
                      $("#checkOutBtn").prop("disabled", true);
                      break;
                    }
                  }
                }
              }
            }
          });
        } else {
          $("#alreadyUsedReward").fadeIn();
        }
      },
    });
  } else {
    $("#cartLoading").fadeOut();
    $("#skSiteLoading").modal("hide");
    $("#shoppingCartProds .col-12").each(function () {
      $(this).removeClass("errorProd");
    });
    $("#userCodeElligibleProd").fadeOut();
    $("#enoughRewardAmnt").fadeOut();
    $(".currUserRewardAmnt  span").text(0);
  }
}

function addPoolRewardInput() {
  var inputLength = $("#poolRewardCodesInput input").length;
  var html =
    '<div class="input' + inputLength + '" style="position: relative;">';
  html +=
    '<input type="text"  class="form-control" placeholder="Pool Reward Code" style="margin-bottom: 10px;padding: 6px 70px 6px 12px;width:90%;" id="poolReward' +
    inputLength +
    '">';
  html +=
    '<button onclick="applyPoolCode(this)" class="btn btn-primary" style="background-color: #00ACD7 !important;position: absolute;margin: 0;right: 10%;top:0;padding: 0px 10px;height: 38px;">Apply</button>';
  html +=
    '<i class="fas fa-times-circle" style="color: #9e9d9d;position: absolute;margin:auto;right: 0px;top:0;padding: 0px 4px;height: 18px;bottom:0px;cursor: pointer;"></i>';
  html += "</div>";
  $("#poolRewardCodesInput").append(html);
}

function applyPoolCode(e) {
  var ownGiftCard = $("#currUserRewardPin").val();
  if (ownGiftCard != "") {
    var enteredPoolCode = $(e).parent().find("input").val();
    if (
      enteredPoolCode != "" ||
      enteredPoolCode != undefined ||
      enteredPoolCode != null
    ) {
      var currUser = localStorage.getItem("__SickKidsShopUser__");
      var teamEmail = $("#majorTeamEmail span").text();

      var reaminingTeamCodes = [];

      $.ajax({
        url: ngrokUrl + "getTeamInformation",
        type: "POST",
        data: JSON.stringify({ currUser: currUser, teamEmail: teamEmail }),
        contentType: "application/json",
        success: function (getTeamInformation) {
          for (var i = 0; i < getTeamInformation.length; i++) {
            if (
              getTeamInformation[i].code != ownGiftCard &&
              getTeamInformation[i].codeStatus == "Active"
            ) {
              reaminingTeamCodes.push(getTeamInformation[i]);
            }
          }
          for (var o = 0; o < reaminingTeamCodes.length; o++) {
            if (reaminingTeamCodes[o].code == enteredPoolCode) {
              break;
            } else {
              if (o == reaminingTeamCodes.length - 1) {
                if (reaminingTeamCodes[o].code == enteredPoolCode) {
                  break;
                } else {
                  $("#errorMsg")
                    .modal("show")
                    .find("p")
                    .text("Invalid Pool Reward Code !!");
                }
              }
            }
          }
          console.log(reaminingTeamCodes);
        },
      });
    } else {
      $("#errorMsg")
        .modal("show")
        .find("p")
        .text("Invalid Pool Reward Code !!");
    }
  } else {
    $("#errorMsg")
      .modal("show")
      .find("p")
      .text("Please select your Gift Card first !!");
  }
}

function openThisProdInfo(e) {
  $("#thisProdImg").attr("src", "https://belwooddoors.com/img/spinner.gif");
  $("#prodInfoLoading").fadeIn();
  $("#addToCartBtn").prop("disabled", true);
  $("#thisProdColor").html("");
  $("#thisProdColor").append(
    '<div class="preloader-wrapper big active" style="display:block;margin:0px auto;"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div> </div><div class="circle-clipper right"><div class="circle"></div></div></div></div>'
  );
  $("#thisProdDesc").html("");
  $("#thisProdSize").html("");
  $("#differentSides").html("");
  setTimeout(function () {
    var prodId = $(e).attr("prodId");
    $.ajax({
      url: ngrokUrl + "shopUserData",
      type: "POST",
      data: JSON.stringify({ currentUser: "SickKids" }),
      contentType: "application/json",
      success: function (data) {
        for (var i = 0; i < data[2].prodList.length; i++) {
          if (data[2].prodList[i].prodId == prodId) {
            $("#prodInfoLoading").fadeOut();
            $("#addToCartBtn").prop("disabled", false);

            $("#thisProdImg").attr("src", data[2].prodList[i].images[0].src);
            $("#thisProdArtImg").attr(
              "src",
              data[2].prodList[i].artworkSrc[0].artWorkImgUrl
            );

            if (data[2].prodList[i].artworkBackSrc != undefined) {
              $("#thisProdBackArtImg").attr(
                "src",
                data[2].prodList[i].artworkBackSrc[0].artWorkImgUrl
              );
            }

            if (data[2].prodList[i].images.length > 1) {
              for (var l = 0; l < data[2].prodList[i].images.length; l++) {
                if (l == 0) {
                  var html =
                    '<div class="col-3 selectedBox" style="padding: 0px;border: 1px solid #ccc;cursor:pointer;margin-right: 5px;" onclick="showThisImage(this)">';
                } else {
                  var html =
                    '<div class="col-3" style="padding: 0px;border: 1px solid #ccc;cursor:pointer;margin-right: 5px;" onclick="showThisImage(this)">';
                }
                html +=
                  '<img src="' +
                  data[2].prodList[i].images[l].src +
                  '" style="width:100%;">';
                html += "</div>";
                $("#differentSides").append(html);
              }
            }

            $("#thisProdName").text(data[2].prodList[i].prodTittle);
            $("#thisProdId").text(data[2].prodList[i].prodId);
            $("#thisProdDesc").append(data[2].prodList[i].prodDescription);
            $("#thisProdSku span").text(data[2].prodList[i].prodSku);

            $("#thisProdPrice span").text(data[2].prodList[i].prodPrice);
            $("#thisProdType span").text(data[2].prodList[i].prodCat);
            $("#thisProdColor").html("");
            for (
              var j = 0;
              j < data[2].prodList[i].options[0].values.length;
              j++
            ) {
              if (j == 0) {
                var html =
                  '<div class="selected colorBox" value="' +
                  data[2].prodList[i].options[0].values[j].split("-")[0] +
                  '" onclick="getVariantInfo(this)"><i style="color:' +
                  data[2].prodList[i].options[0].values[j].split("-")[1] +
                  ';margin-right:5px;" class="fas fa-stop z-depth-1"></i>' +
                  data[2].prodList[i].options[0].values[j].split("-")[0] +
                  "</div>";
              } else {
                var html =
                  '<div class="colorBox" value="' +
                  data[2].prodList[i].options[0].values[j].split("-")[0] +
                  '" onclick="getVariantInfo(this)"><i style="color:' +
                  data[2].prodList[i].options[0].values[j].split("-")[1] +
                  ';margin-right:5px;" class="fas fa-stop z-depth-1"></i>' +
                  data[2].prodList[i].options[0].values[j].split("-")[0] +
                  "</div>";
              }
              $("#thisProdColor").append(html);
            }
            for (
              var j = 0;
              j < data[2].prodList[i].options[1].values.length;
              j++
            ) {
              var html =
                '<option value="' +
                data[2].prodList[i].options[1].values[j] +
                '">' +
                data[2].prodList[i].options[1].values[j] +
                "</option>";

              $("#thisProdSize").append(html);
            }
          }
        }
      },
    });
  }, 1000);
}

function showThisImage(e) {
  var clickedIndex = $(e).index();
  $("#thisProdImg").attr("src", $(e).find("img").attr("src"));
  $("#differentSides .col-3").each(function () {
    if ($(this).index() == clickedIndex) {
      $(this).addClass("selectedBox");
    } else {
      $(this).removeClass("selectedBox");
    }
  });
}

function openSizeChart(e) {
  var sku = $(e)
    .parent()
    .parent()
    .parent()
    .parent()
    .find("#thisProdSku span")
    .text();

  $("#thisProdSizeChart").attr("src", "img/" + sku + ".png");
}

/*function getVariantInfo(e) {
  var currentColor = $(e).attr("value");
    
    $("#thisProdColor .colorBox").each(function () {
        if ($(this).attr("value") == currentColor) {
            if($(this).hasClass("selected")){}
            else{
               $(this).addClass("selected") 
            }
        }else{
           if($(this).hasClass("selected")){
               $(this).removeClass("selected")
           } 
        }
    })
    
    $("#thisProdImg").attr("src","https://belwooddoors.com/img/spinner.gif")
    
    $("#addToCartBtn").prop("disabled",true)
    $("#sizeLoading").fadeIn();
    var prodId = $(e).parent().parent().find("#thisProdId").text();
   var color = $(e).attr("value");
   var size = $("#thisProdSize").val();
    
   $.ajax({
        url: ngrokUrl + "shopUserData"
        , type: "POST"
        , data: JSON.stringify({currentUser: "SickKids"})
        , contentType: "application/json"
        , success: function (data) {
            for(var i = 0 ; i < data[0].prodList.length ; i++){
                if(data[0].prodList[i].prodId == prodId){
                    for(var k = 0 ; k < data[0].prodList[i].variants.length ; k++){
                        if(color == data[0].prodList[i].variants[k].option1 && size == data[0].prodList[i].variants[k].option2){
                            var img = data[0].prodList[i].variants[k].imgSrc;
                            var price = data[0].prodList[i].variants[k].price;
                            
                            var frontArtSrc = data[0].prodList[i].variants[k].artworkSrc[0].artWorkImgUrl;
                            $("#thisProdArtImg").attr("src",frontArtSrc)
                            if(data[0].prodList[i].variants[k].artworkBackSrc != undefined){
                                var backArtSrc = data[0].prodList[i].variants[k].artworkBackSrc[0].artWorkImgUrl;
                                $("#thisProdBackArtImg").attr("src",backArtSrc)
                            }
                            
                            if(img.length > 1){
                                $("#thisProdImg").attr("src",img[0])
                                $("#differentSides").html("");
                                for(var l = 0 ; l < img.length ; l++){
                                    if(l == 0){
                                        var html = '<div class="col-3 selectedBox" style="padding: 0px;border: 1px solid #ccc;cursor:pointer;margin-right: 5px;" onclick="showThisImage(this)">';  
                                    }else{

                                        var html = '<div class="col-3" style="padding: 0px;border: 1px solid #ccc;cursor:pointer;margin-right: 5px;" onclick="showThisImage(this)">';
                                    }
                                        html += '<img src="' + img[l] + '" style="width:100%;">';
                                        html += '</div>';
                                    $("#differentSides").append(html);
                                }
                            }else{
                                $("#thisProdImg").attr("src",img[0])
                            }
                            
                            
                            
                            
                            $("#thisProdPrice span").text(price)
                            $("#thisProdSize").html("");
                            $.ajax({
                                url: ngrokUrl + "shopUserData"
                                , type: "POST"
                                , data: JSON.stringify({currentUser: "SickKids"})
                                , contentType: "application/json"
                                , success: function (data) {
                                    for(var i = 0 ; i < data[0].prodList.length ; i++){
                                        if(data[0].prodList[i].prodId == prodId){
                                            $("#sizeLoading").fadeOut();
                                            for(var j = 0 ; j < data[0].prodList[i].variants.length ; j++){
                                                if(color == data[0].prodList[i].variants[j].option1){
                                                    var html = '<option value="'+data[0].prodList[i].variants[j].option2+'">'+data[0].prodList[i].variants[j].option2+'</option>';
                                                    
                                                    $("#thisProdSize").append(html);
                                                    $("#addToCartBtn").prop("disabled",false)

                                                }
                                            }
                                        }

                                    }
                                }
                            });
                        }
                    }
                }
                
            }
        }
    });
}*/

function calculateTotalProdPrice() {
  $("#currUserRewardPin").val("");
  $("#userCodeElligibleProd").fadeOut();
  $("#enoughRewardAmnt").fadeOut();
  $("#checkOutBtn").prop("disabled", true);

  $(".currUserRewardAmnt span").text("0");
  $(".allCartProdTotalDiscount span").text(0);
  $("#discountCode").val("");
  var qtyArr = [];
  $("#shoppingCartProds .col-12").each(function () {
    qtyArr.push(parseFloat($(this).find(".thisCartProdQty").val()));
  });
  if (isNaN(qtyArr[0])) {
    qtyArr[0] = 0;
  }
  var totalQty = qtyArr.reduce(function (a, b) {
    return a + b;
  }, 0);
  $(".allCartProdTotalQty span").text(totalQty);

  var priceArr = [];
  $("#shoppingCartProds .col-12").each(function () {
    priceArr.push(parseFloat($(this).find(".thisCartProdTotal span").text()));
  });
  if (isNaN(priceArr[0])) {
    priceArr[0] = 0.0;
  }
  var totalPrice = priceArr.reduce(function (a, b) {
    return a + b;
  }, 0);
  $(".allCartProdTotal span").text(totalPrice.toFixed(2));

  if (totalPrice == 0) {
    $("#userCodeElligibleProd").fadeOut();
    $("#currUserRewardPin").val("");
    $("#shoppingCartProds").html("");
    var html =
      '<div class="noProdInCart" style="border: 1px solid #ccc;background-color:#ccc;width: 100%;">';
    html +=
      '<p class="text-center" style="margin-top:16px;">No Product Added Yet !!</p>';
    html += "</div>";
    $("#shoppingCartProds").append(html);
  } else {
    $("#shoppingCartProds .noProdInCart").remove();
    if (totalPrice >= 100) {
      $("#couponBtn").prop("disabled", false);
    } else {
      $("#couponBtn").prop("disabled", true);
    }
  }
}

function changeProdPrice(e) {
  var newQty = $(e).val();
  if (newQty == "") {
    $(e).val(1);
    var prodPrice = parseFloat(
      $(e).parent().parent().find(".thisCartProdPrice span").text()
    );
    var newPrice = prodPrice * 1;
    $(e)
      .parent()
      .parent()
      .find(".thisCartProdTotal span")
      .text(newPrice.toFixed(2));
    calculateTotalProdPrice();
  } else {
    var prodPrice = parseFloat(
      $(e).parent().parent().find(".thisCartProdPrice span").text()
    );
    var newPrice = prodPrice * newQty;
    $(e)
      .parent()
      .parent()
      .find(".thisCartProdTotal span")
      .text(newPrice.toFixed(2));
    calculateTotalProdPrice();
  }
}

function deleteThisProdFromCart(e) {
  $(e).parent().parent().parent().remove();
  calculateTotalProdPrice();
  $(".cartLength").text($("#shoppingCartProds .col-12").length);
}

function checkOutModal() {
  var allCartTotal = $(".allCartProdTotal span").text();
  if ($("#shoppingCartProds .col-12").length == 0) {
    $("#errorMsg")
      .modal("show")
      .find("p")
      .text("There is no product in Cart !!");
  } else {
    $("#checkOutModal").modal("show");

    setTimeout(function () {
      $("#skCheckOutItemsDetails").html("");
      $("#shoppingCartProds .col-12").each(function () {
        var image = $(this).find(".thisCartProdImage").attr("src");
        var prodName = $(this).find(".thisCartProdName").text();
        var prodSku = $(this).find(".thisCartProdSku span").text();
        var prodColor = $(this).find(".thisCartProdColor span").text();
        var prodSize = $(this).find(".thisCartProdSize span").text();
        var html = '<div class="row" style="padding: 0 15px">';
        html +=
          '<div class="col-sm-12 col-md-12 col-lg-6 col-xl-6 text-center">';
        html += '<p class="prodHeading">Image</p>';
        html +=
          '<img class="thisCartProdImage" src="' +
          image +
          '" style="width: 100%"/>';
        html += "</div>";
        html += '<div class="col-sm-12 col-md-12 col-lg-6 col-xl-6 text-left">';
        html += '<p class="prodHeading">Information</p>';
        html += '<div style="line-height: 16px">';
        html +=
          '<p class="thisCartProdName" style="margin: 0px; font-size: 12px">' +
          prodName;
        html += "</p>";
        html +=
          '<p class="thisCartProdSku" style="margin: 0px; font-size: 10px">';
        html += "SKU:<span>" + prodSku + "</span>";
        html += "</p>";
        html +=
          '<p class="thisCartProdColor" style="margin: 0px; font-size: 10px">';
        html += "Color:<span>" + prodColor + "</span>";
        html += "</p>";
        html +=
          '<p class="thisCartProdSize" style="margin: 0px; font-size: 10px">';
        html += "Size:<span>" + prodSize + "</span>";
        html += "</p>";
        html += "</div>";
        html += "</div>";
        html += "</div>";
        $("#skCheckOutItemsDetails").append(html);
      });
    }, 1000);

    for (var i = 0; i < countryData.length; i++) {
      var html =
        '<option value="' +
        countryData[i].code2 +
        '">' +
        countryData[i].name +
        "</option>";
      $("#checkOutModal #country").append(html);
      if (i == countryData.length - 1) {
        setTimeout(function () {
          var currUser = localStorage.getItem("__SickKidsShopUser__");
          $.ajax({
            url: ngrokUrl + "getSKRewardUserDataInfo",
            type: "POST",
            data: JSON.stringify({ currentUser: currUser }),
            contentType: "application/json",
            success: function (getSKRewardUserData) {
              $("#personName").val(
                getSKRewardUserData.name.split(",")[0] +
                  " " +
                  getSKRewardUserData.lastName
              );
              $("#address1").val(getSKRewardUserData.shipInfo.address1);
              $("#city").val(getSKRewardUserData.shipInfo.city);
              $("#zip").val(getSKRewardUserData.shipInfo.zip);
              $("#email").val(localStorage.getItem("__SickKidsShopUser__"));
              $("#checkOutModal #country").val(
                getSKRewardUserData.shipInfo.country
              );
              getStates();
            },
          });
        }, 800);
      }
    }
  }
}

function getStates() {
  $("#checkOutModal #state").html("");
  var country = $("#checkOutModal #country").val();
  setTimeout(function () {
    for (var i = 0; i < countryData.length; i++) {
      if (countryData[i].code2 == country) {
        for (var j = 0; j < countryData[i].states.length; j++) {
          var html =
            '<option value="' +
            countryData[i].states[j].code +
            '">' +
            countryData[i].states[j].name +
            "</option>";
          $("#checkOutModal #state").append(html);
          if (j == countryData[i].states.length - 1) {
            var currUser = localStorage.getItem("__SickKidsShopUser__");
            $.ajax({
              url: ngrokUrl + "getSKRewardUserDataInfo",
              type: "POST",
              data: JSON.stringify({ currentUser: currUser }),
              contentType: "application/json",
              success: function (getSKRewardUserData) {
                $("#checkOutModal #state").val(
                  getSKRewardUserData.shipInfo.state
                );
              },
            });
          }
        }
      }
    }
    //generateTaxPrices();
  }, 500);

  var totalProducts = $("#shoppingCart .allCartProdTotalQty span").text();
  var productAmount = $("#shoppingCart .allCartProdTotal span").text();
  var rewardAmnt = $("#shoppingCart .currUserRewardAmnt span").text();
  $("#checkOutModal checkoutquantity").text(totalProducts);
  $("#checkOutModal checkoutprodamnt").text(productAmount);
  $("#checkOutModal rewardAmnt").text("-" + rewardAmnt);
  /*var finalShippingPrice = parseInt(totalProducts - 1);
    
    if(country == "CA"){
        var finalNewShippingPrice = parseFloat(finalShippingPrice * 2.00);
        var shippingPrice = 8.95 + finalNewShippingPrice;
    }else if(country == "US"){
        var finalNewShippingPrice = parseFloat(finalShippingPrice * 2.00);
        var shippingPrice = 7.55 + finalNewShippingPrice;
    }else{
        var finalNewShippingPrice = parseFloat(finalShippingPrice * 2.95);
        var shippingPrice = 21.95 + finalNewShippingPrice;
    }
    
    $("checkoutShipping").text(shippingPrice.toFixed(2))*/
}

function generateTaxPrices() {
  var amountToBePaid = parseFloat($("#checkOutModal checkoutprodamnt").text());
  var shippingToBePaid = parseFloat(
    $("#checkOutModal checkoutshipping").text()
  );

  var amountBeforeTax = amountToBePaid + shippingToBePaid;

  if (
    $("#checkOutModal #country").val() == "CA" ||
    $("#checkOutModal #country").val() == "Canada"
  ) {
    var state = $("#checkOutModal #state").val();
    if (state == "Alberta" || state == "AB") {
      var taxPercent = 5;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "British Columbia" || state == "BC") {
      var taxPercent = 12;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "Manitoba" || state == "MB") {
      var taxPercent = 13;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "New Brunswick" || state == "NB") {
      var taxPercent = 15;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "Newfoundland and Labrador" || state == "NL") {
      var taxPercent = 15;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "Nova Scotia" || state == "NS") {
      var taxPercent = 15;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "Ontario" || state == "ON") {
      var taxPercent = 13;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "Prince Edward Island" || state == "PE") {
      var taxPercent = 15;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "Quebec" || state == "QC") {
      var taxPercent = 14.9;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "Saskatchewan" || state == "SK") {
      var taxPercent = 11;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "Northwest Territories" || state == "NT") {
      var taxPercent = 5;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "Nunavut" || state == "NU") {
      var taxPercent = 5;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    } else if (state == "Yukon" || state == "YT") {
      var taxPercent = 5;
      var taxAmount = (taxPercent * amountBeforeTax) / 100;
      $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
    }
  } else {
    var taxPercent = 0;
    var taxAmount = (taxPercent * amountBeforeTax) / 100;
    $("#checkOutModal checkouttax").text(taxAmount.toFixed(2));
  }

  var finalAmountToBePaid = parseFloat(amountBeforeTax) + parseFloat(taxAmount);

  //$("#checkOutModal checkoutfinal").text(finalAmountToBePaid.toFixed(2));
  $("#checkOutModal checkoutfinal").text("0.00");
}

function generateToken() {
  var firstName = $("#checkOutModal #personName").val();
  var address1 = $("#checkOutModal #address1").val();
  var address2 = $("#checkOutModal #address2").val();
  var city = $("#checkOutModal #city").val();
  var state = $("#checkOutModal #state").val();
  var zip = $("#checkOutModal #zip").val();
  var country = $("#checkOutModal #country").val();
  var email = validateEmail($("#checkOutModal #email").val());
  if (firstName == undefined || firstName == null || firstName == "") {
    $("#errorMsg").modal("show").find(".modal-body p").text("Invalid Name !!");
  } else if (address1 == undefined || address1 == null || address1 == "") {
    $("#errorMsg")
      .modal("show")
      .find(".modal-body p")
      .text("Invalid Address !!");
  } else if (city == undefined || city == null || city == "") {
    $("#errorMsg").modal("show").find(".modal-body p").text("Invalid City !!");
  } else if (zip == undefined || zip == null || zip == "") {
    $("#errorMsg").modal("show").find(".modal-body p").text("Invalid Zip !!");
  } else if (zip.length > 6) {
    $("#errorMsg")
      .modal("show")
      .find(".modal-body p")
      .text(
        "Zip/Postal Code is in wrong pattern, please remove space or any special character !!"
      );
  } else if (country == undefined || country == null || country == "") {
    $("#errorMsg")
      .modal("show")
      .find(".modal-body p")
      .text("Invalid Country !!");
  } else if (email == false) {
    $("#errorMsg").modal("show").find(".modal-body p").text("Invalid Email !!");
  } else {
    $("#generateToken")
      .html(
        'Processing Payment... <i class="fa fa-refresh fa-spin" style="font-size:16px;margin-right:5px;"></i>'
      )
      .prop("disabled", true);
    sendtoLynx($("#currUserRewardPin").val(), "Reward", "Reward Code");
    /*if(Stripe.card.validateCardNumber($('#paymentCardNumber1').val())){
                if(Stripe.card.validateExpiry($('#paymentCardMonth1').val(), $('#paymentCardYear1').val())){
                    if(Stripe.card.validateCVC($('#paymentCardCvv1').val())){
                        Stripe.card.createToken({
                          number: $('#paymentCardNumber1').val(),
                          cvc: $('#paymentCardCvv1').val(),
                          exp_month: $('#paymentCardMonth1').val(),
                          exp_year: $('#paymentCardYear1').val()
                        }, stripeResponseHandler1);
                    }else{
                        $("#errorMsg").modal("show").find(".modal-body p").text("Invalid Card CVV!!");
                        $("#generateToken").html('Submit').prop("disabled", false);
                    }
                }else{
                    $("#errorMsg").modal("show").find(".modal-body p").text("Invalid Card Expiry Date!!");
                    $("#generateToken").html('Submit').prop("disabled", false);
                }
            }else{
                $("#errorMsg").modal("show").find(".modal-body p").text("Invalid Card Number!!");
                $("#generateToken").html('Submit').prop("disabled", false);
            }*/
  }
}

function stripeResponseHandler1(status, response) {
  // Grab the form:
  var $form = $("#payment-form1");

  if (response.error) {
    // Problem!
    $("#generateToken").text("Submit Order").prop("disabled", false);
    $("#errorMsg")
      .modal("show")
      .find(".modal-body p")
      .text("Error while processing Payment!!");
  } else {
    // Get the token ID:
    $("#generateToken")
      .html(
        'Transfering Funds... <i class="fa fa-refresh fa-spin" style="font-size:16px;margin-right:5px;"></i>'
      )
      .prop("disabled", true);
    var token = response.id;
    $.ajax({
      url: ngrokUrl + "websitestripeCharge",
      type: "POST",
      data: JSON.stringify({
        currentUser: $("#email").val() + " (SickKids GetLoud Shop)",
        token: token,
        currency: "CAD",
        amount: parseFloat($("#checkOutModal checkoutfinal").text()) * 100,
      }),
      contentType: "application/json",
      success: function (paymentData) {
        if (paymentData.status == "succeeded") {
          $("#generateToken")
            .html(
              'Transfer Success... <i class="fa fa-refresh fa-spin" style="font-size:16px;margin-right:5px;"></i>'
            )
            .prop("disabled", true);
          sendtoLynx(
            paymentData.id,
            paymentData.source.brand,
            paymentData.source.funding
          );
        } else {
          $("#generateToken").html("Submit Order").prop("disabled", false);
          $("#errorMsg")
            .modal("show")
            .find(".modal-body p")
            .text("Problem in Payment Processing, Try again later !!");
        }
      },
    });
  }
}

function sendtoLynx(transactionId, cardType, paymentMethod) {
  $("#loadingSymbol").fadeIn();
  $("#orderCart").modal("hide");
  var firstName = $("#checkOutModal #personName").val();
  var address1 = $("#checkOutModal #address1").val();
  var address2 = $("#checkOutModal #address2").val();
  var city = $("#checkOutModal #city").val();
  var state = $("#checkOutModal #state").val();
  if (state == null) {
    var state = "";
  }
  var zip = $("#checkOutModal #zip").val();
  var country = $("#checkOutModal #country").val();
  var email = $("#checkOutModal #email").val();

  var priority = "Normal";
  var mailType = "Standard_Shipping";
  var printType = "DTG";

  $("#generateToken")
    .html(
      'Generating Order Sequence... <i class="fa fa-refresh fa-spin" style="font-size:16px;margin-right:5px;"></i>'
    )
    .prop("disabled", true);

  setTimeout(function () {
    var itemsArr = [];
    var totalItems = $("#shoppingCartProds .col-12").length * 4000;

    $("#shoppingCartProds .col-12").each(function (index) {
      var data = {
        SKU:
          $(this).find(".thisCartProdSku span").text() +
          "-" +
          $(this).find(".thisCartProdColor span").text() +
          "-" +
          $(this).find(".thisCartProdSize span").text(),
        Descrip: "Order from Sick Kids Store",
        Color: $(this).find(".thisCartProdColor span").text(),
        Qty: $(this).find(".thisCartProdQty").val(),
        Size: $(this).find(".thisCartProdSize span").text(),
        Type: "DTG",
        Style: $(this).find(".thisCartProdType span").text(),
        ProcessMode: "Piece",
        Design: [
          {
            Location: "Front",
            Thumb: $(this).find(".thisCartProdImage").attr("src"),
            SourceFile: $(this).find(".thisCartProdArtImage").attr("src"),
          },
        ],
      };
      itemsArr.push(data);
    });

    $("#generateToken")
      .html(
        'Activating Machines... <i class="fa fa-refresh fa-spin" style="font-size:16px;margin-right:5px;"></i>'
      )
      .prop("disabled", true);

    setTimeout(function () {
      var objToday = new Date(),
        weekday = new Array(
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ),
        dayOfWeek = weekday[objToday.getDay()],
        domEnder = (function () {
          var a = objToday;
          if (/1/.test(parseInt((a + "").charAt(0)))) return "th";
          a = parseInt((a + "").charAt(1));
          return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th";
        })(),
        dayOfMonth =
          today + (objToday.getDate() < 10)
            ? "0" + objToday.getDate() + domEnder
            : objToday.getDate() + domEnder,
        months = new Array(
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ),
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear();
      var today = curMonth + " " + dayOfMonth + ", " + curYear;

      var x = Math.floor(Math.random() * 10000000 + 1);
      PONumber = "BOT-GetLoud2021-" + x;
      json = {
        AddXml: {
          OrderString: {
            Request: {
              CustID: "1",
              PO: PONumber,
              OrderDate: today,
              Source: "Admin",
              Store: "SickKids GetLoud Shop",
              StoreID: "1",
              ShipTo: {
                FirstName: firstName,
                LastName: "",
                Company: "",
                Adrx1: address1,
                Adrx2: address2,
                City: city,
                State: state,
                Zip: zip,
                Country: country,
                Email: email,
              },
              ShipFrom: {
                FirstName: "Big Oven Tees",
                LastName: "",
                Company: "Big Oven Tees",
                Adrx1: "122 Middleton St.",
                Adrx2: "",
                City: "Brantford",
                State: "ON",
                Zip: "N3S7V7",
                Country: "CA",
                Email: "info@bigoventees.com",
              },
              ShipMethod: "Standard_Shipping",
              ProductionPriority: "Normal",
              Notes: "",
              Item: itemsArr,
            },
          },
        },
      };

      //var xmlString = objectToXml(json);
      var xml = json2xml(json).split("id>")[0];
      var new1 = xml;
      var finalString = new1;
      String.prototype.insert = function (index, string) {
        if (index > 0)
          return (
            this.substring(0, index) +
            string +
            this.substring(index, this.length)
          );
        return string + this;
      };
      var newString = finalString.insert(7, ' xmlns="http://tempuri.org/"');

      $.ajax({
        url: ngrokUrl + "submitOrderToMachine",
        type: "POST",
        data: JSON.stringify({
          orderData: newString,
        }),
        contentType: "application/json",
        success: function (submitOrderToMachineData) {
          $.ajax({
            url: ngrokUrl + "getSKRewardUserDataInfo",
            type: "POST",
            data: JSON.stringify({
              currentUser: localStorage.getItem("__SickKidsShopUser__"),
            }),
            contentType: "application/json",
            success: function (checkSKUser) {
              var userKey = checkSKUser._id;
              var thisUserOrders = checkSKUser.orders;
              thisUserOrders.push({
                orderNumber: PONumber,
                orderDate: today,
                paymentCode: transactionId,
                cardType: cardType,
                paymentMethod: paymentMethod,
                shippingInfo: "notSent",
              });
              $.ajax({
                url: ngrokUrl + "updateSickKidsRewardCustomerOrderData",
                type: "POST",
                data: JSON.stringify({
                  key: userKey,
                  submittedOrders: thisUserOrders,
                }),
                contentType: "application/json",
                success: function (existUserData) {
                  $.ajax({
                    url: ngrokUrl + "shopUserData",
                    type: "POST",
                    data: JSON.stringify({ currentUser: "SickKids" }),
                    contentType: "application/json",
                    success: function (data) {
                      var key = data[2]._id;
                      var orderListArr = data[2].orderList;
                      orderListArr.push({
                        orderNumber: PONumber,
                        orderDate: today,
                        paymentCode: transactionId,
                        cardType: cardType,
                        paymentMethod: paymentMethod,
                      });

                      $.ajax({
                        url: ngrokUrl + "updateBotShopsOrderList",
                        type: "POST",
                        data: JSON.stringify({
                          currentUser: "SickKids",
                          key: key,
                          orderListArr: orderListArr,
                        }),
                        contentType: "application/json",
                        success: function (data) {
                          $("#loadingSymbol").fadeOut();
                          $("#generateToken")
                            .html("Submit Order")
                            .prop("disabled", false);
                          $("#checkOutModal").modal("hide");
                          $("#invoiceModal1").modal("show");
                          $("#invoiceData1 .invoiceTo").html("");
                          $("#invoiceData1 .shipTo").html("");
                          $("#invoiceDesc1").html("");

                          var firstName = $("#checkOutModal #personName").val();
                          var address1 = $("#checkOutModal #address1").val();
                          var address2 = $("#checkOutModal #address2").val();
                          var city = $("#checkOutModal #city").val();
                          var state = $("#checkOutModal #state").val();
                          var zip = $("#checkOutModal #zip").val();
                          var country = $("#checkOutModal #country").val();
                          var contact = $("#checkOutModal #contact").val();
                          var email = $("#checkOutModal #email").val();

                          var invoiceToHtml =
                            '<p style="margin: 0px;font-size: 12px;">' +
                            firstName +
                            "</p>";
                          invoiceToHtml +=
                            '<p style="margin: 0px;font-size: 12px;">' +
                            address1 +
                            "-" +
                            address2 +
                            "</p>";
                          invoiceToHtml +=
                            '<p style="margin: 0px;font-size: 12px;">' +
                            city +
                            "</p>";
                          invoiceToHtml +=
                            '<p style="margin: 0px;font-size: 12px;">' +
                            state +
                            " " +
                            zip +
                            "</p>";
                          invoiceToHtml +=
                            '<p style="margin: 0px;font-size: 12px;">' +
                            country +
                            "</p>";

                          $("#invoiceData1 .invoiceTo").append(invoiceToHtml);
                          $("#invoiceData1 .shipTo").append(invoiceToHtml);

                          $("#shoppingCartProds .col-12").each(function (
                            index
                          ) {
                            var itemsData =
                              '<div class="col-12" style="padding: 10px;border-bottom: 1px solid #ccc;">';
                            itemsData +=
                              '            <div class="row" style="font-size: 13px;">';
                            itemsData +=
                              '                <div class="col-sm-12 col-md-12 col-lg-4 col-xl-4">';
                            itemsData +=
                              '                    <p style="margin:0px;background-color: #000;color: #fff;padding-left: 5px;">Product</p>';
                            itemsData +=
                              '                    <p style="margin:0px;">' +
                              $(this).find(".thisCartProdType span").text() +
                              "</p>";
                            itemsData += "                </div>";
                            itemsData +=
                              '                <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2">';
                            itemsData +=
                              '                    <p style="margin:0px;background-color: #000;color: #fff;padding-left: 5px;">SKU</p>';
                            itemsData +=
                              '                    <p style="margin:0px;">' +
                              $(this).find(".thisCartProdSku span").text() +
                              "</p>";
                            itemsData += "                </div>";
                            itemsData +=
                              '                <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2">';
                            itemsData +=
                              '                    <p style="margin:0px;background-color: #000;color: #fff;padding-left: 5px;">Color</p>';
                            itemsData +=
                              '                    <p style="margin:0px;">' +
                              $(this).find(".thisCartProdColor span").text() +
                              "</p>";
                            itemsData += "                </div>";
                            itemsData +=
                              '                <div class="col-sm-12 col-md-12 col-lg-1 col-xl-1">';
                            itemsData +=
                              '                    <p style="margin:0px;background-color: #000;color: #fff;padding-left: 5px;">Qty</p>';
                            itemsData +=
                              '                    <p style="margin:0px;">' +
                              $(this).find(".thisCartProdQty").val() +
                              "</p>";
                            itemsData += "                </div>";
                            itemsData +=
                              '                <div class="col-sm-12 col-md-12 col-lg-1 col-xl-1">';
                            itemsData +=
                              '                    <p style="margin:0px;background-color: #000;color: #fff;padding-left: 5px;">Size</p>';
                            itemsData +=
                              '                    <p style="margin:0px;">' +
                              $(this).find(".thisCartProdSize span").text() +
                              "</p>";
                            itemsData += "                </div>";
                            itemsData +=
                              '                <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2">';
                            itemsData +=
                              '                    <p style="margin:0px;background-color: #000;color: #fff;padding-left: 5px;">Amount</p>';
                            itemsData +=
                              '                    <p style="margin:0px;">' +
                              $(this).find(".thisCartProdTotal span").text() +
                              "</p>";
                            itemsData += "                </div>";
                            itemsData += "            </div>";
                            itemsData += "        </div>";

                            $("#invoiceData1 #invoiceDesc1").append(itemsData);
                          });

                          $("#invoiceData1 shippingAmnt").text("CAD 0.00");
                          $("#invoiceData1 finalAmnt").text("CAD 0.00");

                          setTimeout(function () {
                            $("#invoiceData1").css("overflow", "visible");

                            html2canvas(
                              document.querySelector("#invoiceData1"),
                              {
                                scrollX: 0,
                                scrollY: 0,
                              }
                            ).then(function (canvas) {
                              imageFile = canvas.toDataURL("image/jpeg", 1.0);
                              $("#invoiceData1").css("overflow", "auto");
                              $("#shoppingCartProds").html("");
                              calculateTotalProdPrice();
                              $(".cartLength").text(
                                $("#shoppingCartProds .col-12").length
                              );
                              $.ajax({
                                url: ngrokUrl + "uploadBase64InvoiceFiles",
                                type: "POST",
                                data: JSON.stringify({
                                  file: imageFile,
                                  folder:
                                    "customerInvoices/" +
                                    localStorage.getItem(
                                      "__SickKidsShopUser__"
                                    ),
                                  currentUser: "SickKids",
                                }),
                                contentType: "application/json",
                                success: function (res) {
                                  $.ajax({
                                    url: ngrokUrl + "sendSickKidsNotification",
                                    type: "POST",
                                    data: JSON.stringify({
                                      currentUser: localStorage.getItem(
                                        "__SickKidsShopUser__"
                                      ),
                                      orderNumber: PONumber,
                                      invoice: res.secure_url,
                                    }),
                                    contentType: "application/json",
                                    success: function (notifyData) {},
                                  });
                                },
                              });
                            });
                          }, 1000);
                        },
                      });
                    },
                  });
                },
              });
            },
          });
        },
      });
    }, 1000);
  }, 1000);
}

$(document).on("keypress", ':input[type="number"]', function (e) {
  if (isNaN(e.key)) {
    return false;
  }
});

function validateEmail(email) {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function checkAndApplyCoupon() {
  var amount = parseFloat($("#shoppingCart .allCartProdTotal span").text());
  var couponVal = $("#discountCode").val();

  if (amount >= 100) {
    if (couponVal == "" || couponVal == null || couponVal == undefined) {
      $("#errorMsg").modal("show").find("p").text("Invalid Coupon Code");
    } else {
      $.ajax({
        url: ngrokUrl + "shopUserData",
        type: "POST",
        data: JSON.stringify({ currentUser: "SickKids" }),
        contentType: "application/json",
        success: function (data) {
          for (var i = 0; i < data[0].couponList.length; i++) {
            if (data[0].couponList[i].couponCode == couponVal) {
              if (data[0].couponList[i].couponStatus == "active") {
                var newAmnt = amount - data[0].couponList[i].couponAmountOff;
                $("#shoppingCart .allCartProdTotal span").text(newAmnt);
                $("#couponBtn").prop("disabled", true);
                $("#successMsg")
                  .modal("show")
                  .find("p")
                  .text(
                    "Coupon Applied. $" +
                      data[0].couponList[i].couponAmountOff +
                      " is off from total amount."
                  );
                $(".allCartProdTotalDiscount span").text(
                  data[0].couponList[i].couponAmountOff
                );
              } else {
                $("#errorMsg")
                  .modal("show")
                  .find("p")
                  .text("Coupon Code Expires");
              }
              break;
            } else {
              if (i == data[0].couponList.length - 1) {
                if (data[0].couponList[i].couponCode == couponVal) {
                  if (data[0].couponList[i].couponStatus == "active") {
                    var newAmnt =
                      amount - data[0].couponList[i].couponAmountOff;
                    $("#shoppingCart .allCartProdTotal span").text(newAmnt);
                    $("#couponBtn").prop("disabled", true);
                    $("#successMsg")
                      .modal("show")
                      .find("p")
                      .text(
                        "Coupon Applied. $" +
                          data[0].couponList[i].couponAmountOff +
                          " is off from total amount."
                      );
                    $(".allCartProdTotalDiscount span").text(
                      data[0].couponList[i].couponAmountOff
                    );
                  } else {
                    $("#errorMsg")
                      .modal("show")
                      .find("p")
                      .text("Coupon Code Expires");
                  }
                } else {
                  $("#errorMsg")
                    .modal("show")
                    .find("p")
                    .text("Invalid Coupon Code");
                }
              }
            }
          }
        },
      });
    }
  } else {
    $("#errorMsg")
      .modal("show")
      .find("p")
      .text("Total amount has to be higher than $100");
  }
}

function include(arr, obj) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == obj) return true;
  }
}
