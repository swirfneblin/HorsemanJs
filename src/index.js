"use strict"

var Horseman = require('node-horseman')
var co = require('co')

var options = {
    loadImages: true,
    ignoreSSLErrors: true
}
var userAgent = 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)'
var conta = {
    ag: '1500',
    cc: '14323-0'
}

let login = function() {

    var horseman = new Horseman(options)

    try {
        return horseman
            .userAgent(userAgent)
            .open('https://www.itau.com.br/empresas/')
            .screenshot('login1.PNG')

        .type('#campo_agencia', conta.ag)
            .type('#campo_conta', conta.cc)
            .click(".btnSubmit")
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
            .open('https://www.itau.com.br/empresas/')
            .screenshot('loginWithEval1.PNG')
            .evaluate(function(param) {
                document.querySelector('#campo_agencia').value = param.ag
                document.querySelector('#campo_conta').value = param.cc

                return document.querySelector('.btnSubmit').click()
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
    yield horseman.open('https://www.itau.com.br/empresas/')
    yield horseman.screenshot('loginYield1.PNG')

    yield horseman.evaluate(function(param) {
        document.querySelector('#campo_agencia').value = param.ag
        document.querySelector('#campo_conta').value = param.cc

        return document.querySelector('.btnSubmit').click()
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
    loginYield: loginYield
}