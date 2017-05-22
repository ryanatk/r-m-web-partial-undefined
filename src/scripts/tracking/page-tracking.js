var $ = require('jquery');

module.exports = function(referrer) {
  referrer = referrer || window.rcProps && window.rcProps.referrer || null;

  function getViewportInfo(){
    var width = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
    var height = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
    if (width != undefined && height != undefined){
      return '&w='+width+'&h='+height;
    } else {
      return '';
    }
  }
  
  var cartAmount = '0.0';
  var cartContent = '[]';
  var uri = '/r/mobile/index_men.jsp' + '';

  if (uri.indexOf("EditorialList.jsp") != -1 || uri.indexOf("HotList.jsp") != -1 || uri.indexOf("HotListMobile.jsp") != -1
  || uri.indexOf("LookBook.jsp") != -1 || uri.indexOf("LookBookMobile.jsp") != -1) {
    uri = window.location.href
  }

  if(typeof(productCode) != 'undefined' && productCode != null) {
    uri = uri.replace("code=", "code_original=");
    if(uri.indexOf("?") != -1) {
      uri = uri + "&code=" + productCode;
    } else {
      uri = uri + "?code=" + productCode;
    }
  }


  var challengeVar = 3 - 1 % 4 / 1 + 5 * 9 + 2 - (6 - 5) + 3 * 5 + (8 - 9) * 7 - 9  - (3 + 2);

  var smsParams = '&dep=F'+'&boutique=&newFlag=&section=Home+Page&cat=&subcat=&subsubcat=&pageNum=1&prevInstockInvoice=null&prevPreorderInvoice=null&challenge=' + challengeVar;

  var dataToSend = "cC="+escape(cartContent)+"&cT="+escape(cartAmount)+"&r="+escape(referrer)+"&u="+escape(uri)+smsParams+getViewportInfo();



  if(typeof(addToCartFlag) != 'undefined' && addToCartFlag) {
    dataToSend += '&addToCart=true';
  }

  var submissionType = 'GET';
  if(dataToSend.length > 4700) {
    submissionType = 'POST';
  }

  // TODO: Premature exit so debugging is here
  // Remove when going to production
  return;
  return $.ajax({
    type: submissionType,
    url:'/r/mobile/PageTrack.jsp',
    data: dataToSend,
    cache: false,
    success: function(msg) { }
  });
}
