ngrokUrl = "https://bot-node-app.firebaseapp.com/";
//ngrokUrl = "https://fc777409f87c.ngrok.io/";

var routerApp = angular.module("webApp", ["ui.router"]);
routerApp.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("login");
  $stateProvider
    // HOME STATES AND NESTED VIEWS ========================================

    .state("login", {
      url: "/login",
      templateUrl: "./views/login.html",
      controller: "loginController",
    })
    .state("main", {
      url: "/main",
      templateUrl: "./views/main.html",
      controller: "mainController",
    })
    .state("main.allOrders", {
      url: "/allOrders",
      templateUrl: "./views/allOrders.html",
      controller: "allOrdersController",
    })
    .state("main.allRewardOrders", {
      url: "/allRewardOrders",
      templateUrl: "./views/allRewardOrders.html",
      controller: "allRewardOrdersController",
    })
    .state("main.users", {
      url: "/users",
      templateUrl: "./views/users.html",
      controller: "usersController",
    })
    .state("main.rewardUsers", {
      url: "/rewardUsers",
      templateUrl: "./views/rewardUsers.html",
      controller: "addRewardUsersController",
    })
    .state("main.rewardOrders", {
      url: "/rewardOrders",
      templateUrl: "./views/rewardOrders.html",
      controller: "rewardsController",
    });
});

routerApp.controller("loginController", function ($scope, $state, $timeout) {
  var scroll_pos = 0;
  $("html, body").animate(
    {
      scrollTop: scroll_pos,
    },
    "2000"
  );

  localStorage.setItem("__SickKidsShopLogin__", "0");

  $scope.adminLogin = function () {
    var username = $("#adminUsername").val();
    var password = $("#adminPassword").val();

    if (
      username == " " ||
      username == null ||
      username == undefined ||
      password == " " ||
      password == null ||
      password == undefined
    ) {
      $("#errorMsg")
        .modal("show")
        .find(".modal-body p")
        .text("Invalid Username or Password!!");
    } else {
      $.ajax({
        url: ngrokUrl + "shopUserData",
        type: "POST",
        data: JSON.stringify({
          currentUser: "SickKids",
        }),
        contentType: "application/json",
        success: function (shopData) {
          if (
            username == shopData[0].adminUsername &&
            password == shopData[0].adminPassword
          ) {
            $state.go("main.allOrders");
            localStorage.setItem("__SickKidsShopLogin__", "1");
          } else {
            $("#errorMsg")
              .modal("show")
              .find(".modal-body p")
              .text("Invalid Username or Password!!");
            localStorage.setItem("__SickKidsShopLogin__", "0");
          }
        },
      });
    }
  };
});
routerApp.controller("mainController", function ($scope, $state, $timeout) {
  setTimeout(function () {
    $("#menuBar ul li").each(function () {
      $(this).removeClass("menuSelected");
    });
    $("#selectThis").addClass("menuSelected");
  }, 500);

  $state.go("main.allRewardOrders");
  var scroll_pos = 0;
  $("html, body").animate(
    {
      scrollTop: scroll_pos,
    },
    "2000"
  );

  /*$scope.goToUsers = function () {
    $state.go("main.users");
  };
  $scope.goToAllOrders = function () {
    $state.go("main.allOrders");
  };*/
  $scope.goToRewardUsers = function () {
    $state.go("main.rewardUsers");
  };
  $scope.goToRewardCustomerOrders = function () {
    $state.go("main.rewardOrders");
  };
  $scope.goToAllRewardOrders = function () {
    $state.go("main.allRewardOrders");
  };

  /*if(localStorage.getItem("__SickKidsShopLogin__") != 1){
        $state.go("login")
    }else{
        
    }*/
  $.ajax({
    url: ngrokUrl + "shopUserData",
    type: "POST",
    data: JSON.stringify({
      currentUser: "SickKids",
    }),
    contentType: "application/json",
    success: function (shopData) {
      $("#orderList").html("");
      if (
        shopData[0].orderList.length == 0 ||
        shopData[0].orderList.length == null ||
        shopData[0].orderList.length == undefined
      ) {
        var html =
          '<div class="row"><div class="col-12 databaseId"><h5 class="text-center">No New Orders Yet!!</h5></div>';
        html += "</div>";
        $("#orderList").append(html);
      } else {
        for (var j = shopData[0].orderList.length - 1; j >= 0; j--) {
          var html = '<div class="row">';
          html +=
            '<div class="col-3 orderDate" style="margin: 5px 0px;font-size: 14px;color: #777;">Date: <span style="font-size: 18px;color: #000;">' +
            shopData[0].orderList[j].orderDate +
            "</span></div>";
          html +=
            '<div class="col-4 poNumber" style="margin: 5px 0px;font-size: 14px;color: #777;">PO: <span style="font-size: 18px;color: #000;">' +
            shopData[0].orderList[j].orderNumber +
            "</span></div>";
          html +=
            '<div class="col-4 databaseId" style="margin: 5px 0px;font-size: 14px;color: #777;">Database Id: <span style="font-size: 18px;color: #000;">' +
            shopData[0]._id +
            "</span></div>";
          html +=
            '<div class="cardType" style="display:none;">' +
            shopData[0].orderList[j].cardType +
            "</div>";
          html +=
            '<div class="paymentCode" style="display:none;">' +
            shopData[0].orderList[j].paymentCode +
            "</div>";
          html +=
            '<div class="paymentMethod" style="display:none;">' +
            shopData[0].orderList[j].paymentMethod +
            "</div>";
          html += '<div class="col-1">';
          html +=
            '<button class="btn btn-block" style="margin: 0;padding: 5px;background-color: #00ACD7 !important;color: #fff;" data-toggle="modal" data-target="#orderInfo" onclick="getOrderInfo(this)">Info</button>';
          html += "</div>";
          html += "</div><hr>";
          $("#orderList").append(html);
          $(function () {
            $('[data-toggle="tooltip"]').tooltip();
          });
        }
      }
    },
  });
});
/*routerApp.controller(
  "allOrdersController",
  function ($scope, $state, $timeout) {
    var scroll_pos = 0;
    $("html, body").animate(
      {
        scrollTop: scroll_pos,
      },
      "2000"
    );
    $("#menuBar ul li").each(function () {
      if ($(this).text().trim() == "All Orders") {
        $(this).addClass("menuSelected");
      } else {
        $(this).removeClass("menuSelected");
      }
    });

    $.ajax({
      url: ngrokUrl + "shopUserData",
      type: "POST",
      data: JSON.stringify({
        currentUser: "SickKids",
      }),
      contentType: "application/json",
      success: function (shopData) {
        $("#orderList").html("");
        if (
          shopData[0].orderList.length == 0 ||
          shopData[0].orderList.length == null ||
          shopData[0].orderList.length == undefined
        ) {
          var html =
            '<div class="row"><div class="col-12 databaseId"><h5 class="text-center">No Orders Yet!!</h5></div>';
          html += "</div>";
          $("#orderList").append(html);
        } else {
          for (var j = shopData[0].orderList.length - 1; j >= 0; j--) {
            var html = '<div class="row">';
            html +=
              '<div class="col-3 orderDate" style="margin: 5px 0px;font-size: 14px;color: #777;">Date: <span style="font-size: 18px;color: #000;">' +
              shopData[0].orderList[j].orderDate +
              "</span></div>";
            html +=
              '<div class="col-4 poNumber" style="margin: 5px 0px;font-size: 14px;color: #777;">PO: <span style="font-size: 18px;color: #000;">' +
              shopData[0].orderList[j].orderNumber +
              "</span></div>";
            html +=
              '<div class="col-4 databaseId" style="margin: 5px 0px;font-size: 14px;color: #777;">Database Id: <span style="font-size: 18px;color: #000;">' +
              shopData[0]._id +
              "</span></div>";
            html +=
              '<div class="cardType" style="display:none;">' +
              shopData[0].orderList[j].cardType +
              "</div>";
            html +=
              '<div class="paymentCode" style="display:none;">' +
              shopData[0].orderList[j].paymentCode +
              "</div>";
            html +=
              '<div class="paymentMethod" style="display:none;">' +
              shopData[0].orderList[j].paymentMethod +
              "</div>";
            html += '<div class="col-1">';
            html +=
              '<button class="btn btn-block" style="margin: 0;padding: 5px;background-color: #00ACD7 !important;color: #fff;" data-toggle="modal" data-target="#orderInfo" onclick="getOrderInfo(this)">Info</button>';
            html += "</div>";
            html += "</div><hr>";
            $("#orderList").append(html);
            $(function () {
              $('[data-toggle="tooltip"]').tooltip();
            });
          }
        }
      },
    });
  }
);*/

