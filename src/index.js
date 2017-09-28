"use strict"

var Horseman = require('node-horseman')
var co = require('co')
var fs = require('fs')

var options = {
    loadImages: true,
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

    for (let i=1; i<8; i++) {
        let file = 'login' + i + '.PNG'
        if (fs.existsSync(file))
            fs.unlink(file)
    }
    
    try{
        var horseman = new Horseman(options)

        yield horseman.userAgent(userAgent)
        
        yield horseman.on('resourceError', function(err) {
            console.log('resourceError ======>', err.message)
        })

        yield horseman.on('timeout', function(err) {
            console.log('timeout ======>', err.message)
        })

        yield horseman.open(_url)
        yield horseman.screenshot('login1.PNG')

        yield horseman.evaluate(function(param) {
            document.querySelector('#agencia').value = param.ag;
            document.querySelector('#conta').value = param.cc;
            document.querySelector('#dac').value = param.dac;
            document.querySelector('input[type="image"]').click()
        }, conta)

        yield horseman.wait(5000)
        yield horseman.screenshot('login2.PNG')

        yield horseman.evaluate(function() {
            document.querySelector('#MSGBordaEsq a').click()
        })
        
        yield horseman.wait(5000)
        yield horseman.screenshot('login3.PNG')

        yield horseman.evaluate(function() {
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

        yield horseman.wait(7000)
        yield horseman.screenshot('login4.PNG')

        yield horseman.evaluate(function() {
            document.querySelector('input[name="bt_confirmar"]').click()
        })

        yield horseman.wait(20000)
        
        // yield horseman.waitForNextPage({timeout: 20000})
        yield horseman.screenshot('login5.PNG')

        yield horseman.evaluate(function() {
            document.querySelector('#menulinha1 > a.menusupsel').click()
        })

        yield horseman.wait(15000)
        yield horseman.screenshot('login6.PNG')

        yield horseman.evaluate(function() {
            document.querySelector('#TOPbtnsair').click()
        })

        yield horseman.wait(5000)
        yield horseman.screenshot('login7.PNG')

        yield horseman.evaluate(function() {
            document.querySelector('img[alt=Sair]').click()
        })

        yield horseman.wait(5000)
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
