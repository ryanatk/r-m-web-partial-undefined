(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.tellapart = factory();
  }
}(this, function () {
  var tellapart = {};
  /** *** TellApart for homepage **** */
  tellapart.homepage = function(boutiqueid, browserId){try{var b;
      var actionType = "pv";
      function d() {
          var action = TellApartCrumb.makeCrumbAction("Rvr7StMZSTQj",
              actionType);
          // set action and item attributes here
          action.setActionAttr("PageType", "ProductCategory");
          action.setActionAttr("ProductCategoryPath", "HOME");
          action.setUserId(browserId); // SET DYNAMICALLY
          action.setMerchantUserId(boutiqueid);
          action.finalize();
      };

      if("https:"==document.location.protocol)b=
          "https://sslt.tellapart.com/Rvr7StMZSTQj/crumb.js";else{b="http://static.tellaparts.com/Rvr7StMZSTQj/crumb.js"}if(actionType==="tx"){__cmbRunnable=d;document.write("\x3Cscript type='text/java"+"script' src='"+b+"'\x3E\x3C/script\x3E");__cmbLoaded=true}else{var a=document.createElement("script");a.src=b;a.onload=function(){__cmbLoaded=true;d()};a.onreadystatechange=function(){if(/loaded|complete/.test(a.readyState)){__cmbLoaded=true;d()}};var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a, s)}}catch(j){}
  }

  /** *** TellApart for Trend page **** */
  tellapart.trend = function(boutiqueid,browserId, trendSubCategory){try{var b;

      var actionType = "pv";
      function d() {
          var action = TellApartCrumb.makeCrumbAction("Rvr7StMZSTQj",
              actionType);
          // set action and item attributes here
          action.setActionAttr("PageType", "ProductCategory");
          action.setActionAttr("ProductCategoryPath", "Trend>"+trendSubCategory); // REPLACE
          // WITH
          // DYNAMIC
          // VALUE
          // (BREADCRUMB/NAVIGATION
          // ON
          // PAGE
          // DELIMITED
          // BY
          // GREATER
          // THAN
          // CHAR)
          action.setUserId(browserId);
          action.setMerchantUserId(boutiqueid);
          action.finalize();
      };

      if("https:"==document.location.protocol)b=
          "https://sslt.tellapart.com/Rvr7StMZSTQj/crumb.js";else{b="http://static.tellaparts.com/Rvr7StMZSTQj/crumb.js"}if(actionType==="tx"){__cmbRunnable=d;document.write("\x3Cscript type='text/java"+"script' src='"+b+"'\x3E\x3C/script\x3E");__cmbLoaded=true}else{var a=document.createElement("script");a.src=b;a.onload=function(){__cmbLoaded=true;d()};a.onreadystatechange=function(){if(/loaded|complete/.test(a.readyState)){__cmbLoaded=true;d()}};var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a, s)}}catch(j){}
  }

  /** *** TellApart for Search page **** */
  tellapart.search = function(boutiqueid,browserId, searchQuery){
      try{var b;
          var actionType = "pv";
          function d() {
              var action = TellApartCrumb.makeCrumbAction("Rvr7StMZSTQj",
                  actionType);
              // set action and item attributes here
              action.setActionAttr("PageType", "SearchResult");
              action.setActionAttr("SearchQuery", searchQuery); // REFLECTS
              // SEARCH STRING
              // ENTERED BY
              // USER
              action.setUserId(browserId);
              action.setMerchantUserId(boutiqueid);
              action.finalize();
          };

          if("https:"==document.location.protocol)b=
              "https://sslt.tellapart.com/Rvr7StMZSTQj/crumb.js";else{b="http://static.tellaparts.com/Rvr7StMZSTQj/crumb.js"}if(actionType==="tx"){__cmbRunnable=d;document.write("\x3Cscript type='text/java"+"script' src='"+b+"'\x3E\x3C/script\x3E");__cmbLoaded=true}else{var a=document.createElement("script");a.src=b;a.onload=function(){__cmbLoaded=true;d()};a.onreadystatechange=function(){if(/loaded|complete/.test(a.readyState)){__cmbLoaded=true;d()}};var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a, s)}}catch(j){}
  }

  /** *** TellApart for Brand page **** */
  tellapart.brand = function(boutiqueid,browserId, productCategory){try{var b;

      var actionType = "pv";
      function d() {
          var action = TellApartCrumb.makeCrumbAction("Rvr7StMZSTQj",
              actionType);
          // set action and item attributes here
          action.setActionAttr("PageType", "ProductCategory");
          action.setActionAttr("ProductCategoryPath", productCategory); // REPLACE
          // WITH
          // DYNAMIC
          // VALUE
          // (BREADCRUMB/NAVIGATION
          // ON
          // PAGE
          // DELIMITED
          // BY
          // GREATER
          // THAN
          // CHAR)
          action.setUserId(browserId);
          action.setMerchantUserId(boutiqueid);
          action.finalize();
      };

      if("https:"==document.location.protocol)b=
          "https://sslt.tellapart.com/Rvr7StMZSTQj/crumb.js";else{b="http://static.tellaparts.com/Rvr7StMZSTQj/crumb.js"}if(actionType==="tx"){__cmbRunnable=d;document.write("\x3Cscript type='text/java"+"script' src='"+b+"'\x3E\x3C/script\x3E");__cmbLoaded=true}else{var a=document.createElement("script");a.src=b;a.onload=function(){__cmbLoaded=true;d()};a.onreadystatechange=function(){if(/loaded|complete/.test(a.readyState)){__cmbLoaded=true;d()}};var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a, s)}}catch(j){}
  }

  /** *** TellApart for DisplayProduct page **** */
  tellapart.displayProduct = function(boutiqueid, browserId, productCategory, productCode){try{var b;

      var actionType = "pv";
      function d() {
          var action = TellApartCrumb.makeCrumbAction("Rvr7StMZSTQj",
              actionType);
          // set action and item attributes here
          action.setActionAttr("PageType", "Product");
          action.setActionAttr("ProductCategoryPath", productCategory); // REPLACE
          // WITH
          // DYNAMIC
          // VALUE
          // (BREADCRUMB/NAVIGATION
          // ON
          // PAGE
          // DELIMITED
          // BY
          // GREATER
          // THAN
          // CHAR)
          action.setActionAttr("SKU", productCode);
          action.setUserId(browserId);
          action.setMerchantUserId(boutiqueid);
          action.finalize();
      };

      if("https:"==document.location.protocol)b=
          "https://sslt.tellapart.com/Rvr7StMZSTQj/crumb.js";else{b="http://static.tellaparts.com/Rvr7StMZSTQj/crumb.js"}if(actionType==="tx"){__cmbRunnable=d;document.write("\x3Cscript type='text/java"+"script' src='"+b+"'\x3E\x3C/script\x3E");__cmbLoaded=true}else{var a=document.createElement("script");a.src=b;a.onload=function(){__cmbLoaded=true;d()};a.onreadystatechange=function(){if(/loaded|complete/.test(a.readyState)){__cmbLoaded=true;d()}};var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a, s)}}catch(j){}
  }

  /** *** TellApart for Login page **** */
  tellapart.login = function(boutiqueid,browserid, name, email, address, city, state, postcode, country){
      try{var b;
          var __cmbLoaded=false,__cmbRunnable=null;
          var actionType = "login";
          function d() {var b;
              var action = TellApartCrumb.makeCrumbAction("Rvr7StMZSTQj",
                  actionType);
              // set action and item attributes here
              action.setActionAttr("Name", name);
              action.setActionAttr("Email", email);
              action.setActionAttr("Address", address);
              action.setActionAttr("City", city);
              action.setActionAttr("State", state);
              action.setActionAttr("Postalcode", postcode);
              action.setActionAttr("Country", country);
              action.setMerchantUserId(boutiqueid);
              action.setUserId(browserid);
              action.finalize();
          };
          if("https:"==document.location.protocol)b=
              "https://sslt.tellapart.com/Rvr7StMZSTQj/crumb.js";else{b="http://static.tellaparts.com/Rvr7StMZSTQj/crumb.js"}if(actionType==="tx"){__cmbRunnable=d;document.write("\x3Cscript type='text/java"+"script' src='"+b+"'\x3E\x3C/script\x3E");__cmbLoaded=true}else{var a=document.createElement("script");a.src=b;a.onload=function(){__cmbLoaded=true;d()};a.onreadystatechange=function(){if(/loaded|complete/.test(a.readyState)){__cmbLoaded=true;d()}};var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a, s)}}catch(j){};
      if(typeof __cmbRunnable == 'function')
          __cmbRunnable();__cmbRunnable=null;
  }

  return tellapart;
}));