/*routerApp.controller("usersController", function ($scope, $state, $timeout) {
  var scroll_pos = 0;
  $("html, body").animate(
    {
      scrollTop: scroll_pos,
    },
    "2000"
  );
  $("#menuBar ul li").each(function () {
    if ($(this).text().trim() == "Users") {
      $(this).addClass("menuSelected");
    } else {
      $(this).removeClass("menuSelected");
    }
  });

  $.ajax({
    url: ngrokUrl + "getSickKidsCustomers",
    type: "GET",
    contentType: "application/json",
    success: function (shopCustomerData) {
      $("#usersList").html("");
      if (shopCustomerData.length == 0) {
        var html =
          '<div class="row"><div class="col-12 databaseId"><h5 class="text-center">No Users Yet!!</h5></div>';
        html += "</div>";
        $("#usersList").append(html);
      } else if (shopCustomerData.length == 1) {
        if (shopCustomerData[0] == "system.indexes") {
          var html =
            '<div class="row" style="margin:0px;"><div class="col-12 databaseId"><h5 class="text-center" style="margin: 15px;">No Users Yet!!</h5></div>';
          html += "</div>";
          $("#usersList").append(html);
        }
      } else {
        for (var i = 0; i < shopCustomerData.length; i++) {
          if (shopCustomerData[i] != "system.indexes") {
            var html =
              '<div class="row" style="position: relative;margin: 0px;padding: 15px 10px;border-bottom: 1px solid #ccc;" onclick="getThisUserData(this)">';
            html +=
              '<i class="fas fa-chevron-right" style="position: absolute;right: 5px;font-size: 17px;margin: 0px;top:18px;"></i>';
            html += '<div class="col-1" style="padding: 0px;">';
            html +=
              '    <i class="far fa-user" style="font-size: 25px;margin: 0px;"></i>';
            html += "</div>";
            html += '<div class="col-11" style="padding: 0px 10px;">';
            html +=
              '    <p style="margin: 0px;font-size: 12px;text-align: left;margin: 6px 0px;overflow: hidden !important;text-overflow: ellipsis;">' +
              shopCustomerData[i] +
              "</p>";
            html += "</div>";
            html += "</div>";
            $("#usersList").append(html);
          }
          $(function () {
            $('[data-toggle="tooltip"]').tooltip();
          });
        }
      }
    },
  });
});*/
routerApp.controller(
  "allRewardOrdersController",
  function ($scope, $state, $timeout) {
    var scroll_pos = 0;
    $("html, body").animate(
      {
        scrollTop: scroll_pos,
      },
      "2000"
    );
    /*$("#menuBar ul li").each(function(){
        if($(this).text().trim() == "All Orders"){
            $(this).addClass("menuSelected")
        }else{
            $(this).removeClass("menuSelected")
        }
    })*/

    $.ajax({
      url: ngrokUrl + "shopUserData",
      type: "POST",
      data: JSON.stringify({
        currentUser: "SickKids",
      }),
      contentType: "application/json",
      success: function (shopData) {
        $("#rewardOrderList").html("");
        if (
          shopData[2].orderList.length == 0 ||
          shopData[2].orderList.length == null ||
          shopData[2].orderList.length == undefined
        ) {
          var html =
            '<div class="row"><div class="col-12 databaseId"><h5 class="text-center">No Orders Yet!!</h5></div>';
          html += "</div>";
          $("#rewardOrderList").append(html);
        } else {
          for (var j = shopData[2].orderList.length - 1; j >= 0; j--) {
            var html = '<div class="row">';
            html +=
              '<div class="col-3 orderDate" style="margin: 5px 0px;font-size: 14px;color: #777;">Date: <span style="font-size: 18px;color: #000;">' +
              shopData[2].orderList[j].orderDate +
              "</span></div>";
            html +=
              '<div class="col-4 poNumber" style="margin: 5px 0px;font-size: 14px;color: #777;">PO: <span style="font-size: 18px;color: #000;">' +
              shopData[2].orderList[j].orderNumber +
              "</span></div>";
            html +=
              '<div class="col-4 databaseId" style="margin: 5px 0px;font-size: 14px;color: #777;">Database Id: <span style="font-size: 18px;color: #000;">' +
              shopData[2]._id +
              "</span></div>";
            html +=
              '<div class="cardType" style="display:none;">' +
              shopData[2].orderList[j].cardType +
              "</div>";
            html +=
              '<div class="paymentCode" style="display:none;">' +
              shopData[2].orderList[j].paymentCode +
              "</div>";
            html +=
              '<div class="paymentMethod" style="display:none;">' +
              shopData[2].orderList[j].paymentMethod +
              "</div>";
            html += '<div class="col-1">';
            html +=
              '<button class="btn btn-block" style="margin: 0;padding: 5px;background-color: #00ACD7 !important;color: #fff;" data-toggle="modal" data-target="#orderInfo" onclick="getOrderInfo(this)">Info</button>';
            html += "</div>";
            html += "</div><hr>";
            $("#rewardOrderList").append(html);
            $(function () {
              $('[data-toggle="tooltip"]').tooltip();
            });
          }
        }
      },
    });
  }
);
routerApp.controller("rewardsController", function ($scope, $state, $timeout) {
  var scroll_pos = 0;
  $("html, body").animate(
    {
      scrollTop: scroll_pos,
    },
    "2000"
  );
  $("#menuBar ul li").each(function () {
    if ($(this).text().trim() == "Reward Customer Orders") {
      $(this).addClass("menuSelected");
    } else {
      $(this).removeClass("menuSelected");
    }
  });

  $.ajax({
    url: ngrokUrl + "getSKRewardUsers",
    type: "POST",
    contentType: "application/json",
    success: function (rewardCustomerData) {
      $("#rewardUsersList").html("");
      if (rewardCustomerData.length == 0) {
        var html =
          '<div class="row"><div class="col-12 databaseId"><h5 class="text-center" style="margin-top:10px;display:block;">No Users Yet!!</h5></div>';
        html += "</div>";
        $("#rewardUsersList").append(html);
      } else if (rewardCustomerData.length == 1) {
        if (rewardCustomerData[0] == "system.indexes") {
          var html =
            '<div class="row" style="margin:0px;"><div class="col-12 databaseId"><h5 class="text-center" style="margin-top:10px;display:block;">No Users Yet!!</h5></div>';
          html += "</div>";
          $("#rewardUsersList").append(html);
        } else {
          $("#checkRewardCustomer").prop("disabled", false);
          for (var i = 0; i < rewardCustomerData.length; i++) {
            if (rewardCustomerData[i] != "system.indexes") {
              var html =
                '<div class="row" style="position: relative;margin: 0px;padding: 15px 10px;border-bottom: 1px solid #ccc;" onclick="getThisRewardUserData(this)">';
              html +=
                '<i class="fas fa-chevron-right" style="position: absolute;right: 5px;font-size: 17px;margin: 0px;top:18px;"></i>';
              html += '<div class="col-1" style="padding: 0px;">';
              html +=
                '    <i class="far fa-user" style="font-size: 25px;margin: 0px;"></i>';
              html += "</div>";
              html += '<div class="col-11" style="padding: 0px 10px;">';
              html +=
                '    <p style="margin: 0px;font-size: 12px;text-align: left;margin: 6px 0px;overflow: hidden !important;text-overflow: ellipsis;">' +
                rewardCustomerData[i].email +
                "</p>";
              html += "</div>";
              html += "</div>";
              $("#rewardUsersList").append(html);
            }
            $(function () {
              $('[data-toggle="tooltip"]').tooltip();
            });
          }
        }
      } else {
        $("#checkRewardCustomer").prop("disabled", false);
        for (var i = 0; i < rewardCustomerData.length; i++) {
          if (rewardCustomerData[i] != "system.indexes") {
            var html =
              '<div class="row" style="position: relative;margin: 0px;padding: 15px 10px;border-bottom: 1px solid #ccc;" onclick="getThisRewardUserData(this)">';
            html +=
              '<i class="fas fa-chevron-right" style="position: absolute;right: 5px;font-size: 17px;margin: 0px;top:18px;"></i>';
            html += '<div class="col-1" style="padding: 0px;">';
            html +=
              '    <i class="far fa-user" style="font-size: 25px;margin: 0px;"></i>';
            html += "</div>";
            html += '<div class="col-11" style="padding: 0px 10px;">';
            html +=
              '    <p style="margin: 0px;font-size: 12px;text-align: left;margin: 6px 0px;overflow: hidden !important;text-overflow: ellipsis;">' +
              rewardCustomerData[i].email +
              "</p>";
            html += "</div>";
            html += "</div>";
            $("#rewardUsersList").append(html);
          }
          $(function () {
            $('[data-toggle="tooltip"]').tooltip();
          });
        }
      }
    },
  });
});
routerApp.controller(
  "addRewardUsersController",
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

function getThisUserData(e) {
  $("#thisUserInvoices").prop("disabled", false);
  $("#thisUserOrderlist").html(
    '<div class="preloader-wrapper big active" style="display:block;margin:20px auto;"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"<div class="circle"></div></div></div></div>'
  );

  var userName = $(e).find("p").text();
  $("#selectedUser").text(userName);
  $.ajax({
    url: ngrokUrl + "getSickKidsCustomerData",
    type: "POST",
    data: JSON.stringify({
      email: userName,
    }),
    contentType: "application/json",
    success: function (sickKidsUserData) {
      $("#thisUserOrderlist").html("");
      if (sickKidsUserData[0].submittedOrders.length == 0) {
        var html = '<div class="row" style="margin-top: 1rem;">';
        html +=
          '<div class="col-12" style="margin: 8px 0px;font-size: 14px;color: #777;text-align:center;">No Order Present</div>';
        html += "</div>";
        $("#thisUserOrderlist").append(html);
      } else {
        for (var i = 0; i < sickKidsUserData[0].submittedOrders.length; i++) {
          var html = '<div class="row" style="margin-top: 1rem;">';
          html +=
            '<div class="col-3 orderDate" style="margin: 9px 0px;font-size: 14px;color: #777;">Date: <span style="font-size: 14px;color: #000;">' +
            sickKidsUserData[0].submittedOrders[i].orderDate +
            "</span></div>";
          html +=
            '<div class="col-3 poNumber" style="margin: 9px 0px;font-size: 14px;color: #777;overflow: hidden !important;text-overflow: ellipsis;white-space: nowrap;">PO: <span style="font-size: 14px;color: #000;">' +
            sickKidsUserData[0].submittedOrders[i].orderNumber +
            "</span></div>";
          html +=
            '<div class="col-3 databaseId" style="margin: 9px 0px;font-size: 14px;color: #777;">Database Id: <span style="font-size: 14px;color: #000;">' +
            sickKidsUserData[0]._id +
            "</span></div>";

          html +=
            '<div class="col-2 text-center"><button class="btn btn-link" style="margin: 0;padding: 5px 10px;" data-toggle="modal" data-target="#orderInfo" onclick="getOrderInfo(this)"><i class="fas fa-info-circle" style="margin: 0;font-size: 20px;"></i></button></div>';
          if (
            sickKidsUserData[0].submittedOrders[i].shippingInfo == "notSent"
          ) {
            html +=
              '<div class="col-1" data-toggle="tooltip" title="In-Production"><i class="fas fa-hourglass-half" style="font-size: 22px;margin: 5px;"></i></div>';
          } else if (
            sickKidsUserData[0].submittedOrders[i].shippingInfo == "sent"
          ) {
            html +=
              '<div class="col-1" data-toggle="tooltip" title="Shipped"><i class="fas fa-shipping-fast" style="font-size: 22px;margin: 5px;"></i></div>';
          }
          html += "</div></div>";
          html += "<hr>";
          $("#thisUserOrderlist").append(html);
          $(function () {
            $('[data-toggle="tooltip"]').tooltip();
          });
        }
      }
    },
  });
}

function getThisRewardUserData(e) {
  $("#thisRewardUserOrderlist").html(
    '<div class="preloader-wrapper big active" style="display:block;margin:20px auto;"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"<div class="circle"></div></div></div></div>'
  );
  var userName = $(e).find("p").text();
  $("#selectedRewardUser").text(userName);
  $("#rewardProd").html("");
  $.ajax({
    url: ngrokUrl + "getSKRewardUserDataInfo",
    type: "POST",
    data: JSON.stringify({
      currentUser: userName,
    }),
    contentType: "application/json",
    success: function (sickKidsUserData) {
      $("#rewardUsername span").text(sickKidsUserData.email);
      $("#rewardPassword span").text(sickKidsUserData.password);

      if (sickKidsUserData.codeStatus == "Active") {
        $("#rewardCode span").html(
          sickKidsUserData.code +
            "<a style='float: right;text-decoration: underline;color: #33b5e5;' dataId=" +
            sickKidsUserData._id +
            ">" +
            sickKidsUserData.codeStatus +
            "</a>"
        );
      } else {
        $("#rewardCode span").html(
          sickKidsUserData.code +
            "<a style='float: right;text-decoration: underline;color: #33b5e5;' dataId=" +
            sickKidsUserData._id +
            ">" +
            sickKidsUserData.codeStatus +
            "</a>"
        );
      }

      for (var i = 0; i < sickKidsUserData.rewardProd.length; i++) {
        var html =
          "<li><b>" + sickKidsUserData.rewardProd[i].replace(/_/g, " ");
        ("</b></li>");
        $("#rewardProd").append(html);
      }

      $("#thisUserDelete").attr("databaseId", sickKidsUserData._id);
      $("#thisUserDelete").prop("disabled", false);
      $("#thisUserEmail").prop("disabled", false);
      $("#thisUserRewardProds").prop("disabled", false);
      $("#thisRewardUserOrderlist").html("");
      if (sickKidsUserData.orders.length == 0) {
        var html = '<div class="row" style="margin-top: 1rem;">';
        html +=
          '<div class="col-12" style="margin: 8px 0px;font-size: 14px;color: #777;text-align:center;">No Order Present</div>';
        html += "</div>";
        $("#thisRewardUserOrderlist").append(html);
      } else {
        for (var i = 0; i < sickKidsUserData.orders.length; i++) {
          var html = '<div class="row" style="margin-top: 1rem;">';
          html +=
            '<div class="col-3 orderDate" style="margin: 9px 0px;font-size: 14px;color: #777;">Date: <span style="font-size: 14px;color: #000;">' +
            sickKidsUserData.orders[i].orderDate +
            "</span></div>";
          html +=
            '<div class="col-3 poNumber" style="margin: 9px 0px;font-size: 14px;color: #777;overflow: hidden !important;text-overflow: ellipsis;white-space: nowrap;">PO: <span style="font-size: 14px;color: #000;">' +
            sickKidsUserData.orders[i].orderNumber +
            "</span></div>";
          html +=
            '<div class="col-4 databaseId" style="margin: 9px 0px;font-size: 14px;color: #777;">Database Id: <span style="font-size: 14px;color: #000;">' +
            sickKidsUserData._id +
            "</span></div>";

          html +=
            '<div class="col-2 text-center"><button class="btn btn-link" style="margin: 0;padding: 5px 10px;" data-toggle="modal" data-target="#orderInfo" onclick="getOrderInfo(this)"><i class="fas fa-info-circle" style="margin: 0;font-size: 20px;"></i></button></div>';
          /*if (sickKidsUserData.orders[i].shippingInfo == "notSent") {
            html +=
              '<div class="col-1" data-toggle="tooltip" title="In-Production"><i class="fas fa-hourglass-half" style="font-size: 22px;margin: 5px;"></i></div>';
          } else if (sickKidsUserData.orders[i].shippingInfo == "sent") {
            html +=
              '<div class="col-1" data-toggle="tooltip" title="Shipped"><i class="fas fa-shipping-fast" style="font-size: 22px;margin: 5px;"></i></div>';
          }*/
          html += "</div></div>";
          html += "<hr>";
          $("#thisRewardUserOrderlist").append(html);
          $(function () {
            $('[data-toggle="tooltip"]').tooltip();
          });
        }
      }
    },
  });
}

function deactivateCode(e) {
  $(e).text("De-Activating...");
  var dataId = $(e).attr("dataId");
  setTimeout(function () {
    $.ajax({
      url: ngrokUrl + "deactivateRewardCode",
      type: "POST",
      async: false,
      data: JSON.stringify({ dataId }),
      contentType: "application/json",
      success: function (deactivateRewardCode) {
        // Update Data on Screen
        var userName = $("#selectedRewardUser").text();
        $("#thisRewardUserOrderlist").html(
          '<div class="preloader-wrapper big active" style="display:block;margin:20px auto;"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"<div class="circle"></div></div></div></div>'
        );
        $("#rewardProd").html("");
        $.ajax({
          url: ngrokUrl + "getSKRewardUserDataInfo",
          type: "POST",
          data: JSON.stringify({
            currentUser: userName,
          }),
          contentType: "application/json",
          success: function (sickKidsUserData) {
            $("#rewardUsername span").text(sickKidsUserData.email);
            $("#rewardPassword span").text(sickKidsUserData.password);
            if (sickKidsUserData.codeStatus == "Active") {
              $("#rewardCode span").html(
                sickKidsUserData.code +
                  "<a style='float: right;text-decoration: underline;color: #33b5e5;' dataId=" +
                  sickKidsUserData._id +
                  " onclick='deactivateCode(this)'>De-Activate</a>"
              );
            } else {
              $("#rewardCode span").html(sickKidsUserData.code);
            }
            for (var i = 0; i < sickKidsUserData.rewardProd.length; i++) {
              var html =
                "<li><b>" + sickKidsUserData.rewardProd[i].replace(/_/g, " ");
              ("</b></li>");
              $("#rewardProd").append(html);
            }

            $("#thisUserDelete").attr("databaseId", sickKidsUserData._id);
            $("#thisUserDelete").prop("disabled", false);
            $("#thisUserEmail").prop("disabled", false);
            $("#thisUserRewardProds").prop("disabled", false);
            $("#thisRewardUserOrderlist").html("");
            if (sickKidsUserData.orders.length == 0) {
              var html = '<div class="row" style="margin-top: 1rem;">';
              html +=
                '<div class="col-12" style="margin: 8px 0px;font-size: 14px;color: #777;text-align:center;">No Order Present</div>';
              html += "</div>";
              $("#thisRewardUserOrderlist").append(html);
            } else {
              for (var i = 0; i < sickKidsUserData.orders.length; i++) {
                var html = '<div class="row" style="margin-top: 1rem;">';
                html +=
                  '<div class="col-3 orderDate" style="margin: 9px 0px;font-size: 14px;color: #777;">Date: <span style="font-size: 14px;color: #000;">' +
                  sickKidsUserData.orders[i].orderDate +
                  "</span></div>";
                html +=
                  '<div class="col-3 poNumber" style="margin: 9px 0px;font-size: 14px;color: #777;overflow: hidden !important;text-overflow: ellipsis;white-space: nowrap;">PO: <span style="font-size: 14px;color: #000;">' +
                  sickKidsUserData.orders[i].orderNumber +
                  "</span></div>";
                html +=
                  '<div class="col-4 databaseId" style="margin: 9px 0px;font-size: 14px;color: #777;">Database Id: <span style="font-size: 14px;color: #000;">' +
                  sickKidsUserData._id +
                  "</span></div>";

                html +=
                  '<div class="col-2 text-center"><button class="btn btn-link" style="margin: 0;padding: 5px 10px;" data-toggle="modal" data-target="#orderInfo" onclick="getOrderInfo(this)"><i class="fas fa-info-circle" style="margin: 0;font-size: 20px;"></i></button></div>';
                html += "</div></div>";
                html += "<hr>";
                $("#thisRewardUserOrderlist").append(html);
                $(function () {
                  $('[data-toggle="tooltip"]').tooltip();
                });
              }
            }

            // Send Reward Email
            var rewardProd = [];
            $("#rewardProd li").each(function () {
              rewardProd.push($(this).find("b").text());
            });
            $.ajax({
              url: ngrokUrl + "getSKRewardUserDataInfo",
              type: "POST",
              data: JSON.stringify({
                currentUser: userName,
              }),
              contentType: "application/json",
              success: function (sickKidsUserData) {
                var mailData = {
                  email: sickKidsUserData.email,
                  name: sickKidsUserData.name,
                  html: $("#rewardProd").html(),
                  code: sickKidsUserData.code,
                  password: sickKidsUserData.password,
                  amount: sickKidsUserData.amount,
                };
              },
            });
          },
        });
      },
    });
  }, 1000);
}

function getOrderInfo(e) {
  $("#trackingStatus").html("");
  $("#thisOrderData").html(
    '<div class="row"><div class="col-12"><div class="preloader-wrapper big active" style="display:block;margin:0px auto;"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div> </div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div></div>'
  );

  $("#thisOrderShippingData").html(
    '<div class="row"><div class="col-12"><div class="preloader-wrapper big active" style="display:block;margin:0px auto;"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div> </div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div></div>'
  );

  var orderPO = $(e).parent().parent().find(".poNumber span").text();

  $.ajax({
    url: ngrokUrl + "getOrdersFromMachine",
    type: "POST",
    data: JSON.stringify({
      orderPo: orderPO,
    }),
    contentType: "application/json",
    success: function (machineData) {
      $("#thisOrderData").html("");
      $("#thisOrderShippingData").html("");

      var x2js = new X2JS();
      var xmlText = machineData;
      var jsonObj = x2js.xml_str2json(xmlText);
      var requiredXML = jsonObj.string;
      var parseRequiredXML = parseXml(requiredXML);
      var newConversion = xml2json(parseRequiredXML).replace("undefined", "");

      var returnMachineData = JSON.parse(newConversion);
      if (returnMachineData.Status == undefined) {
        var itemsData = returnMachineData.Request.Item;
        var userData = returnMachineData.Request;
        var shippingInfo = returnMachineData.shipmentInfo;
      } else {
        var itemsData = returnMachineData.Status.Request.Item;
        var userData = returnMachineData.Status.Request;
        var shippingInfo = returnMachineData.Status.shipmentInfo;
      }
      if (Array.isArray(itemsData)) {
        for (var i = 0; i < itemsData.length; i++) {
          var html = '<div class="row">';
          html += '<div class="col-2">';
          html +=
            '<img style="width:100%;display: block;margin: 0px auto;" src="' +
            itemsData[i].Design.Thumb +
            '">';
          html += "</div>";
          html += '<div class="col-5" style="line-height: 30px;">';
          html +=
            '<p class="thisOrderProdSku" style="margin-bottom: 0px;font-size: 14px;color: #777;">SKU:<span style="font-size: 16px;color: #000;">' +
            itemsData[i].SKU +
            "</span></p>";
          html +=
            '<p class="thisOrderProdQty" style="margin-bottom: 0px;font-size: 14px;color: #777;">Quantity:<span style="font-size: 16px;color: #000;">' +
            itemsData[i].Qty +
            "</span></p>";
          html +=
            '<p class="thisOrderProdStyle" style="margin-bottom: 0px;font-size: 14px;color: #777;">Style:<span style="font-size: 16px;color: #000;">' +
            itemsData[i].SKU.split("-")[0] +
            "-" +
            itemsData[i].SKU.split("-")[1] +
            "</span></p>";
          html += "</div>";
          html += '<div class="col-5" style="line-height: 30px;">';
          html +=
            '<p class="thisOrderProdColor" style="margin-bottom: 0px;font-size: 14px;color: #777;">Color:<span style="font-size: 16px;color: #000;">' +
            itemsData[i].Color +
            "</span></p>";
          html +=
            '<p class="thisOrderProdSize" style="margin-bottom: 0px;font-size: 14px;color: #777;">Size:<span style="font-size: 16px;color: #000;">' +
            itemsData[i].Size +
            "</span></p>";
          html += "</div>";
          html += "</div><hr>";
          $("#thisOrderData").append(html);
        }
      } else {
        var html = '<div class="row">';
        html += '<div class="col-2">';
        if (Array.isArray(itemsData.Design)) {
          html +=
            '<img style="width:100%;display: block;margin: 0px auto;" src="' +
            itemsData.Design.Thumb +
            '">';
        } else {
          html +=
            '<img style="width:100%;display: block;margin: 0px auto;" src="' +
            itemsData.Design.Thumb +
            '">';
        }
        html += "</div>";
        html += '<div class="col-5" style="line-height: 30px;">';
        html +=
          '<p class="thisOrderProdSku" style="margin-bottom: 0px;font-size: 14px;color: #777;">SKU:<span style="font-size: 16px;color: #000;">' +
          itemsData.SKU +
          "</span></p>";
        html +=
          '<p class="thisOrderProdQty" style="margin-bottom: 0px;font-size: 14px;color: #777;">Quantity:<span style="font-size: 16px;color: #000;">' +
          itemsData.Qty +
          "</span></p>";
        html +=
          '<p class="thisOrderProdStyle" style="margin-bottom: 0px;font-size: 14px;color: #777;">Style:<span style="font-size: 16px;color: #000;">' +
          itemsData.SKU.split("-")[0] +
          "-" +
          itemsData.SKU.split("-")[1] +
          "</span></p>";
        html += "</div>";
        html += '<div class="col-5" style="line-height: 30px;">';
        html +=
          '<p class="thisOrderProdColor" style="margin-bottom: 0px;font-size: 14px;color: #777;">Color:<span style="font-size: 16px;color: #000;">' +
          itemsData.Color +
          "</span></p>";
        html +=
          '<p class="thisOrderProdSize" style="margin-bottom: 0px;font-size: 14px;color: #777;">Size:<span style="font-size: 16px;color: #000;">' +
          itemsData.Size +
          "</span></p>";
        html += "</div>";
        html += "</div><hr>";
        $("#thisOrderData").append(html);
      }
      var shippingHtml = "<p>" + userData.ShipTo.FirstName + "</p>";
      if (userData.ShipTo.Adrx2 != null) {
        shippingHtml +=
          "<p>" + userData.ShipTo.Adrx1 + " " + userData.ShipTo.Adrx2 + "</p>";
      } else {
        shippingHtml += "<p>" + userData.ShipTo.Adrx1 + "</p>";
      }
      shippingHtml += "<p>" + userData.ShipTo.City + "</p>";
      shippingHtml += "<p>" + userData.ShipTo.Zip + "</p>";
      shippingHtml +=
        "<p>" + userData.ShipTo.State + " " + userData.ShipTo.Country + "</p>";
      shippingHtml +=
        '<p id="customerEmailId">' + userData.ShipTo.Email + "</p>";
      $("#thisOrderShippingData").html(shippingHtml);
      if (shippingInfo == undefined) {
        if (userData.BarcodePrinted == "true") {
          var html = '<th scope="row">';
          html += "Sick Kids";
          html += "</th>";
          html += "<td>" + orderPO + "</td>";
          html += "<td>In-Production</td>";
          html += "<td>- -</td>";
          html += "<td>- -</td>";
          /*html +=
            '<td><button class="btn btn-link" disabled style="padding:0px;margin:0px;">Notify</button></td>';*/

          $("#trackingStatus").append(html);
        } else {
          var html = '<th scope="row">';
          html += "Sick Kids";
          html += "</th>";
          html += "<td>" + orderPO + "</td>";
          html += "<td>New</td>";
          html += "<td>- -</td>";
          html += "<td>- -</td>";
          /*html +=
            '<td><button class="btn btn-link" disabled style="padding:0px;margin:0px;">Notify</button></td>';*/

          $("#trackingStatus").append(html);
        }
      } else {
        var html = '<th scope="row">';
        html += "Sick Kids";
        html += "</th>";
        html += '<td class="orderNumb">' + orderPO + "</td>";
        html += "<td>Shipped</td>";
        html += "<td>" + shippingInfo.shipDate + "</td>";
        html +=
          '<td class="trackNumb">' + shippingInfo.trackingNumber + "</td>";
        //html +=
        //  '<td><button class="btn btn-link" style="padding:0px;margin:0px;" onclick="sendCustomerTrackingNumber(this)">Notify</button></td>';

        $("#trackingStatus").append(html);
      }
    },
  });
}

function sendCustomerTrackingNumber(e) {
  var trackingNumber = $(e).parent().parent().find(".trackNumb").text();
  var orderNumb = $(e).parent().parent().find(".orderNumb").text();
  var customerEmailId = $("#thisOrderShippingData #customerEmailId").text();

  $.ajax({
    url: ngrokUrl + "getSickKidsCustomerData",
    type: "POST",
    data: JSON.stringify({
      email: customerEmailId,
    }),
    contentType: "application/json",
    success: function (checkSKUser) {
      var userKey = checkSKUser[0]._id;
      var orderArr = checkSKUser[0].submittedOrders;
      for (var i = 0; i < orderArr.length; i++) {
        if (orderArr[i].orderNumber == orderNumb) {
          orderArr.push({
            orderNumber: orderArr[i].orderNumber,
            orderDate: orderArr[i].orderDate,
            paymentCode: orderArr[i].paymentCode,
            cardType: orderArr[i].cardType,
            paymentMethod: orderArr[i].paymentMethod,
            shippingInfo: "sent",
          });
          orderArr.splice(i, 1);
          $.ajax({
            url: ngrokUrl + "updateSickKidsCustomerOrderData",
            type: "POST",
            data: JSON.stringify({
              email: customerEmailId,
              key: userKey,
              submittedOrders: orderArr,
            }),
            contentType: "application/json",
            success: function (existUserData) {
              if (existUserData.customerEmail == customerEmailId) {
                $.ajax({
                  url: ngrokUrl + "notifySickKidsCustomer",
                  type: "POST",
                  data: JSON.stringify({
                    custEmail: customerEmailId,
                    trackNumb: trackingNumber,
                    orderNumb: orderNumb,
                  }),
                  contentType: "application/json",
                  success: function (notifySickKidsCustomer) {
                    if (notifySickKidsCustomer == "Success") {
                      $("#successMsg")
                        .modal("show")
                        .find(".modal-body p")
                        .text("Customer Informed with Tracking Number!!");
                    }
                  },
                });
              } else {
                $("#errorMsg")
                  .modal("show")
                  .find(".modal-body p")
                  .text("Unable to notify, Internal error!!");
              }
            },
          });
          break;
        }
      }
    },
  });
}

function deleteThisOrder(e) {
  var r = confirm("Are you sure, you want to delete this order !!");
  if (r == true) {
    var spliceDataId = $(e).parent().parent().find(".poNumber").text();
    $.ajax({
      url: ngrokUrl + "shopUserData",
      type: "POST",
      data: JSON.stringify({ currentUser: "WestonFoods" }),
      contentType: "application/json",
      success: function (data) {
        var key = data[0]._id;
        var orderListArr = data[0].orderList;

        for (var i = 0; i < orderListArr.length; i++) {
          if (orderListArr[i].AddXml.OrderString.Request.PO == spliceDataId) {
            orderListArr.splice(i, 1);
            $.ajax({
              url: ngrokUrl + "updateBotShopsOrderList",
              type: "POST",
              data: JSON.stringify({
                currentUser: "WestonFoods",
                key: key,
                orderListArr: orderListArr,
              }),
              contentType: "application/json",
              success: function (data) {
                $(e).parent().parent().fadeOut();
              },
            });
          }
        }
      },
    });
  } else {
  }
}

function deleteUser(e) {
  $(e).text("Deleting...").prop("disabled", true);
  var dataId = $(e).attr("databaseid");
  $.ajax({
    url: ngrokUrl + "deleteSickKidsRewardsCustomer",
    type: "POST",
    data: JSON.stringify({ key: dataId }),
    contentType: "application/json",
    success: function (data) {
      $(e).text("Delete").prop("disabled", false);
      $("#successMsg")
        .modal("show")
        .find(".modal-body p")
        .text("Reward Customer Deleted !!");

      setTimeout(function () {
        window.location.reload();
      }, 1000);
    },
  });
}

function getInvoices() {
  $("#invoiceFiles").modal("show");
  $("#thisOrderCustomerEmail").text($("#selectedUser").text());
  $("#invoicesData").html(
    '<div class="preloader-wrapper big active" style="display:block;margin:0px auto;"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>'
  );
  $.ajax({
    url: ngrokUrl + "botShopsInvoiceFiles",
    type: "POST",
    data: JSON.stringify({
      currUser: "SickKids",
      custBotInvoice: "customerInvoices",
      customer: $("#selectedUser").text(),
    }),
    contentType: "application/json",
    success: function (libFilesData) {
      $("#invoicesData").html("");
      for (var i = 0; i < libFilesData.resources.length; i++) {
        var html = '<div class="col-3" style="margin-bottom:10px;">';
        html +=
          '<img src="' +
          libFilesData.resources[i].secure_url +
          '" style="width: 100%;border: 1px solid #ccc;">';
        html +=
          '<a class="btn btn-primary btn-block" href="' +
          libFilesData.resources[i].secure_url +
          '" target="_blank"><i class="far fa-eye"></i> View</a>';
        html += "</div>";
        $("#invoicesData").append(html);
      }
    },
  });
}

function activateReportBtn() {
  var selectedMonth = $("#reportMonth").val();

  if (selectedMonth == "") {
    $("#generateReportBtn").prop("disabled", "true");
  } else {
    $("#generateReportBtn").prop("disabled", false);
  }
  $("#rewardOrderList .row").each(function () {
    if ($(this).find(".orderDate span").text().split(" ")[0] != selectedMonth) {
      $(this).remove();
    }
  });
}

function checkRewardCustomer() {
  $("#generatingRewardUserReportModal").modal({
    backdrop: "static",
  });
  var productionItems = [
    {
      customerFName: "First Name",
      customerLName: "Last Name",
      customerEmail: "Email",
      rewardCodeStatus: "Code Status",
      rewardCodeUsed: "Reward Code Used",
    },
  ];
  var time = 0;
  setTimeout(function () {
    $("#rewardUsersList .row").each(function (index) {
      var rewardUserThis = $(this);
      var rewardUserIndex = index;
      setTimeout(function () {
        rewardUser = rewardUserThis.find("p").text();
        $(
          "#generatingRewardUserReportModal #generatingRewardUserValue span"
        ).text(rewardUser);
        $.ajax({
          url: ngrokUrl + "getSKRewardUserDataInfo",
          type: "POST",
          data: JSON.stringify({
            currentUser: rewardUser,
          }),
          contentType: "application/json",
          success: function (sickKidsUserData) {
            if (
              sickKidsUserData.codeStatus == "Active" &&
              sickKidsUserData.orders.length == 0
            ) {
              productionItems.push({
                customerFName: sickKidsUserData.name,
                customerLName: sickKidsUserData.lastName,
                customerEmail: sickKidsUserData.email,
                rewardCodeStatus: sickKidsUserData.codeStatus,
                rewardCodeUsed: "NO",
              });
              console.log(productionItems);
            }
          },
        });
        if (rewardUserIndex == $("#rewardUsersList .row").length - 1) {
          $("#generatingRewardUserReportModal").modal("hide");
          if (productionItems.length == 1) {
            $("#errorMsg")
              .modal("show")
              .find(".modal-body p")
              .text("No Entry is present!!");
          } else {
            var reportData = JSON.stringify(productionItems);
            var ReportTitle = "GetLoudShop-Active-RewardPoints-Report";
            JSONToCSVConvertor(reportData, ReportTitle);
          }
        }
      }, time);
      time += 3000;
    });
  }, 1000);
}

function generateReport() {
  $("#generatingReportModal").modal({
    backdrop: "static",
  });
  var selectedMonth = $("#reportMonth").val();
  var productionItems = [
    {
      customerId: "Vendor Unique Identifier",
      customerFirstName: "Customer First Name",
      customerLastName: "Customer Last Name",
      customerAddressType: "Address Type",
      customerAddress1: "Address Line1",
      customerAddress2: "Address Line2",
      customerAddress3: "Address Line3",
      customerCity: "City",
      customerProvience: "Province",
      customerPostalCode: "Postal Code",
      customerCountry: "Country",
      customerPhone: "Phone Number",
      customerPhoneType: "Phone Type",
      customerEmail: "Email Address",
      orderDate: "Date",
      saleAmnt: "Sale Amount",
      merchAmnt: "Merchandise Amount",
      hstAmnt: "HST Amount",
      shippingAmnt: "Shipping Amount",
      paybackToSK: "BOT Pay to SickKids",
      orderNumber: "Order Number",
      hstTaxRegion: "HST Tax Region",
      hstPercent: "HST %",
      merchDetails: "Merchandise Purchase Details",
      paymentMethod: "Payment Method",
      cardType: "CardType",
      authCode: "AuthorizationCode",
      trackingNumber: "Tracking Number",
    },
  ];
  var time = 0;
  setTimeout(function () {
    paybackToSKArr1 = [];
    lineArr = [];
    shippingAmountArr = [];
    $("#rewardOrderList .row").each(function (index) {
      var orderThis = $(this);
      var orderIndex = index;
      setTimeout(function () {
        if (
          orderThis.find(".orderDate span").text().split(" ")[0] ==
          selectedMonth
        ) {
          orderNumber = orderThis.find(".poNumber span").text();
          var months = [
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
            "Novenber",
            "December",
          ];
          orderDateMonth = orderThis
            .find(".orderDate span")
            .text()
            .split(" ")[0];
          month1 = months.indexOf(orderDateMonth) + 1;
          date1 = orderThis
            .find(".orderDate span")
            .text()
            .split(" ")[1]
            .match(/\d/g)
            .join("");
          year1 = orderThis.find(".orderDate span").text().split(" ")[2];
          orderDate = month1 + "/" + date1 + "/" + year1;
          cardType = orderThis.find(".cardType").text();
          authCode = orderThis.find(".paymentCode").text();
          paymentMethod = orderThis.find(".paymentMethod").text();
          $("#generatingReportModal #generatingPOValue span").text(orderNumber);

          $.ajax({
            url: ngrokUrl + "getOrdersFromMachine",
            type: "POST",
            async: false,
            data: JSON.stringify({
              orderPo: orderNumber,
            }),
            contentType: "application/json",
            success: function (machineData) {
              var x2js = new X2JS();
              var xmlText = machineData;
              var jsonObj = x2js.xml_str2json(xmlText);
              var requiredXML = jsonObj.string;
              var parseRequiredXML = parseXml(requiredXML);
              var newConversion = xml2json(parseRequiredXML).replace(
                "undefined",
                ""
              );
              var returnMachineData = JSON.parse(newConversion);
              if (returnMachineData.Status == undefined) {
                var itemsData = returnMachineData.Request.Item;
                var userData = returnMachineData.Request;
                var shippingInfo = returnMachineData.Request.ShipTo;
                var shipmentInfo = returnMachineData.Request.shipmentInfo;
              } else {
                var itemsData = returnMachineData.Status.Request.Item;
                var userData = returnMachineData.Status.Request;
                var shippingInfo = returnMachineData.Status.Request.ShipTo;
                var shipmentInfo = returnMachineData.Status.shipmentInfo;
              }
              if (shipmentInfo == undefined) {
                trackingData = "";
              } else {
                trackingData = shipmentInfo.trackingNumber;
              }

              customerFirstName = shippingInfo.FirstName;
              if (shippingInfo.LastName == null) {
                customerLastName = "";
              } else {
                customerLastName = shippingInfo.LastName;
              }
              customerAddressType = "Home";
              customerAddress1 = shippingInfo.Adrx1;
              if (shippingInfo.Adrx2 == null) {
                customerAddress2 = "";
              } else {
                customerAddress2 = shippingInfo.Adrx2;
              }
              customerAddress3 = "";
              customerCity = shippingInfo.City;
              customerPostalCode = shippingInfo.Zip;
              customerCountry = shippingInfo.Country;
              customerProvience = shippingInfo.State;
              customerPhone = "";
              customerPhoneType = "";
              customerEmail = shippingInfo.Email;

              customerId = orderNumber.split("-")[2];

              hstTaxRegion = shippingInfo.State;
              if (hstTaxRegion == "Alberta") {
                hstPercent = 5;
              } else if (hstTaxRegion == "British Columbia") {
                hstPercent = 12;
              } else if (hstTaxRegion == "Manitoba") {
                hstPercent = 12;
              } else if (hstTaxRegion == "New Brunswick") {
                hstPercent = 15;
              } else if (hstTaxRegion == "Prince Edward Island") {
                hstPercent = 15;
              } else if (hstTaxRegion == "Newfoundland and Labrador") {
                hstPercent = 15;
              } else if (hstTaxRegion == "Nova Scotia") {
                hstPercent = 15;
              } else if (hstTaxRegion == "Ontario") {
                hstPercent = 13;
              } else if (hstTaxRegion == "Quebec") {
                hstPercent = 14.9;
              } else if (hstTaxRegion == "Saskatchewan") {
                hstPercent = 11;
              } else if (hstTaxRegion == "Northwest Territories") {
                hstPercent = 5;
              } else if (hstTaxRegion == "Nunavut") {
                hstPercent = 5;
              } else if (hstTaxRegion == "Yukon") {
                hstPercent = 5;
              } else {
                hstPercent = 0;
              }

              if (Array.isArray(itemsData)) {
                var shippingPriceArr = [];
                var merchDetailArr = [];
                var merchAmntArr = [];
                //var totalPaybackToSKArr = [];
                for (var i = 0; i < itemsData.length; i++) {
                  if (i == 0) {
                    quantity = itemsData[i].Qty;
                    if (customerCountry == "CA") {
                      extraItemPrice = 2.0;
                      if (quantity == 1) {
                        shippingAmnt = 8.95;
                      } else {
                        extraQuantity = quantity - 1;
                        extraQuantityPrice = extraQuantity * extraItemPrice;
                        shippingAmnt = 8.95 + extraQuantityPrice;
                      }
                    } else if (customerCountry == "US") {
                      extraItemPrice = 2.0;
                      if (quantity == 1) {
                        shippingAmnt = 7.55;
                      } else {
                        extraQuantity = quantity - 1;
                        extraQuantityPrice = extraQuantity * extraItemPrice;
                        shippingAmnt = 7.55 + extraQuantityPrice;
                      }
                    } else {
                      extraItemPrice = 2.95;
                      if (quantity == 1) {
                        shippingAmnt = 21.95;
                      } else {
                        extraQuantity = quantity - 1;
                        extraQuantityPrice = extraQuantity * extraItemPrice;
                        shippingAmnt = 21.95 + extraQuantityPrice;
                      }
                    }
                    shippingPriceArr.push(shippingAmnt);
                  } else if (i > 0) {
                    quantity = itemsData[i].Qty;
                    if (customerCountry == "CA") {
                      extraItemPrice = 2.0;
                      shippingAmnt = quantity * extraItemPrice;
                    } else if (customerCountry == "US") {
                      extraItemPrice = 2.0;
                      shippingAmnt = quantity * extraItemPrice;
                    } else {
                      extraItemPrice = 2.95;
                      shippingAmnt = quantity * extraItemPrice;
                    }
                    shippingPriceArr.push(shippingAmnt);
                  }
                  console.log(itemsData[i].SKU);
                  if (
                    itemsData[i].SKU.split("-")[0] == "Adult_Tshirt" ||
                    itemsData[i].SKU.split("-")[0] == "Youth_Tshirt"
                  ) {
                    merchDetails = itemsData[i].Qty + " " + itemsData[i].SKU;
                    merchDetailArr.push(merchDetails);

                    merchAmnt = 25 * itemsData[i].Qty;
                    merchAmntArr.push(merchAmnt);

                    /*if (itemsData[i].Size == "2XL") {
                      paybackToSK = 19.99 - 13.46;
                      totalPaybackToSK = paybackToSK * itemsData[i].Qty;
                      totalPaybackToSKArr.push(totalPaybackToSK);
                    } else {
                      if (itemsData[i].Color == "Sapphire") {
                        paybackToSK = 19.99 - 1;
                        totalPaybackToSK = paybackToSK * itemsData[i].Qty;
                        totalPaybackToSKArr.push(totalPaybackToSK);
                      } else if (itemsData[i].Color == "Royal_Blue") {
                        if (itemsData[i].Size == "XL") {
                          paybackToSK = 19.99 - 10.85;
                          totalPaybackToSK = paybackToSK * itemsData[i].Qty;
                          totalPaybackToSKArr.push(totalPaybackToSK);
                        } else if (itemsData[i].Size == "2XL") {
                          paybackToSK = 19.99 - 13.46;
                          totalPaybackToSK = paybackToSK * itemsData[i].Qty;
                          totalPaybackToSKArr.push(totalPaybackToSK);
                        } else {
                          paybackToSK = 19.99 - 1;
                          totalPaybackToSK = paybackToSK * itemsData[i].Qty;
                          totalPaybackToSKArr.push(totalPaybackToSK);
                        }
                      }
                    }*/
                  } else if (itemsData[i].SKU.split("-")[0] == "Hat") {
                    merchDetails = itemsData[i].Qty + " " + itemsData[i].SKU;
                    merchDetailArr.push(merchDetails);

                    merchAmnt = 35 * itemsData[i].Qty;
                    merchAmntArr.push(merchAmnt);

                    /*paybackToSK = 15.99 - 1;
                    totalPaybackToSK = paybackToSK * itemsData[i].Qty;
                    totalPaybackToSKArr.push(totalPaybackToSK);*/
                  } else if (
                    itemsData[i].SKU.split("-")[0] == "Adult_Hoodie" ||
                    itemsData[i].SKU.split("-")[0] == "Youth_Hoodie"
                  ) {
                    merchDetails = itemsData[i].Qty + " " + itemsData[i].SKU;
                    merchDetailArr.push(merchDetails);

                    merchAmnt = 50 * itemsData[i].Qty;
                    merchAmntArr.push(merchAmnt);
                  }
                }
                /*totalPaybackToSK = totalPaybackToSKArr.reduce(
                  (a, b) => a + b,
                  0
                );
                paybackToSKArr1.push(totalPaybackToSK);*/
                merchAmnt = merchAmntArr.reduce((a, b) => a + b, 0);
                shippingAmnt = shippingPriceArr.reduce((a, b) => a + b, 0);
                merchDetails = merchDetailArr.join("\n");

                hstAmnt = (hstPercent * (merchAmnt + shippingAmnt)) / 100;
                saleAmnt = merchAmnt + shippingAmnt + hstAmnt;

                for (var c = 0; c < countryData.length; c++) {
                  if (customerCountry == countryData[c].code2) {
                    customerCountry = countryData[c].name;
                    if (
                      customerProvience != null &&
                      customerProvience != "" &&
                      customerProvience != undefined
                    ) {
                      for (s = 0; s < countryData[c].states.length; s++) {
                        if (
                          customerProvience == countryData[c].states[s].name
                        ) {
                          customerProvience = countryData[c].states[s].code;
                        }
                      }
                    }
                  }
                }

                var dataToInsertInProduction = {
                  customerId: customerId,
                  customerFirstName: customerFirstName,
                  customerLastName: customerLastName,
                  customerAddressType: customerAddressType,
                  customerAddress1: customerAddress1,
                  customerAddress2: customerAddress2,
                  customerAddress3: customerAddress3,
                  customerCity: customerCity,
                  customerProvience: customerProvience,
                  customerPostalCode: customerPostalCode,
                  customerCountry: customerCountry,
                  customerPhone: customerPhone,
                  customerPhoneType: customerPhoneType,
                  customerEmail: customerEmail,
                  orderDate: orderDate,
                  saleAmnt: "$" + saleAmnt.toFixed(2),
                  merchAmnt: "$" + merchAmnt.toFixed(2),
                  hstAmnt: "$" + hstAmnt.toFixed(2),
                  shippingAmnt: "$" + shippingAmnt.toFixed(2),
                  //paybackToSK: "$" + totalPaybackToSK.toFixed(2),
                  paybackToSK: "$0.00",
                  orderNumber: orderNumber,
                  hstTaxRegion: customerProvience,
                  hstPercent: hstPercent + "%",
                  merchDetails: merchDetails,
                  paymentMethod: paymentMethod,
                  cardType: cardType,
                  authCode: authCode,
                  trackingNumber: trackingData,
                };
                productionItems.push(dataToInsertInProduction);
              } else {
                quantity = itemsData.Qty;
                if (customerCountry == "CA") {
                  extraItemPrice = 2.0;
                  if (quantity == 1) {
                    shippingAmnt = 8.95;
                  } else {
                    extraQuantity = quantity - 1;
                    extraQuantityPrice = extraQuantity * extraItemPrice;
                    shippingAmnt = 8.95 + extraQuantityPrice;
                  }
                } else if (customerCountry == "US") {
                  extraItemPrice = 2.0;
                  if (quantity == 1) {
                    shippingAmnt = 7.55;
                  } else {
                    extraQuantity = quantity - 1;
                    extraQuantityPrice = extraQuantity * extraItemPrice;
                    shippingAmnt = 7.55 + extraQuantityPrice;
                  }
                } else {
                  extraItemPrice = 2.95;
                  if (quantity == 1) {
                    shippingAmnt = 21.95;
                  } else {
                    extraQuantity = quantity - 1;
                    extraQuantityPrice = extraQuantity * extraItemPrice;
                    shippingAmnt = 21.95 + extraQuantityPrice;
                  }
                }
                if (
                  itemsData.SKU.split("-")[0] == "Adult_Tshirt" ||
                  itemsData.SKU.split("-")[0] == "Youth_Tshirt"
                ) {
                  merchDetails = itemsData.Qty + " " + itemsData.SKU;
                  merchAmnt = 25 * itemsData.Qty;

                  /*if (itemsData.Size == "2XL") {
                    paybackToSK = 19.99 - 13.46;
                    totalPaybackToSK = paybackToSK * itemsData.Qty;
                  } else {
                    if (itemsData.Color == "Sapphire") {
                      paybackToSK = 19.99 - 1;
                      totalPaybackToSK = paybackToSK * itemsData.Qty;
                    } else if (itemsData.Color == "Royal_Blue") {
                      if (itemsData.Size == "XL") {
                        paybackToSK = 19.99 - 10.85;
                        totalPaybackToSK = paybackToSK * itemsData.Qty;
                      } else if (itemsData.Size == "2XL") {
                        paybackToSK = 19.99 - 13.46;
                        totalPaybackToSK = paybackToSK * itemsData.Qty;
                      } else {
                        paybackToSK = 19.99 - 1;
                        totalPaybackToSK = paybackToSK * itemsData.Qty;
                      }
                    }
                  }*/
                } else if (itemsData.SKU.split("-")[1] == "Hat") {
                  merchDetails = itemsData.Qty + " " + itemsData.SKU;
                  merchAmnt = 35 * itemsData.Qty;
                  /*paybackToSK = 15.99 - 1;
                  totalPaybackToSK = paybackToSK * itemsData.Qty;*/
                } else if (
                  itemsData.SKU.split("-")[0] == "Adult_Hoodie" ||
                  itemsData.SKU.split("-")[0] == "Youth_Hoodie"
                ) {
                  merchDetails = itemsData.Qty + " " + itemsData.SKU;
                  merchAmnt = 50 * itemsData.Qty;
                }
                /*paybackToSKArr1.push(totalPaybackToSK);*/
                hstAmnt = (hstPercent * (merchAmnt + shippingAmnt)) / 100;
                saleAmnt = merchAmnt + shippingAmnt + hstAmnt;

                for (var c = 0; c < countryData.length; c++) {
                  if (customerCountry == countryData[c].code2) {
                    customerCountry = countryData[c].name;
                    if (
                      customerProvience != null &&
                      customerProvience != "" &&
                      customerProvience != undefined
                    ) {
                      for (s = 0; s < countryData[c].states.length; s++) {
                        if (
                          customerProvience == countryData[c].states[s].name
                        ) {
                          customerProvience = countryData[c].states[s].code;
                        }
                      }
                    }
                  }
                }

                var dataToInsertInProduction = {
                  customerId: customerId,
                  customerFirstName: customerFirstName,
                  customerLastName: customerLastName,
                  customerAddressType: customerAddressType,
                  customerAddress1: customerAddress1,
                  customerAddress2: customerAddress2,
                  customerAddress3: customerAddress3,
                  customerCity: customerCity,
                  customerProvience: customerProvience,
                  customerPostalCode: customerPostalCode,
                  customerCountry: customerCountry,
                  customerPhone: customerPhone,
                  customerPhoneType: customerPhoneType,
                  customerEmail: customerEmail,
                  orderDate: orderDate,
                  saleAmnt: "$" + saleAmnt.toFixed(2),
                  merchAmnt: "$" + merchAmnt,
                  hstAmnt: "$" + hstAmnt.toFixed(2),
                  shippingAmnt: "$" + shippingAmnt,
                  //paybackToSK: "$" + totalPaybackToSK.toFixed(2),
                  paybackToSK: "$0.00",
                  orderNumber: orderNumber,
                  hstTaxRegion: customerProvience,
                  hstPercent: hstPercent + "%",
                  merchDetails: merchDetails,
                  paymentMethod: paymentMethod,
                  cardType: cardType,
                  authCode: authCode,
                  trackingNumber: trackingData,
                };
                productionItems.push(dataToInsertInProduction);
              }
            },
          });
        }
        if (orderIndex == $("#rewardOrderList .row").length - 1) {
          $("#generatingReportModal").modal("hide");
          if (productionItems.length == 1) {
            $("#errorMsg")
              .modal("show")
              .find(".modal-body p")
              .text("No Order Entry is present for selected Month!!");
          } else {
            var reportData = JSON.stringify(productionItems);
            var ReportTitle =
              "GetLoudShop-" + $("#reportMonth").val() + "-Report";
            JSONToCSVConvertor(reportData, ReportTitle);
          }
        }
      }, time);
      time += 2000;
    });
  }, 1000);
}

function renderCSVfile(oEvent) {
  var oFile = oEvent.target.files[0];
  var reader = new FileReader();
  var result = {};

  reader.onload = function (e) {
    var data = e.target.result;
    data = new Uint8Array(data);
    var workbook = XLSX.read(data, { type: "array", cellDates: true });
    var result = {};
    workbook.SheetNames.forEach(function (sheetName) {
      var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });
      if (roa.length) result[sheetName] = roa;
    });

    var keys = Object.keys(result);
    var needReport = result[keys[0]];

    var requiredData = needReport;

    for (var k = 0; k < needReport[0].length; k++) {
      if (needReport[0][k] == "Customer_FirstName") {
        custFirstName = k;
      }
      if (needReport[0][k] == "Customer_LastName") {
        custLastName = k;
      }
      if (needReport[0][k] == "Customer_LastName") {
        custLastName = k;
      }
      if (needReport[0][k] == "Customer_Email") {
        custEmail = k;
      }
      if (needReport[0][k] == "Customer_Phone") {
        custPhone = k;
      }
      if (needReport[0][k] == "Customer_Address1") {
        custAddress1 = k;
      }
      if (needReport[0][k] == "Customer_Address2") {
        custAddress2 = k;
      }
      if (needReport[0][k] == "Customer_City") {
        custCity = k;
      }
      if (needReport[0][k] == "Customer_State") {
        custState = k;
      }
      if (needReport[0][k] == "Customer_Zip") {
        custZip = k;
      }
      if (needReport[0][k] == "Customer_Country") {
        custCountry = k;
      }
      if (needReport[0][k] == "Reward_Amount") {
        rewardAmnt = k;
      }
      if (needReport[0][k] == "Eligible_Reward_Products") {
        rewardProd = k;
      }
    }
    if (needReport[1][custEmail] == undefined) {
      $("#errorMsg")
        .modal("show")
        .find(".modal-body p")
        .text("Fault in Excel File, Please contact Printify!!");
    } else {
      for (var i = 0; i < needReport.length; i++) {
        if (i != 0) {
          if (needReport[i][custEmail] != undefined) {
            const search = ",";
            const replaceWith = ", ";
            var html =
              '<div class="row lineData" style="position:relative;margin: 0px;padding: 0px 0px;border-bottom: 1px solid #ccc;font-size: 12px;">';
            html +=
              '<p class="userAlreadyPresent" style="display:none;position: absolute;bottom: 0;margin: 0;padding: 5px 10px;background-color: orange;color: #fff;border-top-right-radius: 5px;"><i class="far fa-check-circle"></i> User Updated</p>';
            html +=
              '<p class="userSubmitted" style="display:none;position: absolute;bottom: 0;margin: 0;padding: 5px 10px;background-color: #3fcef1;color: #fff;border-top-right-radius: 5px;"><i class="far fa-check-circle"></i> User Submitted</p>';
            html +=
              '<div class="col-1 custName" style="padding: 27px 15px;"><span data-toggle="tooltip" title="' +
              needReport[i][custFirstName].split(search).join(replaceWith) +
              '" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
              needReport[i][custFirstName].split(search).join(replaceWith) +
              "</span></div>";

            html +=
              '<div class="col-1 custLName" style="padding: 27px 15px;"><span data-toggle="tooltip" title="' +
              needReport[i][custLastName] +
              " " +
              needReport[i][custLastName] +
              '" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
              needReport[i][custLastName] +
              "</span></div>";

            html +=
              '<div class="col-1 custEmail" style="padding: 27px 15px;"><span data-toggle="tooltip" title="' +
              needReport[i][custEmail] +
              '" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
              needReport[i][custEmail] +
              "</span></div>";

            if (needReport[i][custPhone] != undefined) {
              html +=
                '<div class="col-1 custPhone" style="padding: 27px 15px;"><span data-toggle="tooltip" title="' +
                needReport[i][custPhone] +
                '" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
                needReport[i][custPhone] +
                "</span></div>";
            } else {
              html +=
                '<div class="col-1 custPhone" style="padding: 27px 15px;"><span data-toggle="tooltip" title="" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;"></span></div>';
            }

            if (needReport[i][custAddress1] != undefined) {
              html +=
                '<div class="col-1 custAddress1" style="padding: 27px 15px;"><span data-toggle="tooltip" title="' +
                needReport[i][custAddress1] +
                '" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
                needReport[i][custAddress1] +
                "</span></div>";
            } else {
              html +=
                '<div class="col-1 custPhone" style="padding: 27px 15px;"><span data-toggle="tooltip" title="" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;"></span></div>';
            }

            if (needReport[i][custCity] != undefined) {
              html +=
                '<div class="col-1 custCity" style="padding: 27px 15px;"><span data-toggle="tooltip" title="' +
                needReport[i][custCity] +
                '" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
                needReport[i][custCity] +
                "</span></div>";
            } else {
              html +=
                '<div class="col-1 custPhone" style="padding: 27px 15px;"><span data-toggle="tooltip" title="" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;"></span></div>';
            }

            if (needReport[i][custState] != undefined) {
              html +=
                '<div class="col-1 custState" style="padding: 27px 15px;"><span data-toggle="tooltip" title="' +
                needReport[i][custState] +
                '" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
                needReport[i][custState] +
                "</span></div>";
            } else {
              html +=
                '<div class="col-1 custPhone" style="padding: 27px 15px;"><span data-toggle="tooltip" title="" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;"></span></div>';
            }

            if (needReport[i][custZip] != undefined) {
              html +=
                '<div class="col-1 custZip" style="padding:27px 15px;"><span data-toggle="tooltip" title="' +
                needReport[i][custZip] +
                '" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
                needReport[i][custZip] +
                "</span></div>";
            } else {
              html +=
                '<div class="col-1 custPhone" style="padding: 27px 15px;"><span data-toggle="tooltip" title="" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;"></span></div>';
            }

            if (needReport[i][custCountry] != undefined) {
              html +=
                '<div class="col-1 custCountry" style="padding: 27px 15px;"><span data-toggle="tooltip" title="' +
                needReport[i][custCountry] +
                '" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
                needReport[i][custCountry] +
                "</span></div>";
            } else {
              html +=
                '<div class="col-1 custPhone" style="padding: 27px 15px;"><span data-toggle="tooltip" title="" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;"></span></div>';
            }

            html +=
              '<div class="col-1 rewardAmnt" style="padding: 27px 15px;"><span data-toggle="tooltip" title="' +
              needReport[i][rewardAmnt] +
              '" style="display: inline-block;width: 75px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
              needReport[i][rewardAmnt] +
              "</span></div>";

            html +=
              '<div class="col-1 rewardProd" style="padding: 27px 15px;"><span data-toggle="tooltip" title="' +
              needReport[i][rewardProd] +
              '" style="display: inline-block;width: 100px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
              needReport[i][rewardProd].replace(/,/g, "<br>") +
              "</span></div>";

            html += "</div>";
            $("#feedData").append(html);
          }
        }
        if (i == needReport.length - 1) {
          $("#rewardCustomerUpload").prop("disabled", false);
        }
        $(function () {
          $('[data-toggle="tooltip"]').tooltip();
        });
      }
    }
  };
  reader.readAsArrayBuffer(oFile);
}

