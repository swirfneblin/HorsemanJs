"use strict"

var Horseman = require('node-horseman');
var options = {
	loadImages: true,
	ignoreSSLErrors: true
}
var conta = {
	ag: '1500',
	cc: '14323-0'
}

var login = function(){

	var horseman = new Horseman(options);

	try{
		let _self = horseman
		.userAgent('Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)')
		.open('https://www.itau.com.br/empresas/')
		.screenshot('antes.PNG')
		.type('#campo_agencia', conta.ag)
		.type('#campo_conta', conta.cc)
		.click(".btnSubmit")
		.waitForNextPage()
		.waitForSelector("input[name=xsub]", { timeout : 4000});

		_self
		.screenshot('depois.PNG')
		.then(function(address){
			console.log(address);
			_self.close();
		});
	}catch(e)
	{
		console.log("erro => ", e.message)
	}
}

var loginWithEval = function(){

	var horseman = new Horseman(options);
console.log(conta.ag)
console.log(conta.cc)
	try{
		let _self = horseman
		.userAgent('Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)')
		.open('https://www.itau.com.br/empresas/')
		.screenshot('antes.PNG')
		.evaluate(function(param) {
			document.querySelector('#campo_agencia').value = param.ag
			document.querySelector('#campo_conta').value = param.cc

			return document.querySelector('.btnSubmit').click()
		}, conta)
		.waitForNextPage();

		_self
		.screenshot('depois.PNG')
		.then(function(address){
			console.log(address);
			_self.close();
		});
	}catch(e)
	{
		console.log("erro => ", e.message)
	}
}


loginWithEval()