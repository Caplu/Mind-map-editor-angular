'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('mindmap.services', []).
  value('version', '0.1').
  service('$eb', function() {
    var eb = null;
    if (!eb) {
        //var eb = new vertx.EventBus("http://localhost:8080/eventbus");
        eb = new vertx.EventBus(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/eventbus');
    } else {
        return eb;
    }
    return eb;
  }).
  constant('AUTH_EVENTS', {
      loginSuccess: 'auth-login-success',
      loginFailed: 'auth-login-failed',
      logoutSuccess: 'auth-logout-success',
      sessionTimeout: 'auth-session-timeout',
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
  }).
  constant('USER_ROLES', {
      all: '*',
      admin: 'admin',
      user: 'user',
      guest: 'guest'
  }).
  factory('AuthService', function ($http, Session, $eb,$q) {
  var authService = {};
 
  authService.login = function (credentials) {
    /* return $http
      .post('/login', credentials)
      .then(function (res) {
        Session.create(res.data.id, res.data.user.id,
                       res.data.user.role);
        return res.data.user;
      });
    return $eb.send("login",credentials,function(res){

    });*/
    var user ={userName:credentials.username,userID:"sfiuhauwgfiewf468",userRole:"user"};
    Session.create(1,user.userID,user.userRole);
    var deffered = $q.defer();
    setTimeout(function(){
        //predat usera
        deffered.resolve(user);
        //chyba deffered.reject(error);
    },200);
    return deffered.promise;
  };
  authService.directLogin = function(user){
    //overime userID
    var deffered = $q.defer();
    Session.create(1,user.userID,user.userRole);
    setTimeout(function(){
        //predat usera
        deffered.resolve(user);
        //chyba deffered.reject(error);
    },200);
    return deffered.promise;
  }
  authService.logout = function(){
    var deffered = $q.defer();
    Session.destroy();
    setTimeout(function(){
        //zlikvidovat sessionID
        deffered.resolve("OK");
        //chyba deffered.reject(error);
    },200);
    return deffered.promise;
  };
  authService.isAuthenticated = function () {
    return !!Session.userId;
  };
 
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };
 
  return authService;
}).
  service('Session', function () {
      this.create = function (sessionId, userId, userRole) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
      };
      this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
      };
      return this;
});