function saveRewardUser() {
  $("#savingNewUser").modal({
    backdrop: "static",
  });
  var time = 0;
  setTimeout(function () {
    repeateUser = [];
    $("#feedData .lineData").each(function (index) {
      var userThis = $(this);
      var userIndex = index;
      setTimeout(function () {
        $("#rewardProd").html("");
        var rewardPin = Math.floor(Math.random() * 10000000 + 1);
        randomCode = "SKGL" + rewardPin;
        var paswword = Math.floor(Math.random() * 10000000 + 1);
        userPass = "SKGL@" + paswword + "-VS";

        const genRanHex = (size) =>
          [...Array(size)]
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join("");
        userToken = genRanHex(24);

        currUser = userThis.find(".custEmail span").text();
        currMajorUser = userThis.find(".custEmail span").text();
        currUserName = userThis.find(".custName span").text();
        currUserLName = userThis.find(".custLName span").text();
        currUserPoints = userThis.find(".rewardAmnt span").text();
        currRewardProd = userThis
          .find(".rewardProd span")
          .attr("data-original-title")
          .split(",");
        currUserShippingInfo = {
          address1: userThis.find(".custAddress1 span").text(),
          city: userThis.find(".custCity span").text(),
          state: userThis.find(".custState span").text(),
          zip: userThis.find(".custZip span").text(),
          country: userThis.find(".custCountry span").text(),
        };

        for (var i = 0; i < currRewardProd.length; i++) {
          var html =
            "<li><b>" +
            currRewardProd[i].replace(/_/g, " ").toUpperCase() +
            "</b></li>";
          $("#rewardProd").append(html);
        }

        $("#savingNewUser #currSavingUser span").text(currUser);

        var mailData = {
          email: currUser,
          name: currUserName.split(),
          html: $("#rewardProd").html(),
          code: randomCode,
          password: userPass,
          amount: currUserPoints,
          userToken: userToken,
        };

        $.ajax({
          url: ngrokUrl + "checkSickKidsRewardCustomer",
          type: "POST",
          async: false,
          data: JSON.stringify(mailData),
          contentType: "application/json",
          success: function (checkSickKidsRewardCustomer) {
            if (checkSickKidsRewardCustomer.length <= 0) {
              $.ajax({
                url: ngrokUrl + "notifySickKidsCustomerForRewards",
                type: "POST",
                async: false,
                data: JSON.stringify(mailData),
                contentType: "application/json",
                success: function (notifySickKidsCustomerForRewards) {
                  var storeData = {
                    email: currUser,
                    memail: currMajorUser,
                    name: currUserName,
                    lastName: currUserLName,
                    code: randomCode,
                    codeStatus: "Active",
                    password: userPass,
                    amount: currUserPoints,
                    rewardProd: currRewardProd,
                    emailResponse: notifySickKidsCustomerForRewards,
                    shipInfo: currUserShippingInfo,
                    orders: [],
                    userToken: userToken,
                  };
                  $.ajax({
                    url: ngrokUrl + "addSickKidsRewardCustomer",
                    type: "POST",
                    async: false,
                    data: JSON.stringify({ data: storeData }),
                    contentType: "application/json",
                    success: function (addSickKidsRewardCustomer) {
                      userThis.addClass("userInsert");
                      repeateUser.push("UserPresent");
                    },
                  });
                },
              });
              userThis.addClass("userInsert");
            } else {
              if (checkSickKidsRewardCustomer[0].codeStatus == "In-Active") {
                var rewardPin = Math.floor(Math.random() * 10000000 + 1);
                randomCode = "SKGL" + rewardPin;
                var dataId = checkSickKidsRewardCustomer[0]._id;
                var rewardProdArr = currRewardProd;
                var amountArr = [];
                for (var i = 0; i < rewardProdArr.length; i++) {
                  if (rewardProdArr[i].split(" ")[1] == "Tshirt") {
                    amountArr.push(Number(rewardProdArr[i].split(" ")[0] * 25));
                  }
                  if (rewardProdArr[i].split(" ")[1] == "Hat") {
                    amountArr.push(Number(rewardProdArr[i].split(" ")[0] * 35));
                  }
                  if (rewardProdArr[i].split(" ")[1] == "Hoodie") {
                    amountArr.push(Number(rewardProdArr[i].split(" ")[0] * 50));
                  }
                }
                var totalAmnt = amountArr.reduce((a, b) => a + b, 0);
                var dataToSend = {
                  randomCode,
                  dataId,
                  rewardProdArr,
                  totalAmnt,
                };
                $.ajax({
                  url: ngrokUrl + "updateSickKidsRewardCustomerItems",
                  type: "POST",
                  async: false,
                  data: JSON.stringify(dataToSend),
                  contentType: "application/json",
                  success: function (updateSickKidsRewardCustomerItems) {
                    var mailData = {
                      email: checkSickKidsRewardCustomer[0].email,
                      name: checkSickKidsRewardCustomer[0].name,
                      html: userThis.find(".rewardProd").html(),
                      code: randomCode,
                      password: checkSickKidsRewardCustomer[0].password,
                      amount: totalAmnt,
                    };

                    $.ajax({
                      url: ngrokUrl + "notifySickKidsCustomerForRewards",
                      type: "POST",
                      async: false,
                      data: JSON.stringify(mailData),
                      contentType: "application/json",
                      success: function (notifySickKidsCustomerForRewards) {},
                    });
                  },
                });
              } else if (
                checkSickKidsRewardCustomer[0].codeStatus == "Active"
              ) {
                var rewardPin = Math.floor(Math.random() * 10000000 + 1);
                randomCode = "SKGL" + rewardPin;
                var dataId = checkSickKidsRewardCustomer[0]._id;
                var oldRewardPrdArr = checkSickKidsRewardCustomer[0].rewardProd;
                var newRewardProdArr = currRewardProd;
                var newRewardArr = [];
                for (var i = 0; i < newRewardProdArr.length; i++) {
                  var newProd = newRewardProdArr[i].split(" ")[1];
                  var newProdQty = Number(newRewardProdArr[i].split(" ")[0]);
                  newRewardArr.push({
                    prodQty: newProdQty,
                    prod: newProd,
                  });
                }
                var oldRewardArr = [];
                for (var j = 0; j < oldRewardPrdArr.length; j++) {
                  var oldProd = oldRewardPrdArr[j].split(" ")[1];
                  var oldProdQty = Number(oldRewardPrdArr[j].split(" ")[0]);
                  oldRewardArr.push({
                    prodQty: oldProdQty,
                    prod: oldProd,
                  });
                }
                var mergedArr = oldRewardArr.concat(newRewardArr);
                if (mergedArr && mergedArr.length) {
                  var result = [];

                  for (var i = 0; i < mergedArr.length; i++) {
                    var isExist = result.find(function (ele) {
                      return ele.prod === mergedArr[i].prod;
                    });

                    if (isExist) {
                      continue;
                    }

                    var countArr = mergedArr.filter(function (ele) {
                      return ele.prod === mergedArr[i].prod;
                    });

                    var count = 0;
                    for (var j = 0; j < countArr.length; j++) {
                      count += countArr[j].prodQty;
                    }

                    result.push({
                      prodQty: count,
                      prod: mergedArr[i].prod,
                    });
                  }

                  var requiredFormatArr = [];
                  for (var k = 0; k < result.length; k++) {
                    requiredFormatArr.push(
                      result[k].prodQty + " " + result[k].prod
                    );
                  }
                }

                userThis.find(".rewardProd").html("");
                for (var k = 0; k < requiredFormatArr.length; k++) {
                  var html =
                    '<span data-toggle="tooltip" title="' +
                    requiredFormatArr[k] +
                    '" style="display: inline-block;width: 100px;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;">' +
                    requiredFormatArr[k].replace(/,/g, "<br>") +
                    "</span><br>";
                  userThis.find(".rewardProd").append(html);
                }

                var amountArr = [];
                for (var i = 0; i < requiredFormatArr.length; i++) {
                  if (requiredFormatArr[i].split(" ")[1] == "Tshirt") {
                    amountArr.push(
                      Number(requiredFormatArr[i].split(" ")[0] * 25)
                    );
                  }
                  if (requiredFormatArr[i].split(" ")[1] == "Hat") {
                    amountArr.push(
                      Number(requiredFormatArr[i].split(" ")[0] * 35)
                    );
                  }
                  if (requiredFormatArr[i].split(" ")[1] == "Hoodie") {
                    amountArr.push(
                      Number(requiredFormatArr[i].split(" ")[0] * 50)
                    );
                  }
                }
                var totalAmnt = amountArr.reduce((a, b) => a + b, 0);

                var dataToSend = {
                  randomCode,
                  dataId,
                  rewardProdArr: requiredFormatArr,
                  totalAmnt,
                };
                $.ajax({
                  url: ngrokUrl + "updateSickKidsRewardCustomerItems",
                  type: "POST",
                  async: false,
                  data: JSON.stringify(dataToSend),
                  contentType: "application/json",
                  success: function (updateSickKidsRewardCustomerItems) {
                    var mailData = {
                      email: checkSickKidsRewardCustomer[0].email,
                      name: checkSickKidsRewardCustomer[0].name,
                      html: userThis.find(".rewardProd").html(),
                      code: randomCode,
                      password: checkSickKidsRewardCustomer[0].password,
                      amount: totalAmnt,
                    };

                    $.ajax({
                      url: ngrokUrl + "notifySickKidsCustomerForRewards",
                      type: "POST",
                      async: false,
                      data: JSON.stringify(mailData),
                      contentType: "application/json",
                      success: function (notifySickKidsCustomerForRewards) {},
                    });
                  },
                });
              }
              userThis.addClass("userPresent");
              repeateUser.push("UserPresent");
            }
          },
        });

        if (userIndex == $("#feedData .lineData").length - 1) {
          $("#savingNewUser").modal("hide");
          if (repeateUser.length > 0) {
            $("#successMsg")
              .modal("show")
              .find(".modal-body p")
              .text("Some user updated in the database !!");
          } else {
            $("#successMsg")
              .modal("show")
              .find(".modal-body p")
              .text("New Users added to database and informed via E-Mail !!");
          }
        }
      }, time);
      time += 4000;
    });
  }, 1000);
}

