"use strict"

var parallel = require('mocha.parallel')
var should = require('should')
var fs = require('fs')
var Promise = require('bluebird')
var co = require('co')

var browser = require("../index")

describe('Login com Horsemanjs - noParallel', function() {
    it('Sem Eval() - preenchimento e click() como metodos nativos do HorseManJs', function() {
        return browser.login()
            .then(function() {
                return Promise.fromCallback(function(done) {
                    return fs.stat('login.PNG', done);
                });
            })
            .call('isFile')
            .should.eventually
            .be.true()
    })
})

parallel('Login com Horsemanjs - parallel', function() {

    it('Sem Eval() verificacao de arquivo inexistente', function() {
        return browser.login()
            .then(function() {
                return Promise.fromCallback(function(done) {
                    return fs.stat('__login.PNG', done);
                });
            })
            .call('isFile')
            .catch(function(e) {
                return false
            })
            .should.eventually.be.false()
    })

    it('Com Eval() - funcoes de preenchimento e click() dentro do evaluate()', function() {
        return browser.loginWithEval()
            .then(function() {
                return Promise.fromCallback(function(done) {
                    return fs.stat('loginWithEval.PNG', done);
                });
            })
            .call('isFile')
            .should.eventually
            .be.true()

    })

    it('Com Generators * - utilizando async pausado', function*() {
        return co(function*() {
            return yield browser.loginYield()

            let saved = yield Promise.fromCallback(function(done) {
                return fs.stat('loginYield.PNG', done);
            })

            return yield saved.call('isFile').should.eventually.be.true()

        })
    })
})