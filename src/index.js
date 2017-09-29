"use strict"

var Horseman = require('node-horseman')
var co = require('co')
var fs = require('fs')

var options = {
    loadImages: false,
    ignoreSSLErrors: true,
    timeout: 3000,
    injectJquery: true,
    phantomOptions: {
        'ignore-ssl-errors': true,
        'debug': true
    }
}
var userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
// var userAgent = 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)'
var conta = {
    ag: '1500',
    cc: '05201',
    dac: '2'
}
var _url = "https://shwt060cto/lgnet/itauf/bankline.htm"

let loginYield2 = co.wrap(function*() {

    for (let i=1; i<10; i++) {
        let file = 'login' + i + '.PNG'
        if (fs.existsSync(file))
            fs.unlink(file)
    }
    
    try{
        var horseman = new Horseman(options)
        .userAgent(userAgent)
        
        yield horseman.on('error', function (msg, trace) {
            console.log(msg, trace);
        }).on('timeout', function (timeout, msg) {
            console.log('=> timeout', msg);
        }).on('resourceTimeout', function (msg) {
            console.log('=> resourceTimeout', msg);

        }).on('resourceError', function (msg) {
            console.log('=> resourceError', msg);
            console.log('=> erro em: ', _step);
        }).on('loadFinished', function (msg) {
            console.log('=> loadFinished', msg);
        }).on('loadStarted', function (msg) {
            console.log('=> loadStarted', msg);
        }).on("urlChanged", (newurl)=>{
            console.log("=> Url alterada para : " + newurl);
        })

        let _step = 'step 1'

        yield horseman.open(_url)
        .screenshot('login1.PNG')
        .evaluate(function(param) {
            document.querySelector('#agencia').value = param.ag;
            document.querySelector('#conta').value = param.cc;
            document.querySelector('#dac').value = param.dac;
            document.querySelector('input[type="image"]').click()
        }, conta)
        .waitForNextPage({timeout: 8000})

        _step = 'step 2'
        yield horseman.screenshot('login2.PNG')
        .evaluate(function() {
            document.querySelector('#MSGBordaEsq a').click()
        })
        
        _step = 'step 3'
        yield horseman.screenshot('login3.PNG')
        .evaluate(function() {
            document.querySelector('#TecladoFlutuanteBKL form img[title*="1"]').click()
            document.querySelector('#TecladoFlutuanteBKL form img[title*="2"]').click()
            document.querySelector('#TecladoFlutuanteBKL form img[title*="3"]').click()
            document.querySelector('#TecladoFlutuanteBKL form img[title*="0"]').click()
            document.querySelector('#TecladoFlutuanteBKL form img[title*="0"]').click()
            document.querySelector('#TecladoFlutuanteBKL form img[title*="0"]').click()
            document.querySelector('#TecladoFlutuanteBKL form img[title*="0"]').click()
            document.querySelector('#TecladoFlutuanteBKL form img[title*="1"]').click()
            document.querySelector('#idBtnContinuar > img').click()
        })
        .waitForNextPage()

        _step = 'step 4'
        yield horseman.screenshot('login4.PNG')
        .evaluate(function() {
            document.querySelector('input[name="bt_confirmar"]').click()
        })
        .waitForNextPage({timeout: 25000})

        _step = 'step 5'
        yield horseman.screenshot('login5.PNG')
        .evaluate(function() {
            document.querySelector('#menulinha1 > a.menusupsel').click()
        })
        .wait(5000)

        _step = 'step 6'
        yield horseman.screenshot('login6.PNG')
        .evaluate(function() {
            document.querySelector('div.btnSair a').click()
        })
        .waitForNextPage({timeout: 10000})

        _step = 'step 7'
        yield horseman.screenshot('login7.PNG')
        .evaluate(function() {
            document.querySelector('img[alt=Sair]').click()
        })
        .waitForNextPage({timeout: 10000})

        _step = 'step 8'
        yield horseman.screenshot('login8.PNG')

        return yield horseman.close();
    }catch(err){
        horseman.close();
    }

}, function(err) {
    console.error(err.stack);
    horseman.close();
})

let login = function() {

    var horseman = new Horseman(options)

    try {
        return horseman
        .userAgent(userAgent)
        .open(_url)
        .screenshot('login1.PNG')

        .type('#agencia', conta.ag)
        .type('#conta', conta.cc)
        .type('#dac', conta.dac)
        .click("input[type=image]")
        .waitForNextPage()

        .screenshot('login.PNG')
        .close()

    } catch (e) {
        console.log("erro => ", e.message)
    }
}

let loginWithEval = function() {

    var horseman = new Horseman(options)

    try {
        return horseman
        .userAgent(userAgent)
        .open(_url)
        .screenshot('loginWithEval1.PNG')
        .evaluate(function(param) {
            document.querySelector('#agencia').value = param.ag
            document.querySelector('#conta').value = param.cc
            document.querySelector('#dac').value = param.dac

            return document.querySelector('input[type=image]').click()
        }, conta)
        .waitForNextPage()

        .screenshot('loginWithEval.PNG')
        .close()

    } catch (e) {
        console.log("erro => ", e.message)
    }
}

let loginYield = co.wrap(function*() {

    var horseman = new Horseman(options)

    yield horseman.userAgent(userAgent)
    yield horseman.open(_url)
    yield horseman.screenshot('loginYield1.PNG')

    yield horseman.evaluate(function(param) {
        document.querySelector('#agencia').value = param.ag
        document.querySelector('#conta').value = param.cc
        document.querySelector('#dac').value = param.dac

        return document.querySelector('input[type=image]').click()
    }, conta)

    yield horseman.waitForNextPage()

    yield horseman.screenshot('loginYield.PNG')

    return yield horseman.close();

}, function(err) {
    console.error(err.stack);
})

module.exports = {
    login: login,
    loginWithEval: loginWithEval,
    loginYield: loginYield,
    loginYield2: loginYield2
}