function sendRewardEmail(e) {
  $(e).text("Sending...").prop("disabled", true);
  var userName = $("#selectedRewardUser").text();
  var rewardProd = [];
  $("#rewardProd li").each(function () {
    rewardProd.push($(this).find("b").text());
  });
  $.ajax({
    url: ngrokUrl + "getSKRewardUserDataInfo",
    type: "POST",
    data: JSON.stringify({
      currentUser: userName,
    }),
    contentType: "application/json",
    success: function (sickKidsUserData) {
      var mailData = {
        email: sickKidsUserData.email,
        name: sickKidsUserData.name,
        html: $("#rewardProd").html(),
        code: sickKidsUserData.code,
        password: sickKidsUserData.password,
        amount: sickKidsUserData.amount,
      };

      $.ajax({
        url: ngrokUrl + "notifySickKidsCustomerForRewards",
        type: "POST",
        async: false,
        data: JSON.stringify(mailData),
        contentType: "application/json",
        success: function (notifySickKidsCustomerForRewards) {
          $(e).text("Send Reward Email").prop("disabled", false);
          $("#successMsg")
            .modal("show")
            .find(".modal-body p")
            .text("Reward Customer informed via E-Mail !!");
        },
      });
    },
  });
}

function submitNewRewardItem(e) {
  $(e).text("Submitting...").prop("disabled", true);
  var rewardPin = Math.floor(Math.random() * 10000000 + 1);
  randomCode = "SKGL" + rewardPin;
  var dataId = $(e).attr("databaseid");
  var rewardProdArr = [];
  $("#editRewardProductsList li").each(function () {
    rewardProdArr.push($(this).text().trim());
  });
  var dataToSend = {
    randomCode,
    dataId,
    rewardProdArr,
  };
  if (rewardProdArr.length <= 0) {
    $("#errorMsg")
      .modal("show")
      .find(".modal-body p")
      .text("No reward Item is present !!");
    $(e).text("Submit").prop("disabled", false);
  } else {
    var amountArr = [];
    for (var i = 0; i < rewardProdArr.length; i++) {
      if (rewardProdArr[i].split(" ")[1] == "Tshirt") {
        amountArr.push(Number(rewardProdArr[i].split(" ")[0] * 25));
      }
      if (rewardProdArr[i].split(" ")[1] == "Hat") {
        amountArr.push(Number(rewardProdArr[i].split(" ")[0] * 35));
      }
      if (rewardProdArr[i].split(" ")[1] == "Hoodie") {
        amountArr.push(Number(rewardProdArr[i].split(" ")[0] * 50));
      }
    }
    var totalAmnt = amountArr.reduce((a, b) => a + b, 0);

    setTimeout(function () {
      $.ajax({
        url: ngrokUrl + "updateSickKidsRewardCustomerItems",
        type: "POST",
        async: false,
        data: JSON.stringify({ ...dataToSend, totalAmnt }),
        contentType: "application/json",
        success: function (updateSickKidsRewardCustomerItems) {
          // Update Data on Screen
          var userName = $("#selectedRewardUser").text();
          $("#thisRewardUserOrderlist").html(
            '<div class="preloader-wrapper big active" style="display:block;margin:20px auto;"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"<div class="circle"></div></div></div></div>'
          );
          $("#rewardProd").html("");
          $.ajax({
            url: ngrokUrl + "getSKRewardUserDataInfo",
            type: "POST",
            data: JSON.stringify({
              currentUser: userName,
            }),
            contentType: "application/json",
            success: function (sickKidsUserData) {
              $("#rewardUsername span").text(sickKidsUserData.email);
              $("#rewardPassword span").text(sickKidsUserData.password);
              if (sickKidsUserData.codeStatus == "Active") {
                $("#rewardCode span").html(
                  sickKidsUserData.code +
                    "<a style='float: right;text-decoration: underline;color: #33b5e5;' dataId=" +
                    sickKidsUserData._id +
                    " onclick='deactivateCode(this)'>De-Activate</a>"
                );
              } else {
                $("#rewardCode span").html(sickKidsUserData.code);
              }
              for (var i = 0; i < sickKidsUserData.rewardProd.length; i++) {
                var html =
                  "<li><b>" + sickKidsUserData.rewardProd[i].replace(/_/g, " ");
                ("</b></li>");
                $("#rewardProd").append(html);
              }

              $("#thisUserDelete").attr("databaseId", sickKidsUserData._id);
              $("#thisUserDelete").prop("disabled", false);
              $("#thisUserEmail").prop("disabled", false);
              $("#thisUserRewardProds").prop("disabled", false);
              $("#thisRewardUserOrderlist").html("");
              if (sickKidsUserData.orders.length == 0) {
                var html = '<div class="row" style="margin-top: 1rem;">';
                html +=
                  '<div class="col-12" style="margin: 8px 0px;font-size: 14px;color: #777;text-align:center;">No Order Present</div>';
                html += "</div>";
                $("#thisRewardUserOrderlist").append(html);
              } else {
                for (var i = 0; i < sickKidsUserData.orders.length; i++) {
                  var html = '<div class="row" style="margin-top: 1rem;">';
                  html +=
                    '<div class="col-3 orderDate" style="margin: 9px 0px;font-size: 14px;color: #777;">Date: <span style="font-size: 14px;color: #000;">' +
                    sickKidsUserData.orders[i].orderDate +
                    "</span></div>";
                  html +=
                    '<div class="col-3 poNumber" style="margin: 9px 0px;font-size: 14px;color: #777;overflow: hidden !important;text-overflow: ellipsis;white-space: nowrap;">PO: <span style="font-size: 14px;color: #000;">' +
                    sickKidsUserData.orders[i].orderNumber +
                    "</span></div>";
                  html +=
                    '<div class="col-4 databaseId" style="margin: 9px 0px;font-size: 14px;color: #777;">Database Id: <span style="font-size: 14px;color: #000;">' +
                    sickKidsUserData._id +
                    "</span></div>";

                  html +=
                    '<div class="col-2 text-center"><button class="btn btn-link" style="margin: 0;padding: 5px 10px;" data-toggle="modal" data-target="#orderInfo" onclick="getOrderInfo(this)"><i class="fas fa-info-circle" style="margin: 0;font-size: 20px;"></i></button></div>';
                  html += "</div></div>";
                  html += "<hr>";
                  $("#thisRewardUserOrderlist").append(html);
                  $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                  });
                }
              }

              // Send Reward Email
              var rewardProd = [];
              $("#rewardProd li").each(function () {
                rewardProd.push($(this).find("b").text());
              });
              $.ajax({
                url: ngrokUrl + "getSKRewardUserDataInfo",
                type: "POST",
                data: JSON.stringify({
                  currentUser: userName,
                }),
                contentType: "application/json",
                success: function (sickKidsUserData) {
                  var mailData = {
                    email: sickKidsUserData.email,
                    name: sickKidsUserData.name,
                    html: $("#rewardProd").html(),
                    code: sickKidsUserData.code,
                    password: sickKidsUserData.password,
                    amount: sickKidsUserData.amount,
                  };

                  $.ajax({
                    url: ngrokUrl + "notifySickKidsCustomerForRewards",
                    type: "POST",
                    async: false,
                    data: JSON.stringify(mailData),
                    contentType: "application/json",
                    success: function (notifySickKidsCustomerForRewards) {
                      $("#successMsg")
                        .modal("show")
                        .find(".modal-body p")
                        .text(
                          "Reward Item(s) updated and user informed via Email !!"
                        );
                      $(e).text("Submit").prop("disabled", false);
                      $("#editRewardProducts").modal("hide");
                    },
                  });
                },
              });
            },
          });
        },
      });
    }, 1000);
  }
}

/*---------------------------------------------------------------------------------------------------------------*/

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
  var CSV = "";
  //This condition will generate the Label/Header
  if (ShowLabel) {
    var row = "";

    //This loop will extract the label from 1st index of on array
    for (var index in arrData[0]) {
      //Now convert each value to string and comma-seprated
      row += index + ",";
    }
    row = row.slice(0, -1);
    //append Label row with line break
    CSV += row + "\r\n";
  }

  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
    var row = "";
    //2nd loop will extract each column and convert it in string comma-seprated
    for (var index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }
    row.slice(0, row.length - 1);
    //add a line break after each row
    CSV += row + "\r\n";
  }

  if (CSV == "") {
    alert("Invalid data");
    return;
  }

  //this trick will generate a temp "a" tag
  var link = document.createElement("a");
  link.id = "lnkDwnldLnk";

  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);

  var csv = CSV;
  blob = new Blob([csv], {
    type: "text/csv",
  });
  var csvUrl = window.webkitURL.createObjectURL(blob);
  fileName = ReportTitle + ".csv";

  $("#lnkDwnldLnk").attr({
    download: fileName,
    href: csvUrl,
  });

  $("#lnkDwnldLnk")[0].click();
  document.body.removeChild(link);
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
