var pixelRatio = (window.devicePixelRatio >= 1.5) ? "high" : "normal";
var _gaq = _gaq || [];
//utm cookie variable is coming from classic GA
// put all pixels to "UA-40995435-4" is because that GA server side tracking still needs cookie value from classic ga javascript,
// so we just move all international traffic into test account UA-40995435-4
if (window.location.hostname=="www.revolveclothing.com"){
	_gaq.push(['_setAccount', 'UA-319064-1']);
}
else{
	_gaq.push(['_setAccount', 'UA-40995435-4']);
}

_gaq.push(['_setCustomVar', 3, 'Pixel Ratio', pixelRatio, 2 ]);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// fire google analytics UNIVERSAL for foreign domains
if(window.location.hostname=="www.revolveclothing.fr"
	|| window.location.hostname=="www.revolveclothing.es"
	|| window.location.hostname=="www.revolveclothing.co.jp"
	|| window.location.hostname=="www.revolveclothing.ru"
	|| window.location.hostname=="www.revolveclothing.com.au"
	|| window.location.hostname=="www.revolveclothing.cn"
    || window.location.hostname=="www.revolveclothing.com"
	|| window.location.hostname=="www.revolveclothing.com.br"
	|| window.location.hostname=="www.revolve.co.kr"){
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
}


if(window.location.hostname=="www.revolveclothing.com"){
    ga('create', 'UA-319064-20', 'revolveclothing.com');
    ga('send', 'pageview');
}
else if(window.location.hostname=="www.revolveclothing.fr"){
	ga('create', 'UA-319064-12', 'revolveclothing.fr');
	ga('send', 'pageview');
}
else if (window.location.hostname=="www.revolveclothing.es"){
	ga('create', 'UA-319064-13', 'revolveclothing.es');
	ga('send', 'pageview');
}
else if (window.location.hostname=="www.revolveclothing.ru"){
	ga('create', 'UA-319064-14', 'revolveclothing.ru');
	ga('send', 'pageview');
}
else if (window.location.hostname=="www.revolveclothing.com.au"){
	ga('create', 'UA-319064-15', 'revolveclothing.com.au');
	ga('send', 'pageview');
}
else if (window.location.hostname=="www.revolveclothing.cn"){
	ga('create', 'UA-319064-16', 'revolveclothing.cn');
	ga('send', 'pageview');
}
else if (window.location.hostname=="www.revolveclothing.com.br"){
	ga('create', 'UA-319064-17', 'revolveclothing.com.br');
	ga('send', 'pageview');
}
else if (window.location.hostname=="www.revolve.co.kr"){
	ga('create', 'UA-319064-18', 'revolve.co.kr');
	ga('send', 'pageview');
}
else if (window.location.hostname=="www.revolveclothing.co.jp"){
	ga('create', 'UA-319064-19', 'revolveclothing.co.jp');
	ga('send', 'pageview');
}


