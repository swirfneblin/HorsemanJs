"use strict"

var Horseman = require('node-horseman')
var co = require('co')
var fs = require('fs')

var options = {
    loadImages: true,
    ignoreSSLErrors: true
}

var userAgent = 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)'
var conta = {
    ag: '3242',
    cc: '13452-0',
    dac: '2'
}
var _url = "https://www.itau.com.br/empresas"

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

let loginYield2 = co.wrap(function*() {

    ['loginYield1.PNG', 'loginYield2.PNG', 'loginYield3.PNG', 'loginYield4.PNG']
    .forEach(function(filename) {
        if (fs.existsSync(filename)) {
            fs.unlink(filename);
        }
    })

    var horseman = new Horseman(options)

    yield horseman.userAgent(userAgent)
    yield horseman.open(_url)
    yield horseman.screenshot('loginYield1.PNG')

    yield horseman.evaluate(function(param) {
        $('#campo_agencia').val(param.ag)
        $('#campo_conta').val(param.cc)
        
        $('.btnSubmit').click()
    }, conta)
    
    yield horseman.waitForNextPage()
    yield horseman.wait(5000)
    
    yield horseman.screenshot('loginYield2.PNG')

    yield horseman.evaluate(function() {
        $('.lnkpadrao01').click()
    })
    
    yield horseman.wait(5000)
    yield horseman.screenshot('loginYield3.PNG')

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