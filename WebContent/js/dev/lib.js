/**
 * @license AngularJS v1.3.2
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngRoute
 * @description
 *
 * # ngRoute
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 *
 * <div doc-module-components="ngRoute"></div>
 */
 /* global -ngRouteModule */
var ngRouteModule = angular.module('ngRoute', ['ng']).
                        provider('$route', $RouteProvider),
    $routeMinErr = angular.$$minErr('ngRoute');

/**
 * @ngdoc provider
 * @name $routeProvider
 *
 * @description
 *
 * Used for configuring routes.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider() {
  function inherit(parent, extra) {
    return angular.extend(new (angular.extend(function() {}, {prototype:parent}))(), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name $routeProvider#when
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
   *
   *    * `color: brown`
   *    * `largecode: code/with/slashes`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – A controller alias name. If present the controller will be
   *      published to scope under the `controllerAs` name.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
   *      is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `redirectTo` – {(string|function())=} – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.path()` and `$location.search()`.
   *
   *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$routeUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    //copy original route object to preserve params inherited from proto chain
    var routeCopy = angular.copy(route);
    if (angular.isUndefined(routeCopy.reloadOnSearch)) {
      routeCopy.reloadOnSearch = true;
    }
    routes[path] = angular.extend(
      routeCopy,
      path && pathRegExp(path, routeCopy)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length-1] == '/')
            ? path.substr(0, path.length-1)
            : path +'/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, routeCopy)
      );
    }

    return this;
  };

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name $routeProvider#otherwise
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object|string} params Mapping information to be assigned to `$route.current`.
   * If called with a string, the value maps to `redirectTo`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    if (typeof params === 'string') {
      params = {redirectTo: params};
    }
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$templateRequest',
               '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {

    /**
     * @ngdoc service
     * @name $route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as define in route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     * @property {Object} routes Object with all route configuration Objects as its properties.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
     * This example shows how changing the URL hash causes the `$route` to match a route against the
     * URL, and the `ngView` pulls in the partial.
     *
     * <example name="$route-service" module="ngRouteExample"
     *          deps="angular-route.js" fixBase="true">
     *   <file name="index.html">
     *     <div ng-controller="MainController">
     *       Choose:
     *       <a href="Book/Moby">Moby</a> |
     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
     *       <a href="Book/Gatsby">Gatsby</a> |
     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
     *
     *       <div ng-view></div>
     *
     *       <hr />
     *
     *       <pre>$location.path() = {{$location.path()}}</pre>
     *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
     *       <pre>$route.current.params = {{$route.current.params}}</pre>
     *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
     *       <pre>$routeParams = {{$routeParams}}</pre>
     *     </div>
     *   </file>
     *
     *   <file name="book.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *   </file>
     *
     *   <file name="chapter.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *     Chapter Id: {{params.chapterId}}
     *   </file>
     *
     *   <file name="script.js">
     *     angular.module('ngRouteExample', ['ngRoute'])
     *
     *      .controller('MainController', function($scope, $route, $routeParams, $location) {
     *          $scope.$route = $route;
     *          $scope.$location = $location;
     *          $scope.$routeParams = $routeParams;
     *      })
     *
     *      .controller('BookController', function($scope, $routeParams) {
     *          $scope.name = "BookController";
     *          $scope.params = $routeParams;
     *      })
     *
     *      .controller('ChapterController', function($scope, $routeParams) {
     *          $scope.name = "ChapterController";
     *          $scope.params = $routeParams;
     *      })
     *
     *     .config(function($routeProvider, $locationProvider) {
     *       $routeProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
     *
     *   </file>
     *
     *   <file name="protractor.js" type="protractor">
     *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: ChapterController/);
     *       expect(content).toMatch(/Book Id\: Moby/);
     *       expect(content).toMatch(/Chapter Id\: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: BookController/);
     *       expect(content).toMatch(/Book Id\: Scarlet/);
     *     });
     *   </file>
     * </example>
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeStart
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * The route change (and the `$location` change that triggered it) can be prevented
     * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
     * for more details about event object.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeSuccess
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route dependencies are resolved.
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeError
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if any of the resolve promises are rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
     */

    /**
     * @ngdoc event
     * @name $route#$routeUpdate
     * @eventType broadcast on root scope
     * @description
     *
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     */

    var forceReload = false,
        preparedRoute,
        preparedRouteIsUpdateOnly,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name $route#reload
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope and reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;
            $rootScope.$evalAsync(function() {
              // Don't support cancellation of a reload for now...
              prepareRoute();
              commitRoute();
            });
          },

          /**
           * @ngdoc method
           * @name $route#updateParams
           *
           * @description
           * Causes `$route` service to update the current URL, replacing
           * current route parameters with those specified in `newParams`.
           * Provided property names that match the route's path segment
           * definitions will be interpolated into the location's path, while
           * remaining properties will be treated as query params.
           *
           * @param {Object} newParams mapping of URL parameter names to values
           */
          updateParams: function(newParams) {
            if (this.current && this.current.$$route) {
              var searchParams = {}, self=this;

              angular.forEach(Object.keys(newParams), function(key) {
                if (!self.current.pathParams[key]) searchParams[key] = newParams[key];
              });

              newParams = angular.extend({}, this.current.params, newParams);
              $location.path(interpolate(this.current.$$route.originalPath, newParams));
              $location.search(angular.extend({}, $location.search(), searchParams));
            }
            else {
              throw $routeMinErr('norout', 'Tried updating route when with no current route');
            }
          }
        };

    $rootScope.$on('$locationChangeStart', prepareRoute);
    $rootScope.$on('$locationChangeSuccess', commitRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function prepareRoute($locationEvent) {
      var lastRoute = $route.current;

      preparedRoute = parseRoute();
      preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route
          && angular.equals(preparedRoute.pathParams, lastRoute.pathParams)
          && !preparedRoute.reloadOnSearch && !forceReload;

      if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
        if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
          if ($locationEvent) {
            $locationEvent.preventDefault();
          }
        }
      }
    }

    function commitRoute() {
      var lastRoute = $route.current;
      var nextRoute = preparedRoute;

      if (preparedRouteIsUpdateOnly) {
        lastRoute.params = nextRoute.params;
        angular.copy(lastRoute.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', lastRoute);
      } else if (nextRoute || lastRoute) {
        forceReload = false;
        $route.current = nextRoute;
        if (nextRoute) {
          if (nextRoute.redirectTo) {
            if (angular.isString(nextRoute.redirectTo)) {
              $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params)
                       .replace();
            } else {
              $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(nextRoute).
          then(function() {
            if (nextRoute) {
              var locals = angular.extend({}, nextRoute.resolve),
                  template, templateUrl;

              angular.forEach(locals, function(value, key) {
                locals[key] = angular.isString(value) ?
                    $injector.get(value) : $injector.invoke(value, null, null, key);
              });

              if (angular.isDefined(template = nextRoute.template)) {
                if (angular.isFunction(template)) {
                  template = template(nextRoute.params);
                }
              } else if (angular.isDefined(templateUrl = nextRoute.templateUrl)) {
                if (angular.isFunction(templateUrl)) {
                  templateUrl = templateUrl(nextRoute.params);
                }
                templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                if (angular.isDefined(templateUrl)) {
                  nextRoute.loadedTemplateUrl = templateUrl;
                  template = $templateRequest(templateUrl);
                }
              }
              if (angular.isDefined(template)) {
                locals['$template'] = template;
              }
              return $q.all(locals);
            }
          }).
          // after route change
          then(function(locals) {
            if (nextRoute == $route.current) {
              if (nextRoute) {
                nextRoute.locals = locals;
                angular.copy(nextRoute.params, $routeParams);
              }
              $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
            }
          }, function(error) {
            if (nextRoute == $route.current) {
              $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
            }
          });
      }
    }


    /**
     * @returns {Object} the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns {string} interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string||'').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc service
 * @name $routeParams
 * @requires $route
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
 * ```
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="ngView-directive" module="ngViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>
          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />
          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>
      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>
      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>
      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          position:relative;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }
        .view-animate {
          padding:10px;
        }
        .view-animate.ng-enter, .view-animate.ng-leave {
          -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
          display:block;
          width:100%;
          border-left:1px solid black;
          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }
        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>
      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });
              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function($routeParams) {
            this.name = "BookCtrl";
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
            this.name = "ChapterCtrl";
            this.params = $routeParams;
          }]);
      </file>
      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: ChapterCtrl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);
          element(by.partialLinkText('Scarlet')).click();
          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: BookCtrl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngView#$viewContentLoaded
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
function ngViewFactory($route, $anchorScroll, $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousLeaveAnimation,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.then(function() {
              previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
function ngViewFillContentFactory($compile, $controller, $route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }

      link(scope);
    }
  };
}


})(window, window.angular);
/**
 * @license AngularJS v1.3.2
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

var $resourceMinErr = angular.$$minErr('$resource');

// Helper functions and regex to lookup a dotted path on an object
// stopping at undefined/null.  The path must be composed of ASCII
// identifiers (just like $parse)
var MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;

function isValidDottedPath(path) {
  return (path != null && path !== '' && path !== 'hasOwnProperty' &&
      MEMBER_NAME_REGEX.test('.' + path));
}

function lookupDottedPath(obj, path) {
  if (!isValidDottedPath(path)) {
    throw $resourceMinErr('badmember', 'Dotted member path "@{0}" is invalid.', path);
  }
  var keys = path.split('.');
  for (var i = 0, ii = keys.length; i < ii && obj !== undefined; i++) {
    var key = keys[i];
    obj = (obj !== null) ? obj[key] : undefined;
  }
  return obj;
}

/**
 * Create a shallow copy of an object and clear other fields from the destination
 */
function shallowClearAndCopy(src, dst) {
  dst = dst || {};

  angular.forEach(dst, function(value, key) {
    delete dst[key];
  });

  for (var key in src) {
    if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
      dst[key] = src[key];
    }
  }

  return dst;
}

/**
 * @ngdoc module
 * @name ngResource
 * @description
 *
 * # ngResource
 *
 * The `ngResource` module provides interaction support with RESTful services
 * via the $resource service.
 *
 *
 * <div doc-module-components="ngResource"></div>
 *
 * See {@link ngResource.$resource `$resource`} for usage.
 */

/**
 * @ngdoc service
 * @name $resource
 * @requires $http
 *
 * @description
 * A factory which creates a resource object that lets you interact with
 * [RESTful](http://en.wikipedia.org/wiki/Representational_State_Transfer) server-side data sources.
 *
 * The returned resource object has action methods which provide high-level behaviors without
 * the need to interact with the low level {@link ng.$http $http} service.
 *
 * Requires the {@link ngResource `ngResource`} module to be installed.
 *
 * By default, trailing slashes will be stripped from the calculated URLs,
 * which can pose problems with server backends that do not expect that
 * behavior.  This can be disabled by configuring the `$resourceProvider` like
 * this:
 *
 * ```js
     app.config(['$resourceProvider', function($resourceProvider) {
       // Don't strip trailing slashes from calculated URLs
       $resourceProvider.defaults.stripTrailingSlashes = false;
     }]);
 * ```
 *
 * @param {string} url A parametrized URL template with parameters prefixed by `:` as in
 *   `/user/:username`. If you are using a URL with a port number (e.g.
 *   `http://example.com:8080/api`), it will be respected.
 *
 *   If you are using a url with a suffix, just add the suffix, like this:
 *   `$resource('http://example.com/resource.json')` or `$resource('http://example.com/:id.json')`
 *   or even `$resource('http://example.com/resource/:resource_id.:format')`
 *   If the parameter before the suffix is empty, :resource_id in this case, then the `/.` will be
 *   collapsed down to a single `.`.  If you need this sequence to appear and not collapse then you
 *   can escape it with `/\.`.
 *
 * @param {Object=} paramDefaults Default values for `url` parameters. These can be overridden in
 *   `actions` methods. If any of the parameter value is a function, it will be executed every time
 *   when a param value needs to be obtained for a request (unless the param was overridden).
 *
 *   Each key value in the parameter object is first bound to url template if present and then any
 *   excess keys are appended to the url search query after the `?`.
 *
 *   Given a template `/path/:verb` and parameter `{verb:'greet', salutation:'Hello'}` results in
 *   URL `/path/greet?salutation=Hello`.
 *
 *   If the parameter value is prefixed with `@` then the value for that parameter will be extracted
 *   from the corresponding property on the `data` object (provided when calling an action method).  For
 *   example, if the `defaultParam` object is `{someParam: '@someProp'}` then the value of `someParam`
 *   will be `data.someProp`.
 *
 * @param {Object.<Object>=} actions Hash with declaration of custom action that should extend
 *   the default set of resource actions. The declaration should be created in the format of {@link
 *   ng.$http#usage $http.config}:
 *
 *       {action1: {method:?, params:?, isArray:?, headers:?, ...},
 *        action2: {method:?, params:?, isArray:?, headers:?, ...},
 *        ...}
 *
 *   Where:
 *
 *   - **`action`** – {string} – The name of action. This name becomes the name of the method on
 *     your resource object.
 *   - **`method`** – {string} – Case insensitive HTTP method (e.g. `GET`, `POST`, `PUT`,
 *     `DELETE`, `JSONP`, etc).
 *   - **`params`** – {Object=} – Optional set of pre-bound parameters for this action. If any of
 *     the parameter value is a function, it will be executed every time when a param value needs to
 *     be obtained for a request (unless the param was overridden).
 *   - **`url`** – {string} – action specific `url` override. The url templating is supported just
 *     like for the resource-level urls.
 *   - **`isArray`** – {boolean=} – If true then the returned object for this action is an array,
 *     see `returns` section.
 *   - **`transformRequest`** –
 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
 *     transform function or an array of such functions. The transform function takes the http
 *     request body and headers and returns its transformed (typically serialized) version.
 *     By default, transformRequest will contain one function that checks if the request data is
 *     an object and serializes to using `angular.toJson`. To prevent this behavior, set
 *     `transformRequest` to an empty array: `transformRequest: []`
 *   - **`transformResponse`** –
 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
 *     transform function or an array of such functions. The transform function takes the http
 *     response body and headers and returns its transformed (typically deserialized) version.
 *     By default, transformResponse will contain one function that checks if the response looks like
 *     a JSON string and deserializes it using `angular.fromJson`. To prevent this behavior, set
 *     `transformResponse` to an empty array: `transformResponse: []`
 *   - **`cache`** – `{boolean|Cache}` – If true, a default $http cache will be used to cache the
 *     GET request, otherwise if a cache instance built with
 *     {@link ng.$cacheFactory $cacheFactory}, this cache will be used for
 *     caching.
 *   - **`timeout`** – `{number|Promise}` – timeout in milliseconds, or {@link ng.$q promise} that
 *     should abort the request when resolved.
 *   - **`withCredentials`** - `{boolean}` - whether to set the `withCredentials` flag on the
 *     XHR object. See
 *     [requests with credentials](https://developer.mozilla.org/en/http_access_control#section_5)
 *     for more information.
 *   - **`responseType`** - `{string}` - see
 *     [requestType](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType).
 *   - **`interceptor`** - `{Object=}` - The interceptor object has two optional methods -
 *     `response` and `responseError`. Both `response` and `responseError` interceptors get called
 *     with `http response` object. See {@link ng.$http $http interceptors}.
 *
 * @param {Object} options Hash with custom settings that should extend the
 *   default `$resourceProvider` behavior.  The only supported option is
 *
 *   Where:
 *
 *   - **`stripTrailingSlashes`** – {boolean} – If true then the trailing
 *   slashes from any calculated URL will be stripped. (Defaults to true.)
 *
 * @returns {Object} A resource "class" object with methods for the default set of resource actions
 *   optionally extended with custom `actions`. The default set contains these actions:
 *   ```js
 *   { 'get':    {method:'GET'},
 *     'save':   {method:'POST'},
 *     'query':  {method:'GET', isArray:true},
 *     'remove': {method:'DELETE'},
 *     'delete': {method:'DELETE'} };
 *   ```
 *
 *   Calling these methods invoke an {@link ng.$http} with the specified http method,
 *   destination and parameters. When the data is returned from the server then the object is an
 *   instance of the resource class. The actions `save`, `remove` and `delete` are available on it
 *   as  methods with the `$` prefix. This allows you to easily perform CRUD operations (create,
 *   read, update, delete) on server-side data like this:
 *   ```js
 *   var User = $resource('/user/:userId', {userId:'@id'});
 *   var user = User.get({userId:123}, function() {
 *     user.abc = true;
 *     user.$save();
 *   });
 *   ```
 *
 *   It is important to realize that invoking a $resource object method immediately returns an
 *   empty reference (object or array depending on `isArray`). Once the data is returned from the
 *   server the existing reference is populated with the actual data. This is a useful trick since
 *   usually the resource is assigned to a model which is then rendered by the view. Having an empty
 *   object results in no rendering, once the data arrives from the server then the object is
 *   populated with the data and the view automatically re-renders itself showing the new data. This
 *   means that in most cases one never has to write a callback function for the action methods.
 *
 *   The action methods on the class object or instance object can be invoked with the following
 *   parameters:
 *
 *   - HTTP GET "class" actions: `Resource.action([parameters], [success], [error])`
 *   - non-GET "class" actions: `Resource.action([parameters], postData, [success], [error])`
 *   - non-GET instance actions:  `instance.$action([parameters], [success], [error])`
 *
 *   Success callback is called with (value, responseHeaders) arguments. Error callback is called
 *   with (httpResponse) argument.
 *
 *   Class actions return empty instance (with additional properties below).
 *   Instance actions return promise of the action.
 *
 *   The Resource instances and collection have these additional properties:
 *
 *   - `$promise`: the {@link ng.$q promise} of the original server interaction that created this
 *     instance or collection.
 *
 *     On success, the promise is resolved with the same resource instance or collection object,
 *     updated with data from server. This makes it easy to use in
 *     {@link ngRoute.$routeProvider resolve section of $routeProvider.when()} to defer view
 *     rendering until the resource(s) are loaded.
 *
 *     On failure, the promise is resolved with the {@link ng.$http http response} object, without
 *     the `resource` property.
 *
 *     If an interceptor object was provided, the promise will instead be resolved with the value
 *     returned by the interceptor.
 *
 *   - `$resolved`: `true` after first server interaction is completed (either with success or
 *      rejection), `false` before that. Knowing if the Resource has been resolved is useful in
 *      data-binding.
 *
 * @example
 *
 * # Credit card resource
 *
 * ```js
     // Define CreditCard class
     var CreditCard = $resource('/user/:userId/card/:cardId',
      {userId:123, cardId:'@id'}, {
       charge: {method:'POST', params:{charge:true}}
      });
     // We can retrieve a collection from the server
     var cards = CreditCard.query(function() {
       // GET: /user/123/card
       // server returns: [ {id:456, number:'1234', name:'Smith'} ];
       var card = cards[0];
       // each item is an instance of CreditCard
       expect(card instanceof CreditCard).toEqual(true);
       card.name = "J. Smith";
       // non GET methods are mapped onto the instances
       card.$save();
       // POST: /user/123/card/456 {id:456, number:'1234', name:'J. Smith'}
       // server returns: {id:456, number:'1234', name: 'J. Smith'};
       // our custom method is mapped as well.
       card.$charge({amount:9.99});
       // POST: /user/123/card/456?amount=9.99&charge=true {id:456, number:'1234', name:'J. Smith'}
     });
     // we can create an instance as well
     var newCard = new CreditCard({number:'0123'});
     newCard.name = "Mike Smith";
     newCard.$save();
     // POST: /user/123/card {number:'0123', name:'Mike Smith'}
     // server returns: {id:789, number:'0123', name: 'Mike Smith'};
     expect(newCard.id).toEqual(789);
 * ```
 *
 * The object returned from this function execution is a resource "class" which has "static" method
 * for each action in the definition.
 *
 * Calling these methods invoke `$http` on the `url` template with the given `method`, `params` and
 * `headers`.
 * When the data is returned from the server then the object is an instance of the resource type and
 * all of the non-GET methods are available with `$` prefix. This allows you to easily support CRUD
 * operations (create, read, update, delete) on server-side data.
   ```js
     var User = $resource('/user/:userId', {userId:'@id'});
     User.get({userId:123}, function(user) {
       user.abc = true;
       user.$save();
     });
   ```
 *
 * It's worth noting that the success callback for `get`, `query` and other methods gets passed
 * in the response that came from the server as well as $http header getter function, so one
 * could rewrite the above example and get access to http headers as:
 *
   ```js
     var User = $resource('/user/:userId', {userId:'@id'});
     User.get({userId:123}, function(u, getResponseHeaders){
       u.abc = true;
       u.$save(function(u, putResponseHeaders) {
         //u => saved user object
         //putResponseHeaders => $http header getter
       });
     });
   ```
 *
 * You can also access the raw `$http` promise via the `$promise` property on the object returned
 *
   ```
     var User = $resource('/user/:userId', {userId:'@id'});
     User.get({userId:123})
         .$promise.then(function(user) {
           $scope.user = user;
         });
   ```
 * # Creating a custom 'PUT' request
 * In this example we create a custom method on our resource to make a PUT request
 * ```js
 *    var app = angular.module('app', ['ngResource', 'ngRoute']);
 *
 *    // Some APIs expect a PUT request in the format URL/object/ID
 *    // Here we are creating an 'update' method
 *    app.factory('Notes', ['$resource', function($resource) {
 *    return $resource('/notes/:id', null,
 *        {
 *            'update': { method:'PUT' }
 *        });
 *    }]);
 *
 *    // In our controller we get the ID from the URL using ngRoute and $routeParams
 *    // We pass in $routeParams and our Notes factory along with $scope
 *    app.controller('NotesCtrl', ['$scope', '$routeParams', 'Notes',
                                      function($scope, $routeParams, Notes) {
 *    // First get a note object from the factory
 *    var note = Notes.get({ id:$routeParams.id });
 *    $id = note.id;
 *
 *    // Now call update passing in the ID first then the object you are updating
 *    Notes.update({ id:$id }, note);
 *
 *    // This will PUT /notes/ID with the note object in the request payload
 *    }]);
 * ```
 */
angular.module('ngResource', ['ng']).
  provider('$resource', function() {
    var provider = this;

    this.defaults = {
      // Strip slashes by default
      stripTrailingSlashes: true,

      // Default actions configuration
      actions: {
        'get': {method: 'GET'},
        'save': {method: 'POST'},
        'query': {method: 'GET', isArray: true},
        'remove': {method: 'DELETE'},
        'delete': {method: 'DELETE'}
      }
    };

    this.$get = ['$http', '$q', function($http, $q) {

      var noop = angular.noop,
        forEach = angular.forEach,
        extend = angular.extend,
        copy = angular.copy,
        isFunction = angular.isFunction;

      /**
       * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
       * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set
       * (pchar) allowed in path segments:
       *    segment       = *pchar
       *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
       *    pct-encoded   = "%" HEXDIG HEXDIG
       *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
       *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
       *                     / "*" / "+" / "," / ";" / "="
       */
      function encodeUriSegment(val) {
        return encodeUriQuery(val, true).
          replace(/%26/gi, '&').
          replace(/%3D/gi, '=').
          replace(/%2B/gi, '+');
      }


      /**
       * This method is intended for encoding *key* or *value* parts of query component. We need a
       * custom method because encodeURIComponent is too aggressive and encodes stuff that doesn't
       * have to be encoded per http://tools.ietf.org/html/rfc3986:
       *    query       = *( pchar / "/" / "?" )
       *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
       *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
       *    pct-encoded   = "%" HEXDIG HEXDIG
       *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
       *                     / "*" / "+" / "," / ";" / "="
       */
      function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).
          replace(/%40/gi, '@').
          replace(/%3A/gi, ':').
          replace(/%24/g, '$').
          replace(/%2C/gi, ',').
          replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
      }

      function Route(template, defaults) {
        this.template = template;
        this.defaults = extend({}, provider.defaults, defaults);
        this.urlParams = {};
      }

      Route.prototype = {
        setUrlParams: function(config, params, actionUrl) {
          var self = this,
            url = actionUrl || self.template,
            val,
            encodedVal;

          var urlParams = self.urlParams = {};
          forEach(url.split(/\W/), function(param) {
            if (param === 'hasOwnProperty') {
              throw $resourceMinErr('badname', "hasOwnProperty is not a valid parameter name.");
            }
            if (!(new RegExp("^\\d+$").test(param)) && param &&
              (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
              urlParams[param] = true;
            }
          });
          url = url.replace(/\\:/g, ':');

          params = params || {};
          forEach(self.urlParams, function(_, urlParam) {
            val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
            if (angular.isDefined(val) && val !== null) {
              encodedVal = encodeUriSegment(val);
              url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), function(match, p1) {
                return encodedVal + p1;
              });
            } else {
              url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function(match,
                  leadingSlashes, tail) {
                if (tail.charAt(0) == '/') {
                  return tail;
                } else {
                  return leadingSlashes + tail;
                }
              });
            }
          });

          // strip trailing slashes and set the url (unless this behavior is specifically disabled)
          if (self.defaults.stripTrailingSlashes) {
            url = url.replace(/\/+$/, '') || '/';
          }

          // then replace collapse `/.` if found in the last URL path segment before the query
          // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
          url = url.replace(/\/\.(?=\w+($|\?))/, '.');
          // replace escaped `/\.` with `/.`
          config.url = url.replace(/\/\\\./, '/.');


          // set params - delegate param encoding to $http
          forEach(params, function(value, key) {
            if (!self.urlParams[key]) {
              config.params = config.params || {};
              config.params[key] = value;
            }
          });
        }
      };


      function resourceFactory(url, paramDefaults, actions, options) {
        var route = new Route(url, options);

        actions = extend({}, provider.defaults.actions, actions);

        function extractParams(data, actionParams) {
          var ids = {};
          actionParams = extend({}, paramDefaults, actionParams);
          forEach(actionParams, function(value, key) {
            if (isFunction(value)) { value = value(); }
            ids[key] = value && value.charAt && value.charAt(0) == '@' ?
              lookupDottedPath(data, value.substr(1)) : value;
          });
          return ids;
        }

        function defaultResponseInterceptor(response) {
          return response.resource;
        }

        function Resource(value) {
          shallowClearAndCopy(value || {}, this);
        }

        Resource.prototype.toJSON = function() {
          var data = extend({}, this);
          delete data.$promise;
          delete data.$resolved;
          return data;
        };

        forEach(actions, function(action, name) {
          var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);

          Resource[name] = function(a1, a2, a3, a4) {
            var params = {}, data, success, error;

            /* jshint -W086 */ /* (purposefully fall through case statements) */
            switch (arguments.length) {
              case 4:
                error = a4;
                success = a3;
              //fallthrough
              case 3:
              case 2:
                if (isFunction(a2)) {
                  if (isFunction(a1)) {
                    success = a1;
                    error = a2;
                    break;
                  }

                  success = a2;
                  error = a3;
                  //fallthrough
                } else {
                  params = a1;
                  data = a2;
                  success = a3;
                  break;
                }
              case 1:
                if (isFunction(a1)) success = a1;
                else if (hasBody) data = a1;
                else params = a1;
                break;
              case 0: break;
              default:
                throw $resourceMinErr('badargs',
                  "Expected up to 4 arguments [params, data, success, error], got {0} arguments",
                  arguments.length);
            }
            /* jshint +W086 */ /* (purposefully fall through case statements) */

            var isInstanceCall = this instanceof Resource;
            var value = isInstanceCall ? data : (action.isArray ? [] : new Resource(data));
            var httpConfig = {};
            var responseInterceptor = action.interceptor && action.interceptor.response ||
              defaultResponseInterceptor;
            var responseErrorInterceptor = action.interceptor && action.interceptor.responseError ||
              undefined;

            forEach(action, function(value, key) {
              if (key != 'params' && key != 'isArray' && key != 'interceptor') {
                httpConfig[key] = copy(value);
              }
            });

            if (hasBody) httpConfig.data = data;
            route.setUrlParams(httpConfig,
              extend({}, extractParams(data, action.params || {}), params),
              action.url);

            var promise = $http(httpConfig).then(function(response) {
              var data = response.data,
                promise = value.$promise;

              if (data) {
                // Need to convert action.isArray to boolean in case it is undefined
                // jshint -W018
                if (angular.isArray(data) !== (!!action.isArray)) {
                  throw $resourceMinErr('badcfg',
                      'Error in resource configuration for action `{0}`. Expected response to ' +
                      'contain an {1} but got an {2}', name, action.isArray ? 'array' : 'object',
                    angular.isArray(data) ? 'array' : 'object');
                }
                // jshint +W018
                if (action.isArray) {
                  value.length = 0;
                  forEach(data, function(item) {
                    if (typeof item === "object") {
                      value.push(new Resource(item));
                    } else {
                      // Valid JSON values may be string literals, and these should not be converted
                      // into objects. These items will not have access to the Resource prototype
                      // methods, but unfortunately there
                      value.push(item);
                    }
                  });
                } else {
                  shallowClearAndCopy(data, value);
                  value.$promise = promise;
                }
              }

              value.$resolved = true;

              response.resource = value;

              return response;
            }, function(response) {
              value.$resolved = true;

              (error || noop)(response);

              return $q.reject(response);
            });

            promise = promise.then(
              function(response) {
                var value = responseInterceptor(response);
                (success || noop)(value, response.headers);
                return value;
              },
              responseErrorInterceptor);

            if (!isInstanceCall) {
              // we are creating instance / collection
              // - set the initial promise
              // - return the instance / collection
              value.$promise = promise;
              value.$resolved = false;

              return value;
            }

            // instance call
            return promise;
          };


          Resource.prototype['$' + name] = function(params, success, error) {
            if (isFunction(params)) {
              error = success; success = params; params = {};
            }
            var result = Resource[name].call(this, params, this, success, error);
            return result.$promise || result;
          };
        });

        Resource.bind = function(additionalParamDefaults) {
          return resourceFactory(url, extend({}, paramDefaults, additionalParamDefaults), actions);
        };

        return Resource;
      }

      return resourceFactory;
    }];
  });


})(window, window.angular);
'use strict';

angular.module('datatables.util', [])
    .factory('DTPropertyUtil', dtPropertyUtil);

/* @ngInject */
function dtPropertyUtil($q) {
    return {
        overrideProperties: overrideProperties,
        deleteProperty: deleteProperty,
        resolveObjectPromises: resolveObjectPromises,
        resolveArrayPromises: resolveArrayPromises
    };

    /**
     * Overrides the source property with the given target properties.
     * Source is not written. It's making a fresh copy of it in order to ensure that we do not change the parameters.
     * @param source the source properties to override
     * @param target the target properties
     * @returns {*} the object overrided
     */
    function overrideProperties(source, target) {
        var result = angular.copy(source);

        if (angular.isUndefined(result) || result === null) {
            result = {};
        }
        if (angular.isUndefined(target) || target === null) {
            return result;
        }
        if (angular.isObject(target)) {
            for (var prop in target) {
                if (target.hasOwnProperty(prop)) {
                    result[prop] = overrideProperties(result[prop], target[prop]);
                }
            }
        } else {
            result = angular.copy(target);
        }
        return result;
    }

    /**
     * Delete the property from the given object
     * @param obj the object
     * @param propertyName the property name
     */
    function deleteProperty(obj, propertyName) {
        if (angular.isObject(obj)) {
            delete obj[propertyName];
        }
    }

    /**
     * Resolve any promises from a given object if there are any.
     * @param obj the object
     * @param excludedPropertiesName the list of properties to ignore
     * @returns {promise} the promise that the object attributes promises are all resolved
     */
    function resolveObjectPromises(obj, excludedPropertiesName) {
        var defer = $q.defer(),
            promises = [],
            resolvedObj = {},
            excludedProp = excludedPropertiesName || [];
        if (!angular.isObject(obj) || angular.isArray(obj)) {
            defer.resolve(obj);
        } else {
            resolvedObj = angular.extend(resolvedObj, obj);
            for (var prop in resolvedObj) {
                if (resolvedObj.hasOwnProperty(prop) && $.inArray(prop, excludedProp) === -1) {
                    if (angular.isArray(resolvedObj[prop])) {
                        promises.push(resolveArrayPromises(resolvedObj[prop]));
                    } else {
                        promises.push($q.when(resolvedObj[prop]));
                    }
                }
            }
            $q.all(promises).then(function(result) {
                var index = 0;
                for (var prop in resolvedObj) {
                    if (resolvedObj.hasOwnProperty(prop) && $.inArray(prop, excludedProp) === -1) {
                        resolvedObj[prop] = result[index++];
                    }
                }
                defer.resolve(resolvedObj);
            });
        }
        return defer.promise;
    }

    /**
     * Resolve the given array promises
     * @param array the array containing promise or not
     * @returns {promise} the promise that the array contains a list of objects/values promises that are resolved
     */
    function resolveArrayPromises(array) {
        var defer = $q.defer(),
            promises = [],
            resolveArray = [];
        if (!angular.isArray(array)) {
            defer.resolve(array);
        } else {
            angular.forEach(array, function(item) {
                if (angular.isObject(item)) {
                    promises.push(resolveObjectPromises(item));
                } else {
                    promises.push($q.when(item));
                }
            });
            $q.all(promises).then(function(result) {
                angular.forEach(result, function(item) {
                    resolveArray.push(item);
                });
                defer.resolve(resolveArray);
            });
        }
        return defer.promise;
    }
}

'use strict';
angular.module('datatables.options', [])
    .constant('DT_DEFAULT_OPTIONS', {
        // Default dom
        dom: 'lfrtip',
        // Default ajax properties. See http://legacy.datatables.net/usage/options#sAjaxDataProp
        sAjaxDataProp: '',
        // Set default columns (used when none are provided)
        aoColumns: []
    })
    .constant('DT_LOADING_CLASS', 'dt-loading')
    .service('DTDefaultOptions', dtDefaultOptions);

function dtDefaultOptions() {
    var options = {
        loadingTemplate: '<h3>Loading...</h3>',
        bootstrapOptions: {},
        setLoadingTemplate: setLoadingTemplate,
        setLanguageSource: setLanguageSource,
        setLanguage: setLanguage,
        setDisplayLength: setDisplayLength,
        setBootstrapOptions: setBootstrapOptions
    };

    return options;

    /**
     * Set the default loading template
     * @param loadingTemplate the HTML to display when loading the table
     * @returns {DTDefaultOptions} the default option config
     */
    function setLoadingTemplate(loadingTemplate) {
        options.loadingTemplate = loadingTemplate;
        return options;
    }

    /**
     * Set the default language source for all datatables
     * @param sLanguageSource the language source
     * @returns {DTDefaultOptions} the default option config
     */
    function setLanguageSource(sLanguageSource) {
        // HACK to resolve the language source manually instead of DT
        // See https://github.com/l-lin/angular-datatables/issues/356
        $.ajax({
            dataType: 'json',
            url: sLanguageSource,
            success: function(json) {
                $.extend(true, $.fn.dataTable.defaults, {
                    oLanguage: json
                });
            }
        });
        return options;
    }

    /**
     * Set the language for all datatables
     * @param oLanguage the language
     * @returns {DTDefaultOptions} the default option config
     */
    function setLanguage(oLanguage) {
        $.extend(true, $.fn.dataTable.defaults, {
            oLanguage: oLanguage
        });
        return options;
    }

    /**
     * Set the default number of items to display for all datatables
     * @param iDisplayLength the number of items to display
     * @returns {DTDefaultOptions} the default option config
     */
    function setDisplayLength(iDisplayLength) {
        $.extend($.fn.dataTable.defaults, {
            iDisplayLength: iDisplayLength
        });
        return options;
    }

    /**
     * Set the default options to be use for Bootstrap integration.
     * See https://github.com/l-lin/angular-datatables/blob/dev/src/angular-datatables.bootstrap.options.js to check
     * what default options Angular DataTables is using.
     * @param oBootstrapOptions an object containing the default options for Bootstrap integration
     * @returns {DTDefaultOptions} the default option config
     */
    function setBootstrapOptions(oBootstrapOptions) {
        options.bootstrapOptions = oBootstrapOptions;
        return options;
    }
}

'use strict';

angular.module('datatables.instances', ['datatables.util'])
    .factory('DTInstanceFactory', dtInstanceFactory);

function dtInstanceFactory() {
    var DTInstance = {
        reloadData: reloadData,
        changeData: changeData,
        rerender: rerender
    };
    return {
        newDTInstance: newDTInstance,
        copyDTProperties: copyDTProperties
    };

    function newDTInstance(renderer) {
        var dtInstance = Object.create(DTInstance);
        dtInstance._renderer = renderer;
        return dtInstance;
    }

    function copyDTProperties(result, dtInstance) {
        dtInstance.id = result.id;
        dtInstance.DataTable = result.DataTable;
        dtInstance.dataTable = result.dataTable;
    }

    function reloadData(callback, resetPaging) {
        /*jshint validthis:true */
        this._renderer.reloadData(callback, resetPaging);
    }

    function changeData(data) {
        /*jshint validthis:true */
        this._renderer.changeData(data);
    }

    function rerender() {
        /*jshint validthis:true */
        this._renderer.rerender();
    }
}

'use strict';
angular.module('datatables.factory', [])
    .factory('DTOptionsBuilder', dtOptionsBuilder)
    .factory('DTColumnBuilder', dtColumnBuilder)
    .factory('DTColumnDefBuilder', dtColumnDefBuilder)
    .factory('DTLoadingTemplate', dtLoadingTemplate);

/* @ngInject */
function dtOptionsBuilder() {
    /**
     * The wrapped datatables options class
     * @param sAjaxSource the ajax source to fetch the data
     * @param fnPromise the function that returns a promise to fetch the data
     */
    var DTOptions = {
        hasOverrideDom: false,

        /**
         * Add the option to the datatables options
         * @param key the key of the option
         * @param value an object or a function of the option
         * @returns {DTOptions} the options
         */
        withOption: function(key, value) {
            if (angular.isString(key)) {
                this[key] = value;
            }
            return this;
        },

        /**
         * Add the Ajax source to the options.
         * This corresponds to the "ajax" option
         * @param ajax the ajax source
         * @returns {DTOptions} the options
         */
        withSource: function(ajax) {
            this.ajax = ajax;
            return this;
        },

        /**
         * Add the ajax data properties.
         * @param sAjaxDataProp the ajax data property
         * @returns {DTOptions} the options
         */
        withDataProp: function(sAjaxDataProp) {
            this.sAjaxDataProp = sAjaxDataProp;
            return this;
        },

        /**
         * Set the server data function.
         * @param fn the function of the server retrieval
         * @returns {DTOptions} the options
         */
        withFnServerData: function(fn) {
            if (!angular.isFunction(fn)) {
                throw new Error('The parameter must be a function');
            }
            this.fnServerData = fn;
            return this;
        },

        /**
         * Set the pagination type.
         * @param sPaginationType the pagination type
         * @returns {DTOptions} the options
         */
        withPaginationType: function(sPaginationType) {
            if (angular.isString(sPaginationType)) {
                this.sPaginationType = sPaginationType;
            } else {
                throw new Error('The pagination type must be provided');
            }
            return this;
        },

        /**
         * Set the language of the datatables
         * @param language the language
         * @returns {DTOptions} the options
         */
        withLanguage: function(language) {
            this.language = language;
            return this;
        },

        /**
         * Set the language source
         * @param languageSource the language source
         * @returns {DTOptions} the options
         */
        withLanguageSource: function(languageSource) {
            return this.withLanguage({
                url: languageSource
            });
        },

        /**
         * Set default number of items per page to display
         * @param iDisplayLength the number of items per page
         * @returns {DTOptions} the options
         */
        withDisplayLength: function(iDisplayLength) {
            this.iDisplayLength = iDisplayLength;
            return this;
        },

        /**
         * Set the promise to fetch the data
         * @param fnPromise the function that returns a promise
         * @returns {DTOptions} the options
         */
        withFnPromise: function(fnPromise) {
            this.fnPromise = fnPromise;
            return this;
        },

        /**
         * Set the Dom of the DataTables.
         * @param dom the dom
         * @returns {DTOptions} the options
         */
        withDOM: function(dom) {
            this.dom = dom;
            return this;
        }
    };

    return {
        /**
         * Create a wrapped datatables options
         * @returns {DTOptions} a wrapped datatables option
         */
        newOptions: function() {
            return Object.create(DTOptions);
        },
        /**
         * Create a wrapped datatables options with the ajax source setted
         * @param ajax the ajax source
         * @returns {DTOptions} a wrapped datatables option
         */
        fromSource: function(ajax) {
            var options = Object.create(DTOptions);
            options.ajax = ajax;
            return options;
        },
        /**
         * Create a wrapped datatables options with the data promise.
         * @param fnPromise the function that returns a promise to fetch the data
         * @returns {DTOptions} a wrapped datatables option
         */
        fromFnPromise: function(fnPromise) {
            var options = Object.create(DTOptions);
            options.fnPromise = fnPromise;
            return options;
        }
    };
}

function dtColumnBuilder() {
    /**
     * The wrapped datatables column
     * @param mData the data to display of the column
     * @param sTitle the sTitle of the column title to display in the DOM
     */
    var DTColumn = {
        /**
         * Add the option of the column
         * @param key the key of the option
         * @param value an object or a function of the option
         * @returns {DTColumn} the wrapped datatables column
         */
        withOption: function(key, value) {
            if (angular.isString(key)) {
                this[key] = value;
            }
            return this;
        },

        /**
         * Set the title of the colum
         * @param sTitle the sTitle of the column
         * @returns {DTColumn} the wrapped datatables column
         */
        withTitle: function(sTitle) {
            this.sTitle = sTitle;
            return this;
        },

        /**
         * Set the CSS class of the column
         * @param sClass the CSS class
         * @returns {DTColumn} the wrapped datatables column
         */
        withClass: function(sClass) {
            this.sClass = sClass;
            return this;
        },

        /**
         * Hide the column
         * @returns {DTColumn} the wrapped datatables column
         */
        notVisible: function() {
            this.bVisible = false;
            return this;
        },

        /**
         * Set the column as not sortable
         * @returns {DTColumn} the wrapped datatables column
         */
        notSortable: function() {
            this.bSortable = false;
            return this;
        },

        /**
         * Render each cell with the given parameter
         * @mRender mRender the function/string to render the data
         * @returns {DTColumn} the wrapped datatables column
         */
        renderWith: function(mRender) {
            this.mRender = mRender;
            return this;
        }
    };

    return {
        /**
         * Create a new wrapped datatables column
         * @param mData the data of the column to display
         * @param sTitle the sTitle of the column title to display in the DOM
         * @returns {DTColumn} the wrapped datatables column
         */
        newColumn: function(mData, sTitle) {
            if (angular.isUndefined(mData)) {
                throw new Error('The parameter "mData" is not defined!');
            }
            var column = Object.create(DTColumn);
            column.mData = mData;
            if (angular.isDefined(sTitle)) {
                column.sTitle = sTitle;
            }
            return column;
        },
        DTColumn: DTColumn
    };
}

/* @ngInject */
function dtColumnDefBuilder(DTColumnBuilder) {
    return {
        newColumnDef: function(targets) {
            if (angular.isUndefined(targets)) {
                throw new Error('The parameter "targets" must be defined! See https://datatables.net/reference/option/columnDefs.targets');
            }
            var column = Object.create(DTColumnBuilder.DTColumn);
            if (angular.isArray(targets)) {
                column.aTargets = targets;
            } else {
                column.aTargets = [targets];
            }
            return column;
        }
    };
}

function dtLoadingTemplate($compile, DTDefaultOptions, DT_LOADING_CLASS) {
    return {
        compileHtml: function($scope) {
            return $compile(angular.element('<div class="' + DT_LOADING_CLASS + '">' + DTDefaultOptions.loadingTemplate + '</div>'))($scope);
        },
        isLoading: function(elem) {
            return elem.hasClass(DT_LOADING_CLASS);
        }
    };
}

'use strict';
angular.module('datatables.renderer', ['datatables.instances', 'datatables.factory', 'datatables.options', 'datatables.instances'])
    .factory('DTRendererService', dtRendererService)
    .factory('DTRenderer', dtRenderer)
    .factory('DTDefaultRenderer', dtDefaultRenderer)
    .factory('DTNGRenderer', dtNGRenderer)
    .factory('DTPromiseRenderer', dtPromiseRenderer)
    .factory('DTAjaxRenderer', dtAjaxRenderer)
    .factory('DTRendererFactory', dtRendererFactory);

/* @ngInject */
function dtRendererService(DTLoadingTemplate) {
    var plugins = [];
    var rendererService = {
        showLoading: showLoading,
        hideLoading: hideLoading,
        renderDataTable: renderDataTable,
        hideLoadingAndRenderDataTable: hideLoadingAndRenderDataTable,
        registerPlugin: registerPlugin,
        postRender: postRender,
        preRender: preRender
    };
    return rendererService;

    function showLoading($elem, $scope) {
        var $loading = angular.element(DTLoadingTemplate.compileHtml($scope));
        $elem.after($loading);
        $elem.hide();
        $loading.show();
    }

    function hideLoading($elem) {
        $elem.show();
        var next = $elem.next();
        if (DTLoadingTemplate.isLoading(next)) {
            next.remove();
        }
    }

    function renderDataTable($elem, options) {
        var dtId = '#' + $elem.attr('id');
        if ($.fn.dataTable.isDataTable(dtId) && angular.isObject(options)) {
            options.destroy = true;
        }
        // See http://datatables.net/manual/api#Accessing-the-API to understand the difference between DataTable and dataTable
        var DT = $elem.DataTable(options);
        var dt = $elem.dataTable();

        var result = {
            id: $elem.attr('id'),
            DataTable: DT,
            dataTable: dt
        };

        postRender(options, result);

        return result;
    }

    function hideLoadingAndRenderDataTable($elem, options) {
        rendererService.hideLoading($elem);
        return rendererService.renderDataTable($elem, options);
    }

    function registerPlugin(plugin) {
        plugins.push(plugin);
    }

    function postRender(options, result) {
        angular.forEach(plugins, function(plugin) {
            if (angular.isFunction(plugin.postRender)) {
                plugin.postRender(options, result);
            }
        });
    }

    function preRender(options) {
        angular.forEach(plugins, function(plugin) {
            if (angular.isFunction(plugin.preRender)) {
                plugin.preRender(options);
            }
        });
    }
}

function dtRenderer() {
    return {
        withOptions: function(options) {
            this.options = options;
            return this;
        }
    };
}

/* @ngInject */
function dtDefaultRenderer($q, DTRenderer, DTRendererService, DTInstanceFactory) {
    return {
        create: create
    };

    function create(options) {
        var _oTable;
        var _$elem;
        var _$scope;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTDefaultRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;

        function render($elem, $scope) {
            _$elem = $elem;
            _$scope = $scope;
            var dtInstance = DTInstanceFactory.newDTInstance(renderer);
            var result = DTRendererService.hideLoadingAndRenderDataTable($elem, renderer.options);
            _oTable = result.DataTable;
            DTInstanceFactory.copyDTProperties(result, dtInstance);
            return $q.when(dtInstance);
        }

        function reloadData() {
            // Do nothing
        }

        function changeData() {
            // Do nothing
        }

        function rerender() {
            _oTable.destroy();
            DTRendererService.showLoading(_$elem, _$scope);
            render(_$elem);
        }
        return renderer;
    }
}

/* @ngInject */
function dtNGRenderer($log, $q, $compile, $timeout, DTRenderer, DTRendererService, DTInstanceFactory) {
    /**
     * Renderer for displaying the Angular way
     * @param options
     * @returns {{options: *}} the renderer
     * @constructor
     */
    return {
        create: create
    };

    function create(options) {
        var _staticHTML;
        var _oTable;
        var _$elem;
        var _parentScope;
        var _newParentScope;
        var dtInstance;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTNGRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;
        return renderer;

        function render($elem, $scope, staticHTML) {
            _staticHTML = staticHTML;
            _$elem = $elem;
            _parentScope = $scope.$parent;
            dtInstance = DTInstanceFactory.newDTInstance(renderer);

            var defer = $q.defer();
            var _expression = $elem.find('tbody').html();
            // Find the resources from the comment <!-- ngRepeat: item in items --> displayed by angular in the DOM
            // This regexp is inspired by the one used in the "ngRepeat" directive
            var _match = _expression.match(/^\s*.+?\s+in\s+(\S*)\s*/m);

            if (!_match) {
                throw new Error('Expected expression in form of "_item_ in _collection_[ track by _id_]" but got "{0}".', _expression);
            }
            var _ngRepeatAttr = _match[1];

            var _alreadyRendered = false;

            _parentScope.$watchCollection(_ngRepeatAttr, function() {
                if (_oTable && _alreadyRendered) {
                    _destroyAndCompile();
                }
                $timeout(function() {
                    _alreadyRendered = true;
                    // Ensure that prerender is called when the collection is updated
                    // See https://github.com/l-lin/angular-datatables/issues/502
                    DTRendererService.preRender(renderer.options);
                    var result = DTRendererService.hideLoadingAndRenderDataTable(_$elem, renderer.options);
                    _oTable = result.DataTable;
                    DTInstanceFactory.copyDTProperties(result, dtInstance);
                    defer.resolve(dtInstance);
                }, 0, false);
            }, true);
            return defer.promise;
        }

        function reloadData() {
            $log.warn('The Angular Renderer does not support reloading data. You need to do it directly on your model');
        }

        function changeData() {
            $log.warn('The Angular Renderer does not support changing the data. You need to change your model directly.');
        }

        function rerender() {
            _destroyAndCompile();
            DTRendererService.showLoading(_$elem, _parentScope);
            // Ensure that prerender is called after loadData from promise
            // See https://github.com/l-lin/angular-datatables/issues/563
            DTRendererService.preRender(options);
            $timeout(function() {
                var result = DTRendererService.hideLoadingAndRenderDataTable(_$elem, renderer.options);
                _oTable = result.DataTable;
                DTInstanceFactory.copyDTProperties(result, dtInstance);
            }, 0, false);
        }

        function _destroyAndCompile() {
            if (_newParentScope) {
                _newParentScope.$destroy();
            }
            _oTable.ngDestroy();
            // Re-compile because we lost the angular binding to the existing data
            _$elem.html(_staticHTML);
            _newParentScope = _parentScope.$new();
            $compile(_$elem.contents())(_newParentScope);
        }
    }
}

/* @ngInject */
function dtPromiseRenderer($q, $timeout, $log, DTRenderer, DTRendererService, DTInstanceFactory) {
    /**
     * Renderer for displaying with a promise
     * @param options the options
     * @returns {{options: *}} the renderer
     * @constructor
     */
    return {
        create: create
    };

    function create(options) {
        var _oTable;
        var _loadedPromise = null;
        var _$elem;
        var _$scope;

        var dtInstance;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTPromiseRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;
        return renderer;

        function render($elem, $scope) {
            var defer = $q.defer();
            dtInstance = DTInstanceFactory.newDTInstance(renderer);
            _$elem = $elem;
            _$scope = $scope;
            _resolve(renderer.options.fnPromise, DTRendererService.renderDataTable).then(function(result) {
                _oTable = result.DataTable;
                DTInstanceFactory.copyDTProperties(result, dtInstance);
                defer.resolve(dtInstance);
            });
            return defer.promise;
        }

        function reloadData(callback, resetPaging) {
            var previousPage = _oTable && _oTable.page() ? _oTable.page() : 0;
            if (angular.isFunction(renderer.options.fnPromise)) {
                _resolve(renderer.options.fnPromise, _redrawRows).then(function(result) {
                    if (angular.isFunction(callback)) {
                        callback(result.DataTable.data());
                    }
                    if (resetPaging === false) {
                        result.DataTable.page(previousPage).draw(false);
                    }
                });
            } else {
                $log.warn('In order to use the reloadData functionality with a Promise renderer, you need to provide a function that returns a promise.');
            }
        }

        function changeData(fnPromise) {
            renderer.options.fnPromise = fnPromise;
            // We also need to set the $scope.dtOptions, otherwise, when we change the columns, it will revert to the old data
            // See https://github.com/l-lin/angular-datatables/issues/359
            _$scope.dtOptions.fnPromise = fnPromise;
            _resolve(renderer.options.fnPromise, _redrawRows);
        }

        function rerender() {
            _oTable.destroy();
            DTRendererService.showLoading(_$elem, _$scope);
            // Ensure that prerender is called after loadData from promise
            // See https://github.com/l-lin/angular-datatables/issues/563
            DTRendererService.preRender(options);
            render(_$elem, _$scope);
        }

        function _resolve(fnPromise, callback) {
            var defer = $q.defer();
            if (angular.isUndefined(fnPromise)) {
                throw new Error('You must provide a promise or a function that returns a promise!');
            }
            if (_loadedPromise) {
                _loadedPromise.then(function(){
                    defer.resolve(_startLoading(fnPromise, callback));
                });
            } else{
                defer.resolve(_startLoading(fnPromise, callback));
            }
            return defer.promise;
        }

        function _startLoading(fnPromise, callback) {
            var defer = $q.defer();
            if (angular.isFunction(fnPromise)) {
                _loadedPromise = fnPromise();
            } else {
                _loadedPromise = fnPromise;
            }
            _loadedPromise.then(function(result) {
                var data = result;
                // In case the data is nested in an object
                if (renderer.options.sAjaxDataProp) {
                    var properties = renderer.options.sAjaxDataProp.split('.');
                    while (properties.length) {
                        var property = properties.shift();
                        if (property in data) {
                            data = data[property];
                        }
                    }
                }
                _loadedPromise = null;
                defer.resolve(_doRender(renderer.options, _$elem, data, callback));
            });
            return defer.promise;
        }

        function _doRender(options, $elem, data, callback) {
            var defer = $q.defer();
            // Since Angular 1.3, the promise renderer is throwing "Maximum call stack size exceeded"
            // By removing the $promise attribute, we avoid an infinite loop when jquery is cloning the data
            // See https://github.com/l-lin/angular-datatables/issues/110
            delete data.$promise;
            options.aaData = data;
            // Add $timeout to be sure that angular has finished rendering before calling datatables
            $timeout(function() {
                DTRendererService.hideLoading($elem);
                // Set it to true in order to be able to redraw the dataTable
                options.bDestroy = true;
                defer.resolve(callback($elem, options));
            }, 0, false);
            return defer.promise;
        }

        function _redrawRows($elem, options) {
            _oTable.clear();
            _oTable.rows.add(options.aaData).draw(options.redraw);
            return {
                id: dtInstance.id,
                DataTable: dtInstance.DataTable,
                dataTable: dtInstance.dataTable
            };
        }
    }
}

/* @ngInject */
function dtAjaxRenderer($q, $timeout, DTRenderer, DTRendererService, DT_DEFAULT_OPTIONS, DTInstanceFactory) {
    /**
     * Renderer for displaying with Ajax
     * @param options the options
     * @returns {{options: *}} the renderer
     * @constructor
     */
    return {
        create: create
    };

    function create(options) {
        var _oTable;
        var _$elem;
        var _$scope;
        var renderer = Object.create(DTRenderer);
        renderer.name = 'DTAjaxRenderer';
        renderer.options = options;
        renderer.render = render;
        renderer.reloadData = reloadData;
        renderer.changeData = changeData;
        renderer.rerender = rerender;
        return renderer;

        function render($elem, $scope) {
            _$elem = $elem;
            _$scope = $scope;
            var defer = $q.defer();
            var dtInstance = DTInstanceFactory.newDTInstance(renderer);
            // Define default values in case it is an ajax datatables
            if (angular.isUndefined(renderer.options.sAjaxDataProp)) {
                renderer.options.sAjaxDataProp = DT_DEFAULT_OPTIONS.sAjaxDataProp;
            }
            if (angular.isUndefined(renderer.options.aoColumns)) {
                renderer.options.aoColumns = DT_DEFAULT_OPTIONS.aoColumns;
            }
            _doRender(renderer.options, $elem).then(function(result) {
                _oTable = result.DataTable;
                DTInstanceFactory.copyDTProperties(result, dtInstance);
                defer.resolve(dtInstance);
            });
            return defer.promise;
        }

        function reloadData(callback, resetPaging) {
            if (_oTable) {
                _oTable.ajax.reload(callback, resetPaging);
            }
        }

        function changeData(ajax) {
            renderer.options.ajax = ajax;
            // We also need to set the $scope.dtOptions, otherwise, when we change the columns, it will revert to the old data
            // See https://github.com/l-lin/angular-datatables/issues/359
            _$scope.dtOptions.ajax = ajax;
        }

        function rerender() {
            // Ensure that prerender is called after loadData from promise
            // See https://github.com/l-lin/angular-datatables/issues/563
            DTRendererService.preRender(options);
            render(_$elem, _$scope);
        }

        function _doRender(options, $elem) {
                var defer = $q.defer();
                // Destroy the table if it exists in order to be able to redraw the dataTable
                options.bDestroy = true;
                if (_oTable) {
                    _oTable.destroy();
                    DTRendererService.showLoading(_$elem, _$scope);
                    // Empty in case of columns change
                    $elem.empty();
                }
                DTRendererService.hideLoading($elem);
                // Condition to refresh the dataTable
                if (_shouldDeferRender(options)) {
                    $timeout(function() {
                        defer.resolve(DTRendererService.renderDataTable($elem, options));
                    }, 0, false);
                } else {
                    defer.resolve(DTRendererService.renderDataTable($elem, options));
                }
                return defer.promise;
            }
            // See https://github.com/l-lin/angular-datatables/issues/147
        function _shouldDeferRender(options) {
            if (angular.isDefined(options) && angular.isDefined(options.dom)) {
                // S for scroller plugin
                return options.dom.indexOf('S') >= 0;
            }
            return false;
        }
    }
}

/* @ngInject */
function dtRendererFactory(DTDefaultRenderer, DTNGRenderer, DTPromiseRenderer, DTAjaxRenderer) {
    return {
        fromOptions: fromOptions
    };

    function fromOptions(options, isNgDisplay) {
        if (isNgDisplay) {
            if (options && options.serverSide) {
                throw new Error('You cannot use server side processing along with the Angular renderer!');
            }
            return DTNGRenderer.create(options);
        }
        if (angular.isDefined(options)) {
            if (angular.isDefined(options.fnPromise) && options.fnPromise !== null) {
                if (options.serverSide) {
                    throw new Error('You cannot use server side processing along with the Promise renderer!');
                }
                return DTPromiseRenderer.create(options);
            }
            if (angular.isDefined(options.ajax) && options.ajax !== null ||
                angular.isDefined(options.ajax) && options.ajax !== null) {
                return DTAjaxRenderer.create(options);
            }
            return DTDefaultRenderer.create(options);
        }
        return DTDefaultRenderer.create();
    }
}

'use strict';

angular.module('datatables.directive', ['datatables.instances', 'datatables.renderer', 'datatables.options', 'datatables.util'])
    .directive('datatable', dataTable);

/* @ngInject */
function dataTable($q, $http, DTRendererFactory, DTRendererService, DTPropertyUtil) {
    return {
        restrict: 'A',
        scope: {
            dtOptions: '=',
            dtColumns: '=',
            dtColumnDefs: '=',
            datatable: '@',
            dtInstance: '='
        },
        compile: compileDirective,
        controller: ControllerDirective
    };

    /* @ngInject */
    function compileDirective(tElm) {
        var _staticHTML = tElm[0].innerHTML;

        return function postLink($scope, $elem, iAttrs, ctrl) {
            function handleChanges(newVal, oldVal) {
                if (newVal !== oldVal) {
                    ctrl.render($elem, ctrl.buildOptionsPromise(), _staticHTML);
                }
            }

            // Options can hold heavy data, and other deep/large objects.
            // watchcollection can improve this by only watching shallowly
            var watchFunction = iAttrs.dtDisableDeepWatchers ? '$watchCollection' : '$watch';
            angular.forEach(['dtColumns', 'dtColumnDefs', 'dtOptions'], function(tableDefField) {
                $scope[watchFunction].call($scope, tableDefField, handleChanges, true);
            });
            DTRendererService.showLoading($elem, $scope);
            ctrl.render($elem, ctrl.buildOptionsPromise(), _staticHTML);
        };
    }

    /* @ngInject */
    function ControllerDirective($scope) {
        var _dtInstance;
        var vm = this;
        vm.buildOptionsPromise = buildOptionsPromise;
        vm.render = render;

        function buildOptionsPromise() {
            var defer = $q.defer();
            // Build options
            $q.all([
                $q.when($scope.dtOptions),
                $q.when($scope.dtColumns),
                $q.when($scope.dtColumnDefs)
            ]).then(function(results) {
                var dtOptions = results[0],
                    dtColumns = results[1],
                    dtColumnDefs = results[2];
                // Since Angular 1.3, the promise throws a "Maximum call stack size exceeded" when cloning
                // See https://github.com/l-lin/angular-datatables/issues/110
                DTPropertyUtil.deleteProperty(dtOptions, '$promise');
                DTPropertyUtil.deleteProperty(dtColumns, '$promise');
                DTPropertyUtil.deleteProperty(dtColumnDefs, '$promise');
                var options;
                if (angular.isDefined(dtOptions)) {
                    options = {};
                    angular.extend(options, dtOptions);
                    // Set the columns
                    if (angular.isArray(dtColumns)) {
                        options.aoColumns = dtColumns;
                    }

                    // Set the column defs
                    if (angular.isArray(dtColumnDefs)) {
                        options.aoColumnDefs = dtColumnDefs;
                    }

                    // HACK to resolve the language source manually instead of DT
                    // See https://github.com/l-lin/angular-datatables/issues/181
                    if (options.language && options.language.url) {
                        var languageDefer = $q.defer();
                        $http.get(options.language.url).success(function(language) {
                            languageDefer.resolve(language);
                        });
                        options.language = languageDefer.promise;
                    }

                }
                return DTPropertyUtil.resolveObjectPromises(options, ['data', 'aaData', 'fnPromise']);
            }).then(function(options) {
                defer.resolve(options);
            });
            return defer.promise;
        }

        function render($elem, optionsPromise, staticHTML) {
            optionsPromise.then(function(options) {
                DTRendererService.preRender(options);

                var isNgDisplay = $scope.datatable && $scope.datatable === 'ng';
                // Render dataTable
                if (_dtInstance && _dtInstance._renderer) {
                    _dtInstance._renderer.withOptions(options)
                        .render($elem, $scope, staticHTML).then(function(dtInstance) {
                            _dtInstance = dtInstance;
                            _setDTInstance(dtInstance);
                        });
                } else {
                    DTRendererFactory.fromOptions(options, isNgDisplay)
                        .render($elem, $scope, staticHTML).then(function(dtInstance) {
                            _dtInstance = dtInstance;
                            _setDTInstance(dtInstance);
                        });
                }
            });
        }

        function _setDTInstance(dtInstance) {
            if (angular.isFunction($scope.dtInstance)) {
                $scope.dtInstance(dtInstance);
            } else if (angular.isDefined($scope.dtInstance)) {
                $scope.dtInstance = dtInstance;
            }
        }
    }
}

/*jshint camelcase: false */
'use strict';

// See http://getbootstrap.com
angular.module('datatables.bootstrap', [
        'datatables.bootstrap.options',
        'datatables.bootstrap.tabletools',
        'datatables.bootstrap.colvis'
    ])
    .config(dtBootstrapConfig)
    .run(initBootstrapPlugin)
    .service('DTBootstrap', dtBootstrap);

/* @ngInject */
function dtBootstrapConfig($provide) {
    $provide.decorator('DTOptionsBuilder', dtOptionsBuilderDecorator);

    function dtOptionsBuilderDecorator($delegate) {
        var newOptions = $delegate.newOptions;
        var fromSource = $delegate.fromSource;
        var fromFnPromise = $delegate.fromFnPromise;

        $delegate.newOptions = function() {
            return _decorateOptions(newOptions);
        };
        $delegate.fromSource = function(ajax) {
            return _decorateOptions(fromSource, ajax);
        };
        $delegate.fromFnPromise = function(fnPromise) {
            return _decorateOptions(fromFnPromise, fnPromise);
        };

        return $delegate;

        function _decorateOptions(fn, params) {
            var options = fn(params);
            options.withBootstrap = withBootstrap;
            options.withBootstrapOptions = withBootstrapOptions;
            return options;

            /**
             * Add bootstrap compatibility
             * @returns {DTOptions} the options
             */
            function withBootstrap() {
                options.hasBootstrap = true;
                // Override page button active CSS class
                if (angular.isObject(options.oClasses)) {
                    options.oClasses.sPageButtonActive = 'active';
                } else {
                    options.oClasses = {
                        sPageButtonActive: 'active'
                    };
                }
                return options;
            }

            /**
             * Add bootstrap options
             * @param bootstrapOptions the bootstrap options
             * @returns {DTOptions} the options
             */
            function withBootstrapOptions(bootstrapOptions) {
                options.bootstrap = bootstrapOptions;
                return options;
            }
        }
    }
}

/* @ngInject */
function initBootstrapPlugin(DTRendererService, DTBootstrap) {
    var columnFilterPlugin = {
        preRender: preRender
    };
    DTRendererService.registerPlugin(columnFilterPlugin);

    function preRender(options) {
        // Integrate bootstrap (or not)
        if (options && options.hasBootstrap) {
            DTBootstrap.integrate(options);
        } else {
            DTBootstrap.deIntegrate();
        }
    }
}

/**
 * Source: https://editor.datatables.net/release/DataTables/extras/Editor/examples/bootstrap.html
 */
/* @ngInject */
function dtBootstrap(DTBootstrapTableTools, DTBootstrapColVis, DTBootstrapDefaultOptions, DTPropertyUtil) {
    var _initialized = false,
        _drawCallbackFunctionList = [],
        _savedFn = {};

    return {
        integrate: integrate,
        deIntegrate: deIntegrate
    };

    function _saveFnToBeOverrided() {
        _savedFn.oStdClasses = angular.copy($.fn.dataTableExt.oStdClasses);
        _savedFn.fnPagingInfo = $.fn.dataTableExt.oApi.fnPagingInfo;
        _savedFn.renderer = angular.copy($.fn.DataTable.ext.renderer);
        if ($.fn.DataTable.TableTools) {
            _savedFn.TableTools = {
                classes: angular.copy($.fn.DataTable.TableTools.classes),
                oTags: angular.copy($.fn.DataTable.TableTools.DEFAULTS.oTags)
            };
        }
    }

    function _revertToDTFn() {
        $.extend($.fn.dataTableExt.oStdClasses, _savedFn.oStdClasses);
        $.fn.dataTableExt.oApi.fnPagingInfo = _savedFn.fnPagingInfo;
        $.extend(true, $.fn.DataTable.ext.renderer, _savedFn.renderer);
    }

    function _overrideClasses() {
        /* Default class modification */
        $.extend($.fn.dataTableExt.oStdClasses, {
            'sWrapper': 'dataTables_wrapper form-inline',
            'sFilterInput': 'form-control input-sm',
            'sLengthSelect': 'form-control input-sm',
            'sFilter': 'dataTables_filter',
            'sLength': 'dataTables_length'
        });
    }

    function _overridePagingInfo() {
        /* API method to get paging information */
        $.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings) {
            return {
                'iStart': oSettings._iDisplayStart,
                'iEnd': oSettings.fnDisplayEnd(),
                'iLength': oSettings._iDisplayLength,
                'iTotal': oSettings.fnRecordsTotal(),
                'iFilteredTotal': oSettings.fnRecordsDisplay(),
                'iPage': oSettings._iDisplayLength === -1 ? 0 : Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
                'iTotalPages': oSettings._iDisplayLength === -1 ? 0 : Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
            };
        };
    }

    function _overridePagination(bootstrapOptions) {
        // Note: Copy paste with some changes from DataTables v1.10.1 source code
        $.extend(true, $.fn.DataTable.ext.renderer, {
            pageButton: {
                _: function(settings, host, idx, buttons, page, pages) {
                    var classes = settings.oClasses;
                    var lang = settings.language ? settings.language.oPaginate : settings.oLanguage.oPaginate;
                    var btnDisplay, btnClass, counter = 0;
                    var paginationClasses = DTPropertyUtil.overrideProperties(
                        DTBootstrapDefaultOptions.getOptions().pagination,
                        bootstrapOptions ? bootstrapOptions.pagination : null
                    );
                    var $paginationContainer = $('<ul></ul>', {
                        'class': paginationClasses.classes.ul
                    });

                    var attach = function(container, buttons) {
                        var i, ien, node, button;
                        var clickHandler = function(e) {
                            e.preventDefault();
                            // IMPORTANT: Reference to internal functions of DT. It might change between versions
                            $.fn.DataTable.ext.internal._fnPageChange(settings, e.data.action, true);
                        };


                        for (i = 0, ien = buttons.length; i < ien; i++) {
                            button = buttons[i];

                            if ($.isArray(button)) {
                                // Override DT element
                                button.DT_el = 'li';
                                var inner = $('<' + (button.DT_el || 'div') + '/>')
                                    .appendTo($paginationContainer);
                                attach(inner, button);
                            } else {
                                btnDisplay = '';
                                btnClass = '';
                                var $paginationBtn = $('<li></li>'),
                                    isDisabled;

                                switch (button) {
                                    case 'ellipsis':
                                        $paginationContainer.append('<li class="disabled"><a href="#" onClick="event.preventDefault()">&hellip;</a></li>');
                                        break;

                                    case 'first':
                                        btnDisplay = lang.sFirst;
                                        btnClass = button;
                                        if (page <= 0) {
                                            $paginationBtn.addClass(classes.sPageButtonDisabled);
                                            isDisabled = true;
                                        }
                                        break;

                                    case 'previous':
                                        btnDisplay = lang.sPrevious;
                                        btnClass = button;
                                        if (page <= 0) {
                                            $paginationBtn.addClass(classes.sPageButtonDisabled);
                                            isDisabled = true;
                                        }
                                        break;

                                    case 'next':
                                        btnDisplay = lang.sNext;
                                        btnClass = button;
                                        if (page >= pages - 1) {
                                            $paginationBtn.addClass(classes.sPageButtonDisabled);
                                            isDisabled = true;
                                        }
                                        break;

                                    case 'last':
                                        btnDisplay = lang.sLast;
                                        btnClass = button;
                                        if (page >= pages - 1) {
                                            $paginationBtn.addClass(classes.sPageButtonDisabled);
                                            isDisabled = true;
                                        }
                                        break;

                                    default:
                                        btnDisplay = button + 1;
                                        btnClass = '';
                                        if (page === button) {
                                            $paginationBtn.addClass(classes.sPageButtonActive);
                                        }
                                        break;
                                }

                                if (btnDisplay) {
                                    $paginationBtn.appendTo($paginationContainer);
                                    node = $('<a>', {
                                            'href': '#',
                                            'class': btnClass,
                                            'aria-controls': settings.sTableId,
                                            'data-dt-idx': counter,
                                            'tabindex': settings.iTabIndex,
                                            'id': idx === 0 && typeof button === 'string' ?
                                                settings.sTableId + '_' + button : null
                                        })
                                        .html(btnDisplay)
                                        .appendTo($paginationBtn);

                                    // IMPORTANT: Reference to internal functions of DT. It might change between versions
                                    $.fn.DataTable.ext.internal._fnBindAction(
                                        node, {
                                            action: button
                                        }, clickHandler
                                    );

                                    counter++;
                                }
                            }
                        }
                    };

                    // IE9 throws an 'unknown error' if document.activeElement is used
                    // inside an iframe or frame. Try / catch the error. Not good for
                    // accessibility, but neither are frames.
                    try {
                        // Because this approach is destroying and recreating the paging
                        // elements, focus is lost on the select button which is bad for
                        // accessibility. So we want to restore focus once the draw has
                        // completed
                        var activeEl = $(document.activeElement).data('dt-idx');

                        // Add <ul> to the pagination
                        var container = $(host).empty();
                        $paginationContainer.appendTo(container);
                        attach(container, buttons);

                        if (activeEl !== null) {
                            $(host).find('[data-dt-idx=' + activeEl + ']').focus();
                        }
                    } catch (e) {}
                }
            }
        });
    }

    function _addDrawCallbackFunction(fn) {
        if (angular.isFunction(fn)) {
            _drawCallbackFunctionList.push(fn);
        }
    }

    function _init(bootstrapOptions) {
        if (!_initialized) {
            _saveFnToBeOverrided();
            _overrideClasses();
            _overridePagingInfo();
            _overridePagination(bootstrapOptions);

            _addDrawCallbackFunction(function() {
                $('div.dataTables_filter').find('input').addClass('form-control');
                $('div.dataTables_length').find('select').addClass('form-control');
            });

            _initialized = true;
        }
    }

    function _setDom(options) {
            if (!options.dom || options.dom === $.fn.dataTable.defaults.sDom) {
                return DTBootstrapDefaultOptions.getOptions().dom;
            }
            return options.dom;
        }
        /**
         * Integrate Bootstrap
         * @param options the datatables options
         */
    function integrate(options) {
        _init(options.bootstrap);
        DTBootstrapTableTools.integrate(options.bootstrap);
        DTBootstrapColVis.integrate(_addDrawCallbackFunction, options.bootstrap);

        options.dom = _setDom(options);
        if (angular.isUndefined(options.fnDrawCallback)) {
            // Call every drawcallback functions
            options.fnDrawCallback = function() {
                for (var index = 0; index < _drawCallbackFunctionList.length; index++) {
                    _drawCallbackFunctionList[index]();
                }
            };
        }
    }

    function deIntegrate() {
        if (_initialized) {
            _revertToDTFn();
            DTBootstrapTableTools.deIntegrate();
            DTBootstrapColVis.deIntegrate();
            _initialized = false;
        }
    }
}
'use strict';
angular.module('datatables.bootstrap.options', ['datatables.options', 'datatables.util'])
    .constant('DT_BOOTSTRAP_DEFAULT_OPTIONS', {
        TableTools: {
            classes: {
                container: 'DTTT btn-group',
                buttons: {
                    normal: 'btn btn-default',
                    disabled: 'disabled'
                },
                collection: {
                    container: 'DTTT_dropdown dropdown-menu',
                    buttons: {
                        normal: '',
                        disabled: 'disabled'
                    }
                },
                print: {
                    info: 'DTTT_print_info modal'
                },
                select: {
                    row: 'active'
                }
            },
            DEFAULTS: {
                oTags: {
                    collection: {
                        container: 'ul',
                        button: 'li',
                        liner: 'a'
                    }
                }
            }
        },
        ColVis: {
            classes: {
                masterButton: 'btn btn-default'
            }
        },
        pagination: {
            classes: {
                ul: 'pagination'
            }
        },
        dom: '<\'row\'<\'col-xs-6\'l><\'col-xs-6\'f>r>t<\'row\'<\'col-xs-6\'i><\'col-xs-6\'p>>'
    })
    .factory('DTBootstrapDefaultOptions', dtBootstrapDefaultOptions);

/* @ngInject */
function dtBootstrapDefaultOptions(DTDefaultOptions, DTPropertyUtil, DT_BOOTSTRAP_DEFAULT_OPTIONS) {
    return {
        getOptions: getOptions
    };
    /**
     * Get the default options for bootstrap integration
     * @returns {*} the bootstrap default options
     */
    function getOptions() {
        return DTPropertyUtil.overrideProperties(DT_BOOTSTRAP_DEFAULT_OPTIONS, DTDefaultOptions.bootstrapOptions);
    }
}

/*jshint camelcase: false */
'use strict';

angular.module('datatables.bootstrap.tabletools', ['datatables.bootstrap.options', 'datatables.util'])
    .service('DTBootstrapTableTools', dtBootstrapTableTools);

/* @ngInject */
function dtBootstrapTableTools(DTPropertyUtil, DTBootstrapDefaultOptions) {
    var _initializedTableTools = false,
        _savedFn = {};

    return {
        integrate: integrate,
        deIntegrate: deIntegrate
    };

    function integrate(bootstrapOptions) {
        if (!_initializedTableTools) {
            _saveFnToBeOverrided();

            /*
             * TableTools Bootstrap compatibility
             * Required TableTools 2.1+
             */
            if ($.fn.DataTable.TableTools) {
                var tableToolsOptions = DTPropertyUtil.overrideProperties(
                    DTBootstrapDefaultOptions.getOptions().TableTools,
                    bootstrapOptions ? bootstrapOptions.TableTools : null
                );
                // Set the classes that TableTools uses to something suitable for Bootstrap
                $.extend(true, $.fn.DataTable.TableTools.classes, tableToolsOptions.classes);

                // Have the collection use a bootstrap compatible dropdown
                $.extend(true, $.fn.DataTable.TableTools.DEFAULTS.oTags, tableToolsOptions.DEFAULTS.oTags);
            }

            _initializedTableTools = true;
        }
    }

    function deIntegrate() {
        if (_initializedTableTools && $.fn.DataTable.TableTools && _savedFn.TableTools) {
            $.extend(true, $.fn.DataTable.TableTools.classes, _savedFn.TableTools.classes);
            $.extend(true, $.fn.DataTable.TableTools.DEFAULTS.oTags, _savedFn.TableTools.oTags);
            _initializedTableTools = false;
        }
    }

    function _saveFnToBeOverrided() {
        if ($.fn.DataTable.TableTools) {
            _savedFn.TableTools = {
                classes: angular.copy($.fn.DataTable.TableTools.classes),
                oTags: angular.copy($.fn.DataTable.TableTools.DEFAULTS.oTags)
            };
        }
    }
}

'use strict';
angular.module('datatables.bootstrap.colvis', ['datatables.bootstrap.options', 'datatables.util'])
    .service('DTBootstrapColVis', dtBootstrapColVis);

/* @ngInject */
function dtBootstrapColVis(DTPropertyUtil, DTBootstrapDefaultOptions) {
    var _initializedColVis = false;
    return {
        integrate: integrate,
        deIntegrate: deIntegrate
    };

    function integrate(addDrawCallbackFunction, bootstrapOptions) {
        if (!_initializedColVis) {
            var colVisProperties = DTPropertyUtil.overrideProperties(
                DTBootstrapDefaultOptions.getOptions().ColVis,
                bootstrapOptions ? bootstrapOptions.ColVis : null
            );
            /* ColVis Bootstrap compatibility */
            if ($.fn.DataTable.ColVis) {
                addDrawCallbackFunction(function() {
                    $('.ColVis_MasterButton').attr('class', 'ColVis_MasterButton ' + colVisProperties.classes.masterButton);
                    $('.ColVis_Button').removeClass('ColVis_Button');
                });
            }

            _initializedColVis = true;
        }
    }

    function deIntegrate() {
        if (_initializedColVis && $.fn.DataTable.ColVis) {
            _initializedColVis = false;
        }
    }
}

/*
 * File:        jquery.dataTables.columnFilter.js
 * Version:     1.5.6.
 * Author:      Jovan Popovic
 *
 * Copyright 2011-2014 Jovan Popovic, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, as supplied with this software.
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * Parameters:"
 * @sPlaceHolder                 String      Place where inline filtering function should be placed ("tfoot", "thead:before", "thead:after"). Default is "tfoot"
 * @sRangeSeparator              String      Separator that will be used when range values are sent to the server-side. Default value is "~".
 * @sRangeFormat                 string      Default format of the From ... to ... range inputs. Default is From {from} to {to}
 * @aoColumns                    Array       Array of the filter settings that will be applied on the columns
 */
(function ($) {


    $.fn.columnFilter = function (options) {

        var asInitVals, i, label, th;

        //var sTableId = "table";
        var sRangeFormat = "From {from} to {to}";
        //Array of the functions that will override sSearch_ parameters
        var afnSearch_ = new Array();
        var aiCustomSearch_Indexes = new Array();

        var oFunctionTimeout = null;

        var fnOnFiltered = function () { };

        function _fnGetColumnValues(oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty) {
            ///<summary>
            ///Return values in the column
            ///</summary>
            ///<param name="oSettings" type="Object">DataTables settings</param>
            ///<param name="iColumn" type="int">Id of the column</param>
            ///<param name="bUnique" type="bool">Return only distinct values</param>
            ///<param name="bFiltered" type="bool">Return values only from the filtered rows</param>
            ///<param name="bIgnoreEmpty" type="bool">Ignore empty cells</param>

            // check that we have a column id
            if (typeof iColumn == "undefined") return new Array();

            // by default we only wany unique data
            if (typeof bUnique == "undefined") bUnique = true;

            // by default we do want to only look at filtered data
            if (typeof bFiltered == "undefined") bFiltered = true;

            // by default we do not wany to include empty values
            if (typeof bIgnoreEmpty == "undefined") bIgnoreEmpty = true;

            // list of rows which we're going to loop through
            var aiRows;

            // use only filtered rows
            if (bFiltered == true) aiRows = oSettings.aiDisplay;
            // use all rows
            else aiRows = oSettings.aiDisplayMaster; // all row numbers

            // set up data array
            var asResultData = new Array();

            for (var i = 0, c = aiRows.length; i < c; i++) {
                var iRow = aiRows[i];
                var aData = oTable.fnGetData(iRow);
                var sValue = aData[iColumn];

                // ignore empty values?
                if (bIgnoreEmpty == true && sValue.length == 0) continue;

                // ignore unique values?
                else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1) continue;

                // else push the value onto the result data array
                else asResultData.push(sValue);
            }

            return asResultData.sort();
        }

        function _fnColumnIndex(iColumnIndex) {
            if (properties.bUseColVis)
                return iColumnIndex;
            else
                return oTable.fnSettings().oApi._fnVisibleToColumnIndex(oTable.fnSettings(), iColumnIndex);
            //return iColumnIndex;
            //return oTable.fnSettings().oApi._fnColumnIndexToVisible(oTable.fnSettings(), iColumnIndex);
        }

        function fnCreateInput(oTable, regex, smart, bIsNumber, iFilterLength, iMaxLenght) {
            var sCSSClass = "text_filter form-control";
            if (bIsNumber)
                sCSSClass = "number_filter form-control";

            label = label.replace(/(^\s*)|(\s*$)/g, "");
            var currentFilter = oTable.fnSettings().aoPreSearchCols[i].sSearch;
            var search_init = 'search_init ';
            var inputvalue = label;
            if (currentFilter != '' && currentFilter != '^') {
                if (bIsNumber && currentFilter.charAt(0) == '^')
                    inputvalue = currentFilter.substr(1); //ignore trailing ^
                else
                    inputvalue = currentFilter;
                search_init = '';
            }

            var input = $('<input type="text" class="' + search_init + sCSSClass + '" value="' + inputvalue + '" rel="' + i + '"/>');
            if (iMaxLenght != undefined && iMaxLenght != -1) {
                input.attr('maxlength', iMaxLenght);
            }
            th.html(input);
            if (bIsNumber)
                th.wrapInner('<span class="filter_column filter_number" />');
            else
                th.wrapInner('<span class="filter_column filter_text" />');

            asInitVals[i] = label;
            var index = i;

            if (bIsNumber && !oTable.fnSettings().oFeatures.bServerSide) {
                input.keyup(function () {
                    /* Filter on the column all numbers that starts with the entered value */
                    oTable.fnFilter('^' + this.value, _fnColumnIndex(index), true, false); //Issue 37
                    fnOnFiltered();
                });
            } else {
                input.keyup(function () {
                    if (oTable.fnSettings().oFeatures.bServerSide && iFilterLength != 0) {
                        //If filter length is set in the server-side processing mode
                        //Check has the user entered at least iFilterLength new characters

                        var currentFilter = oTable.fnSettings().aoPreSearchCols[index].sSearch;
                        var iLastFilterLength = $(this).data("dt-iLastFilterLength");
                        if (typeof iLastFilterLength == "undefined")
                            iLastFilterLength = 0;
                        var iCurrentFilterLength = this.value.length;
                        if (Math.abs(iCurrentFilterLength - iLastFilterLength) < iFilterLength
                        //&& currentFilter.length == 0 //Why this?
                        ) {
                            //Cancel the filtering
                            return;
                        }
                        else {
                            //Remember the current filter length
                            $(this).data("dt-iLastFilterLength", iCurrentFilterLength);
                        }
                    }
                    /* Filter on the column (the index) of this element */
                    oTable.fnFilter(this.value, _fnColumnIndex(index), regex, smart); //Issue 37
                    fnOnFiltered();
                });
            }

            input.focus(function () {
                if ($(this).hasClass("search_init")) {
                    $(this).removeClass("search_init");
                    this.value = "";
                }
            });
            input.blur(function () {
                if (this.value == "") {
                    $(this).addClass("search_init");
                    this.value = asInitVals[index];
                }
            });
        }

        function fnCreateRangeInput(oTable) {

            //var currentFilter = oTable.fnSettings().aoPreSearchCols[i].sSearch;
            th.html(_fnRangeLabelPart(0));
            var sFromId = oTable.attr("id") + '_range_from_' + i;
            var from = $('<input type="text" class="number_range_filter form-control" id="' + sFromId + '" rel="' + i + '"/>');
            th.append(from);
            th.append(_fnRangeLabelPart(1));
            var sToId = oTable.attr("id") + '_range_to_' + i;
            var to = $('<input type="text" class="number_range_filter form-control" id="' + sToId + '" rel="' + i + '"/>');
            th.append(to);
            th.append(_fnRangeLabelPart(2));
            th.wrapInner('<span class="filter_column filter_number_range form-control" />');
            var index = i;
            aiCustomSearch_Indexes.push(i);



            //------------start range filtering function


            /* 	Custom filtering function which will filter data in column four between two values
             *	Author: 	Allan Jardine, Modified by Jovan Popovic
             */
            //$.fn.dataTableExt.afnFiltering.push(
            oTable.dataTableExt.afnFiltering.push(
                function (oSettings, aData, iDataIndex) {
                    if (oTable.attr("id") != oSettings.sTableId)
                        return true;
                    // Try to handle missing nodes more gracefully
                    if (document.getElementById(sFromId) == null)
                        return true;
                    var iMin = document.getElementById(sFromId).value * 1;
                    var iMax = document.getElementById(sToId).value * 1;
                    var iValue = aData[_fnColumnIndex(index)] == "-" ? 0 : aData[_fnColumnIndex(index)] * 1;
                    if (iMin == "" && iMax == "") {
                        return true;
                    }
                    else if (iMin == "" && iValue <= iMax) {
                        return true;
                    }
                    else if (iMin <= iValue && "" == iMax) {
                        return true;
                    }
                    else if (iMin <= iValue && iValue <= iMax) {
                        return true;
                    }
                    return false;
                }
            );
            //------------end range filtering function



            $('#' + sFromId + ',#' + sToId, th).keyup(function () {

                var iMin = document.getElementById(sFromId).value * 1;
                var iMax = document.getElementById(sToId).value * 1;
                if (iMin != 0 && iMax != 0 && iMin > iMax)
                    return;

                oTable.fnDraw();
                fnOnFiltered();
            });


        }


        function fnCreateDateRangeInput(oTable) {

            var aoFragments = sRangeFormat.split(/[}{]/);

            th.html("");
            //th.html(_fnRangeLabelPart(0));
            var sFromId = oTable.attr("id") + '_range_from_' + i;
            var from = $('<input type="text" class="date_range_filter form-control" id="' + sFromId + '" rel="' + i + '"/>');
            from.datepicker();
            //th.append(from);
            //th.append(_fnRangeLabelPart(1));
            var sToId = oTable.attr("id") + '_range_to_' + i;
            var to = $('<input type="text" class="date_range_filter form-control" id="' + sToId + '" rel="' + i + '"/>');
            //th.append(to);
            //th.append(_fnRangeLabelPart(2));

            for (ti = 0; ti < aoFragments.length; ti++) {

                if (aoFragments[ti] == properties.sDateFromToken) {
                    th.append(from);
                } else {
                    if (aoFragments[ti] == properties.sDateToToken) {
                        th.append(to);
                    } else {
                        th.append(aoFragments[ti]);
                    }
                }


            }


            th.wrapInner('<span class="filter_column filter_date_range" />');
            to.datepicker();
            var index = i;
            aiCustomSearch_Indexes.push(i);


            //------------start date range filtering function

            //$.fn.dataTableExt.afnFiltering.push(
            oTable.dataTableExt.afnFiltering.push(
                function (oSettings, aData, iDataIndex) {
                    if (oTable.attr("id") != oSettings.sTableId)
                        return true;

                    var dStartDate = from.datepicker("getDate");

                    var dEndDate = to.datepicker("getDate");

                    if (dStartDate == null && dEndDate == null) {
                        return true;
                    }

                    var dCellDate = null;
                    try {
                        if (aData[_fnColumnIndex(index)] == null || aData[_fnColumnIndex(index)] == "")
                            return false;
                        dCellDate = $.datepicker.parseDate($.datepicker.regional[""].dateFormat, aData[_fnColumnIndex(index)]);
                    } catch (ex) {
                        return false;
                    }
                    if (dCellDate == null)
                        return false;


                    if (dStartDate == null && dCellDate <= dEndDate) {
                        return true;
                    }
                    else if (dStartDate <= dCellDate && dEndDate == null) {
                        return true;
                    }
                    else if (dStartDate <= dCellDate && dCellDate <= dEndDate) {
                        return true;
                    }
                    return false;
                }
            );
            //------------end date range filtering function

            $('#' + sFromId + ',#' + sToId, th).change(function () {
                oTable.fnDraw();
                fnOnFiltered();
            });


        }

        function fnCreateColumnSelect(oTable, aData, iColumn, nTh, sLabel, bRegex, oSelected, bMultiselect) {
            if (aData == null)
                aData = _fnGetColumnValues(oTable.fnSettings(), iColumn, true, false, true);
            var index = iColumn;
            var currentFilter = oTable.fnSettings().aoPreSearchCols[i].sSearch;
            if (currentFilter == null || currentFilter == "")//Issue 81
                currentFilter = oSelected;

            var r = '<select class="search_init select_filter form-control" rel="' + i + '"><option value="" class="search_init">' + sLabel + '</option>';
            if(bMultiselect) {
                r = '<select class="search_init select_filter form-control" rel="' + i + '" multiple>';
            }
            var j = 0;
            var iLen = aData.length;
            for (j = 0; j < iLen; j++) {
                if (typeof (aData[j]) != 'object') {
                    var selected = '';
                    if (escape(aData[j]) == currentFilter
                        || escape(aData[j]) == escape(currentFilter)
                    )
                        selected = 'selected '
                    r += '<option ' + selected + ' value="' + escape(aData[j]) + '">' + aData[j] + '</option>';
                }
                else {
                    var selected = '';
                    if (bRegex) {
                        //Do not escape values if they are explicitely set to avoid escaping special characters in the regexp
                        if (aData[j].value == currentFilter) selected = 'selected ';
                        r += '<option ' + selected + 'value="' + aData[j].value + '">' + aData[j].label + '</option>';
                    } else {
                        if (escape(aData[j].value) == currentFilter) selected = 'selected ';
                        r += '<option ' + selected + 'value="' + escape(aData[j].value) + '">' + aData[j].label + '</option>';
                    }
                }
            }

            var select = $(r + '</select>');
            nTh.html(select);
            nTh.wrapInner('<span class="filter_column filter_select" />');

            if(bMultiselect) {
                select.change(function () {
                    if ($(this).val() != "") {
                        $(this).removeClass("search_init");
                    } else {
                        $(this).addClass("search_init");
                    }
                    var selectedOptions = $(this).val();
                    var asEscapedFilters = [];
                    if(selectedOptions==null || selectedOptions==[]){
                        var re = '^(.*)$';
                    }else{
                        $.each( selectedOptions, function( i, sFilter ) {
                            asEscapedFilters.push( fnRegExpEscape( sFilter ) );
                        } );
                        var re = '^(' + asEscapedFilters.join('|') + ')$';
                    }

                    oTable.fnFilter( re, index, true, false );
                });
            } else {
                select.change(function () {
                    //var val = $(this).val();
                    if ($(this).val() != "") {
                        $(this).removeClass("search_init");
                    } else {
                        $(this).addClass("search_init");
                    }
                    if (bRegex)
                        oTable.fnFilter($(this).val(), iColumn, bRegex); //Issue 41
                    else
                        oTable.fnFilter(unescape($(this).val()), iColumn); //Issue 25
                    fnOnFiltered();
                });
                if (currentFilter != null && currentFilter != "")//Issue 81
                    oTable.fnFilter(unescape(currentFilter), iColumn);
            }
        }

        function fnCreateSelect(oTable, aData, bRegex, oSelected, bMultiselect) {
            var oSettings = oTable.fnSettings();
            if ( (aData == null || typeof(aData) == 'function' ) && oSettings.sAjaxSource != "" && !oSettings.oFeatures.bServerSide) {
                // Add a function to the draw callback, which will check for the Ajax data having
                // been loaded. Use a closure for the individual column elements that are used to
                // built the column filter, since 'i' and 'th' (etc) are locally "global".
                oSettings.aoDrawCallback.push({
                    "fn": (function (iColumn, nTh, sLabel) {
                        return function (oSettings) {
                            // Only rebuild the select on the second draw - i.e. when the Ajax
                            // data has been loaded.
                            if (oSettings.iDraw == 2 && oSettings.sAjaxSource != null && oSettings.sAjaxSource != "" && !oSettings.oFeatures.bServerSide) {
                                return fnCreateColumnSelect(oTable, aData && aData(oSettings.aoData, oSettings), _fnColumnIndex(iColumn), nTh, sLabel, bRegex, oSelected, bMultiselect); //Issue 37
                            }
                        };
                    })(i, th, label),
                    "sName": "column_filter_" + i
                });
            }
            // Regardless of the Ajax state, build the select on first pass
            fnCreateColumnSelect(oTable, typeof(aData) == 'function' ? null: aData, _fnColumnIndex(i), th, label, bRegex, oSelected, bMultiselect); //Issue 37

        }

        function fnRegExpEscape( sText ) {
            return sText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };

        function fnCreateDropdown(aData) {
            var index = i;
            var r = '<div class="dropdown select_filter form-control"><a class="dropdown-toggle" data-toggle="dropdown" href="#">' + label + '<b class="caret"></b></a><ul class="dropdown-menu" role="menu"><li data-value=""><a>Show All</a></li>', j, iLen = aData.length;

            for (j = 0; j < iLen; j++) {
                r += '<li data-value="' + aData[j] + '"><a>' + aData[j] + '</a></li>';
            }
            var select = $(r + '</ul></div>');
            th.html(select);
            th.wrapInner('<span class="filterColumn filter_select" />');
            select.find('li').click(function () {
                oTable.fnFilter($(this).data('value'), index);
            });
        }


        function fnCreateCheckbox(oTable, aData) {

            if (aData == null)
                aData = _fnGetColumnValues(oTable.fnSettings(), i, true, true, true);
            var index = i;

            var r = '', j, iLen = aData.length;

            //clean the string
            var localLabel = label.replace('%', 'Perc').replace("&", "AND").replace("$", "DOL").replace("£", "STERL").replace("@", "AT").replace(/\s/g, "_");
            localLabel = localLabel.replace(/[^a-zA-Z 0-9]+/g, '');
            //clean the string

            //button label override
            var labelBtn = label;
            if (properties.sFilterButtonText != null || properties.sFilterButtonText != undefined) {
                labelBtn = properties.sFilterButtonText;
            }

            var relativeDivWidthToggleSize = 10;
            var numRow = 12; //numero di checkbox per colonna
            var numCol = Math.floor(iLen / numRow);
            if (iLen % numRow > 0) {
                numCol = numCol + 1;
            };

            //count how many column should be generated and split the div size
            var divWidth = 100 / numCol - 2;

            var divWidthToggle = relativeDivWidthToggleSize * numCol;

            if (numCol == 1) {
                divWidth = 20;
            }

            var divRowDef = '<div style="float:left; min-width: ' + divWidth + '%; " >';
            var divClose = '</div>';

            var uniqueId = oTable.attr("id") + localLabel;
            var buttonId = "chkBtnOpen" + uniqueId;
            var checkToggleDiv = uniqueId + "-flt-toggle";
            r += '<button id="' + buttonId + '" class="checkbox_filter btn btn-default" > ' + labelBtn + '</button>'; //filter button witch open dialog
            r += '<div id="' + checkToggleDiv + '" '
            + 'title="' + label + '" '
            + 'rel="' + i + '" '
            + 'class="toggle-check ui-widget-content ui-corner-all"  style="width: ' + (divWidthToggle) + '%; " >'; //dialog div
            //r+= '<div align="center" style="margin-top: 5px; "> <button id="'+buttonId+'Reset" class="checkbox_filter" > reset </button> </div>'; //reset button and its div
            r += divRowDef;

            for (j = 0; j < iLen; j++) {

                //if last check close div
                if (j % numRow == 0 && j != 0) {
                    r += divClose + divRowDef;
                }

                var sLabel = aData[j];
                var sValue = aData[j];

                if (typeof (aData[j]) == 'object') {
                    sLabel = aData[j].label;
                    sValue = aData[j].value;
                }

                //check button
                r += '<input class="search_init checkbox_filter btn btn-default" type="checkbox" id= "' + uniqueId + '_cb_' + sValue + '" name= "' + localLabel + '" value="' + sValue + '" >' + sLabel + '<br/>';

                var checkbox = $(r);
                th.html(checkbox);
                th.wrapInner('<span class="filter_column filter_checkbox" />');
                //on every checkbox selection
                checkbox.change(function () {

                    var search = '';
                    var or = '|'; //var for select checks in 'or' into the regex
                    var resSize = $('input:checkbox[name="' + localLabel + '"]:checked').size();
                    $('input:checkbox[name="' + localLabel + '"]:checked').each(function (index) {

                        //search = search + ' ' + $(this).val();
                        //concatenation for selected checks in or
                        if ((index == 0 && resSize == 1)
                            || (index != 0 && index == resSize - 1)) {
                            or = '';
                        }
                        //trim
                        search = search.replace(/^\s+|\s+$/g, "");
                        search = search + $(this).val() + or;
                        or = '|';

                    });


                    if (search != "") {
                        $('input:checkbox[name="' + localLabel + '"]').removeClass("search_init");
                    } else {
                        $('input:checkbox[name="' + localLabel + '"]').addClass("search_init");
                    }
                    /* Old code for setting search_init CSS class on checkboxes if any of them is checked
                     for (var jj = 0; jj < iLen; jj++) {
                     if (search != "") {
                     $('#' + aData[jj]).removeClass("search_init");
                     } else {
                     $('#' + aData[jj]).addClass("search_init");
                     }
                     }
                     */

                    //execute search
                    oTable.fnFilter(search, index, true, false);
                    fnOnFiltered();
                });
            }

            //filter button
            $('#' + buttonId).button();
            //dialog
            $('#' + checkToggleDiv).dialog({
                //height: 140,
                autoOpen: false,
                //show: "blind",
                hide: "blind",
                buttons: [{
                    text: "Reset",
                    click: function () {
                        //$('#'+buttonId).removeClass("filter_selected"); //LM remove border if filter selected
                        $('input:checkbox[name="' + localLabel + '"]:checked').each(function (index3) {
                            $(this).attr('checked', false);
                            $(this).addClass("search_init");
                        });
                        oTable.fnFilter('', index, true, false);
                        fnOnFiltered();
                        return false;
                    }
                },
                    {
                        text: "Close",
                        click: function () { $(this).dialog("close"); }
                    }
                ]
            });


            $('#' + buttonId).click(function () {

                $('#' + checkToggleDiv).dialog('open');
                var target = $(this);
                $('#' + checkToggleDiv).dialog("widget").position({ my: 'top',
                    at: 'bottom',
                    of: target
                });

                return false;
            });

            var fnOnFilteredCurrent = fnOnFiltered;

            fnOnFiltered = function () {
                var target = $('#' + buttonId);
                $('#' + checkToggleDiv).dialog("widget").position({ my: 'top',
                    at: 'bottom',
                    of: target
                });
                fnOnFilteredCurrent();
            };
            //reset
            /*
             $('#'+buttonId+"Reset").button();
             $('#'+buttonId+"Reset").click(function(){
             $('#'+buttonId).removeClass("filter_selected"); //LM remove border if filter selected
             $('input:checkbox[name="'+localLabel+'"]:checked').each(function(index3) {
             $(this).attr('checked', false);
             $(this).addClass("search_init");
             });
             oTable.fnFilter('', index, true, false);
             return false;
             });
             */
        }




        function _fnRangeLabelPart(iPlace) {
            switch (iPlace) {
                case 0:
                    return sRangeFormat.substring(0, sRangeFormat.indexOf("{from}"));
                case 1:
                    return sRangeFormat.substring(sRangeFormat.indexOf("{from}") + 6, sRangeFormat.indexOf("{to}"));
                default:
                    return sRangeFormat.substring(sRangeFormat.indexOf("{to}") + 4);
            }
        }




        var oTable = this;

        var defaults = {
            sPlaceHolder: "foot",
            sRangeSeparator: "~",
            iFilteringDelay: 500,
            aoColumns: null,
            sRangeFormat: "From {from} to {to}",
            sDateFromToken: "from",
            sDateToToken: "to"
        };

        var properties = $.extend(defaults, options);

        return this.each(function () {

            if (!oTable.fnSettings().oFeatures.bFilter)
                return;
            asInitVals = new Array();

            var aoFilterCells = oTable.fnSettings().aoFooter[0];

            var oHost = oTable.fnSettings().nTFoot; //Before fix for ColVis
            var sFilterRow = "tr"; //Before fix for ColVis

            if (properties.sPlaceHolder == "head:after") {
                var tr = $("tr:first", oTable.fnSettings().nTHead).detach();
                //tr.appendTo($(oTable.fnSettings().nTHead));
                if (oTable.fnSettings().bSortCellsTop) {
                    tr.prependTo($(oTable.fnSettings().nTHead));
                    //tr.appendTo($("thead", oTable));
                    aoFilterCells = oTable.fnSettings().aoHeader[1];
                }
                else {
                    tr.appendTo($(oTable.fnSettings().nTHead));
                    //tr.prependTo($("thead", oTable));
                    aoFilterCells = oTable.fnSettings().aoHeader[0];
                }

                sFilterRow = "tr:last";
                oHost = oTable.fnSettings().nTHead;

            } else if (properties.sPlaceHolder == "head:before") {

                if (oTable.fnSettings().bSortCellsTop) {
                    var tr = $("tr:first", oTable.fnSettings().nTHead).detach();
                    tr.appendTo($(oTable.fnSettings().nTHead));
                    aoFilterCells = oTable.fnSettings().aoHeader[1];
                } else {
                    aoFilterCells = oTable.fnSettings().aoHeader[0];
                }
                /*else {
                 //tr.prependTo($("thead", oTable));
                 sFilterRow = "tr:first";
                 }*/

                sFilterRow = "tr:first";

                oHost = oTable.fnSettings().nTHead;


            }

            //$(sFilterRow + " th", oHost).each(function (index) {//bug with ColVis
            $(aoFilterCells).each(function (index) {//fix for ColVis
                i = index;
                var aoColumn = { type: "text",
                    bRegex: false,
                    bSmart: true,
                    iMaxLenght: -1,
                    iFilterLength: 0
                };
                if (properties.aoColumns != null) {
                    if (properties.aoColumns.length < i || properties.aoColumns[i] == null)
                        return;
                    aoColumn = properties.aoColumns[i];
                }
                //label = $(this).text(); //Before fix for ColVis
                label = $($(this)[0].cell).text(); //Fix for ColVis
                if (aoColumn.sSelector == null) {
                    //th = $($(this)[0]);//Before fix for ColVis
                    th = $($(this)[0].cell); //Fix for ColVis
                }
                else {
                    th = $(aoColumn.sSelector);
                    if (th.length == 0)
                        th = $($(this)[0].cell);
                }

                if (aoColumn != null) {
                    if (aoColumn.sRangeFormat != null)
                        sRangeFormat = aoColumn.sRangeFormat;
                    else
                        sRangeFormat = properties.sRangeFormat;
                    switch (aoColumn.type) {
                        case "null":
                            break;
                        case "number":
                            fnCreateInput(oTable, true, false, true, aoColumn.iFilterLength, aoColumn.iMaxLenght);
                            break;
                        case "select":
                            if (aoColumn.bRegex != true)
                                aoColumn.bRegex = false;
                            fnCreateSelect(oTable, aoColumn.values, aoColumn.bRegex, aoColumn.selected, aoColumn.multiple);
                            break;
                        case "number-range":
                            fnCreateRangeInput(oTable);
                            break;
                        case "date-range":
                            fnCreateDateRangeInput(oTable);
                            break;
                        case "checkbox":
                            fnCreateCheckbox(oTable, aoColumn.values);
                            break;
                        case "twitter-dropdown":
                        case "dropdown":
                            fnCreateDropdown(aoColumn.values);
                            break;
                        case "text":
                        default:
                            bRegex = (aoColumn.bRegex == null ? false : aoColumn.bRegex);
                            bSmart = (aoColumn.bSmart == null ? false : aoColumn.bSmart);
                            fnCreateInput(oTable, bRegex, bSmart, false, aoColumn.iFilterLength, aoColumn.iMaxLenght);
                            break;

                    }
                }
            });

            for (j = 0; j < aiCustomSearch_Indexes.length; j++) {
                //var index = aiCustomSearch_Indexes[j];
                var fnSearch_ = function () {
                    var id = oTable.attr("id");
                    return $("#" + id + "_range_from_" + aiCustomSearch_Indexes[j]).val() + properties.sRangeSeparator + $("#" + id + "_range_to_" + aiCustomSearch_Indexes[j]).val()
                }
                afnSearch_.push(fnSearch_);
            }

            if (oTable.fnSettings().oFeatures.bServerSide) {

                var fnServerDataOriginal = oTable.fnSettings().fnServerData;

                oTable.fnSettings().fnServerData = function (sSource, aoData, fnCallback) {

                    for (j = 0; j < aiCustomSearch_Indexes.length; j++) {
                        var index = aiCustomSearch_Indexes[j];

                        for (k = 0; k < aoData.length; k++) {
                            if (aoData[k].name == "sSearch_" + index)
                                aoData[k].value = afnSearch_[j]();
                        }
                    }
                    aoData.push({ "name": "sRangeSeparator", "value": properties.sRangeSeparator });

                    if (fnServerDataOriginal != null) {
                        try {
                            fnServerDataOriginal(sSource, aoData, fnCallback, oTable.fnSettings()); //TODO: See Issue 18
                        } catch (ex) {
                            fnServerDataOriginal(sSource, aoData, fnCallback);
                        }
                    }
                    else {
                        $.getJSON(sSource, aoData, function (json) {
                            fnCallback(json)
                        });
                    }
                };

            }

        });

    };




})(jQuery);

'use strict';

// See http://jquery-datatables-column-filter.googlecode.com/svn/trunk/index.html
angular.module('datatables.columnfilter', ['datatables'])
    .config(dtColumnFilterConfig)
    .run(initColumnFilterPlugin);

/* @ngInject */
function dtColumnFilterConfig($provide) {
    $provide.decorator('DTOptionsBuilder', dtOptionsBuilderDecorator);

    function dtOptionsBuilderDecorator($delegate) {
        var newOptions = $delegate.newOptions;
        var fromSource = $delegate.fromSource;
        var fromFnPromise = $delegate.fromFnPromise;

        $delegate.newOptions = function() {
            return _decorateOptions(newOptions);
        };
        $delegate.fromSource = function(ajax) {
            return _decorateOptions(fromSource, ajax);
        };
        $delegate.fromFnPromise = function(fnPromise) {
            return _decorateOptions(fromFnPromise, fnPromise);
        };

        return $delegate;

        function _decorateOptions(fn, params) {
            var options = fn(params);
            options.withColumnFilter = withColumnFilter;
            return options;

            /**
             * Add column filter support
             * @param columnFilterOptions the plugins options
             * @returns {DTOptions} the options
             */
            function withColumnFilter(columnFilterOptions) {
                options.hasColumnFilter = true;
                if (columnFilterOptions) {
                    options.columnFilterOptions = columnFilterOptions;
                }
                return options;
            }
        }
    }
}

/* @ngInject */
function initColumnFilterPlugin(DTRendererService) {
    var columnFilterPlugin = {
        postRender: postRender
    };
    DTRendererService.registerPlugin(columnFilterPlugin);

    function postRender(options, result) {
        if (options && options.hasColumnFilter) {
            result.dataTable.columnFilter(options.columnFilterOptions);
        }
    }
}

'use strict';

// See https://datatables.net/extensions/fixedcolumns/
angular.module('datatables.fixedcolumns', ['datatables'])
    .config(dtFixedColumnsConfig);

/* @ngInject */
function dtFixedColumnsConfig($provide) {
    $provide.decorator('DTOptionsBuilder', dtOptionsBuilderDecorator);

    function dtOptionsBuilderDecorator($delegate) {
        var newOptions = $delegate.newOptions;
        var fromSource = $delegate.fromSource;
        var fromFnPromise = $delegate.fromFnPromise;

        $delegate.newOptions = function() {
            return _decorateOptions(newOptions);
        };
        $delegate.fromSource = function(ajax) {
            return _decorateOptions(fromSource, ajax);
        };
        $delegate.fromFnPromise = function(fnPromise) {
            return _decorateOptions(fromFnPromise, fnPromise);
        };

        return $delegate;

        function _decorateOptions(fn, params) {
            var options = fn(params);
            options.withFixedColumns = withFixedColumns;
            return options;

            /**
             * Add fixed columns support
             * @param fixedColumnsOptions the plugin options
             * @returns {DTOptions} the options
             */
            function withFixedColumns(fixedColumnsOptions) {
                options.fixedColumns = true;
                if (fixedColumnsOptions) {
                    options.fixedColumns = fixedColumnsOptions;
                }
                return options;
            }
        }
    }
}

/*! FixedColumns 3.2.0
 * ©2010-2014 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     FixedColumns
 * @description Freeze columns in place on a scrolling DataTable
 * @version     3.2.0
 * @file        dataTables.fixedColumns.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2010-2014 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * When making use of DataTables' x-axis scrolling feature, you may wish to
 * fix the left most column in place. This plug-in for DataTables provides
 * exactly this option (note for non-scrolling tables, please use the
 * FixedHeader plug-in, which can fix headers, footers and columns). Key
 * features include:
 *
 * * Freezes the left or right most columns to the side of the table
 * * Option to freeze two or more columns
 * * Full integration with DataTables' scrolling options
 * * Speed - FixedColumns is fast in its operation
 *
 *  @class
 *  @constructor
 *  @global
 *  @param {object} dt DataTables instance. With DataTables 1.10 this can also
 *    be a jQuery collection, a jQuery selector, DataTables API instance or
 *    settings object.
 *  @param {object} [init={}] Configuration object for FixedColumns. Options are
 *    defined by {@link FixedColumns.defaults}
 *
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.8.0+
 *
 *  @example
 *      var table = $('#example').dataTable( {
 *        "scrollX": "100%"
 *      } );
 *      new $.fn.dataTable.fixedColumns( table );
 */
var FixedColumns = function ( dt, init ) {
	var that = this;

	/* Sanity check - you just know it will happen */
	if ( ! ( this instanceof FixedColumns ) ) {
		alert( "FixedColumns warning: FixedColumns must be initialised with the 'new' keyword." );
		return;
	}

	if ( init === undefined || init === true ) {
		init = {};
	}

	// Use the DataTables Hungarian notation mapping method, if it exists to
	// provide forwards compatibility for camel case variables
	var camelToHungarian = $.fn.dataTable.camelToHungarian;
	if ( camelToHungarian ) {
		camelToHungarian( FixedColumns.defaults, FixedColumns.defaults, true );
		camelToHungarian( FixedColumns.defaults, init );
	}

	// v1.10 allows the settings object to be got form a number of sources
	var dtSettings = new $.fn.dataTable.Api( dt ).settings()[0];

	/**
	 * Settings object which contains customisable information for FixedColumns instance
	 * @namespace
	 * @extends FixedColumns.defaults
	 * @private
	 */
	this.s = {
		/**
		 * DataTables settings objects
		 *  @type     object
		 *  @default  Obtained from DataTables instance
		 */
		"dt": dtSettings,

		/**
		 * Number of columns in the DataTable - stored for quick access
		 *  @type     int
		 *  @default  Obtained from DataTables instance
		 */
		"iTableColumns": dtSettings.aoColumns.length,

		/**
		 * Original outer widths of the columns as rendered by DataTables - used to calculate
		 * the FixedColumns grid bounding box
		 *  @type     array.<int>
		 *  @default  []
		 */
		"aiOuterWidths": [],

		/**
		 * Original inner widths of the columns as rendered by DataTables - used to apply widths
		 * to the columns
		 *  @type     array.<int>
		 *  @default  []
		 */
		"aiInnerWidths": []
	};


	/**
	 * DOM elements used by the class instance
	 * @namespace
	 * @private
	 *
	 */
	this.dom = {
		/**
		 * DataTables scrolling element
		 *  @type     node
		 *  @default  null
		 */
		"scroller": null,

		/**
		 * DataTables header table
		 *  @type     node
		 *  @default  null
		 */
		"header": null,

		/**
		 * DataTables body table
		 *  @type     node
		 *  @default  null
		 */
		"body": null,

		/**
		 * DataTables footer table
		 *  @type     node
		 *  @default  null
		 */
		"footer": null,

		/**
		 * Display grid elements
		 * @namespace
		 */
		"grid": {
			/**
			 * Grid wrapper. This is the container element for the 3x3 grid
			 *  @type     node
			 *  @default  null
			 */
			"wrapper": null,

			/**
			 * DataTables scrolling element. This element is the DataTables
			 * component in the display grid (making up the main table - i.e.
			 * not the fixed columns).
			 *  @type     node
			 *  @default  null
			 */
			"dt": null,

			/**
			 * Left fixed column grid components
			 * @namespace
			 */
			"left": {
				"wrapper": null,
				"head": null,
				"body": null,
				"foot": null
			},

			/**
			 * Right fixed column grid components
			 * @namespace
			 */
			"right": {
				"wrapper": null,
				"head": null,
				"body": null,
				"foot": null
			}
		},

		/**
		 * Cloned table nodes
		 * @namespace
		 */
		"clone": {
			/**
			 * Left column cloned table nodes
			 * @namespace
			 */
			"left": {
				/**
				 * Cloned header table
				 *  @type     node
				 *  @default  null
				 */
				"header": null,

				/**
				 * Cloned body table
				 *  @type     node
				 *  @default  null
				 */
				"body": null,

				/**
				 * Cloned footer table
				 *  @type     node
				 *  @default  null
				 */
				"footer": null
			},

			/**
			 * Right column cloned table nodes
			 * @namespace
			 */
			"right": {
				/**
				 * Cloned header table
				 *  @type     node
				 *  @default  null
				 */
				"header": null,

				/**
				 * Cloned body table
				 *  @type     node
				 *  @default  null
				 */
				"body": null,

				/**
				 * Cloned footer table
				 *  @type     node
				 *  @default  null
				 */
				"footer": null
			}
		}
	};

	if ( dtSettings._oFixedColumns ) {
		throw 'FixedColumns already initialised on this table';
	}

	/* Attach the instance to the DataTables instance so it can be accessed easily */
	dtSettings._oFixedColumns = this;

	/* Let's do it */
	if ( ! dtSettings._bInitComplete )
	{
		dtSettings.oApi._fnCallbackReg( dtSettings, 'aoInitComplete', function () {
			that._fnConstruct( init );
		}, 'FixedColumns' );
	}
	else
	{
		this._fnConstruct( init );
	}
};



$.extend( FixedColumns.prototype , {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	/**
	 * Update the fixed columns - including headers and footers. Note that FixedColumns will
	 * automatically update the display whenever the host DataTable redraws.
	 *  @returns {void}
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      var fc = new $.fn.dataTable.fixedColumns( table );
	 *
	 *      // at some later point when the table has been manipulated....
	 *      fc.fnUpdate();
	 */
	"fnUpdate": function ()
	{
		this._fnDraw( true );
	},


	/**
	 * Recalculate the resizes of the 3x3 grid that FixedColumns uses for display of the table.
	 * This is useful if you update the width of the table container. Note that FixedColumns will
	 * perform this function automatically when the window.resize event is fired.
	 *  @returns {void}
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      var fc = new $.fn.dataTable.fixedColumns( table );
	 *
	 *      // Resize the table container and then have FixedColumns adjust its layout....
	 *      $('#content').width( 1200 );
	 *      fc.fnRedrawLayout();
	 */
	"fnRedrawLayout": function ()
	{
		this._fnColCalc();
		this._fnGridLayout();
		this.fnUpdate();
	},


	/**
	 * Mark a row such that it's height should be recalculated when using 'semiauto' row
	 * height matching. This function will have no effect when 'none' or 'auto' row height
	 * matching is used.
	 *  @param   {Node} nTr TR element that should have it's height recalculated
	 *  @returns {void}
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      var fc = new $.fn.dataTable.fixedColumns( table );
	 *
	 *      // manipulate the table - mark the row as needing an update then update the table
	 *      // this allows the redraw performed by DataTables fnUpdate to recalculate the row
	 *      // height
	 *      fc.fnRecalculateHeight();
	 *      table.fnUpdate( $('#example tbody tr:eq(0)')[0], ["insert date", 1, 2, 3 ... ]);
	 */
	"fnRecalculateHeight": function ( nTr )
	{
		delete nTr._DTTC_iHeight;
		nTr.style.height = 'auto';
	},


	/**
	 * Set the height of a given row - provides cross browser compatibility
	 *  @param   {Node} nTarget TR element that should have it's height recalculated
	 *  @param   {int} iHeight Height in pixels to set
	 *  @returns {void}
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      var fc = new $.fn.dataTable.fixedColumns( table );
	 *
	 *      // You may want to do this after manipulating a row in the fixed column
	 *      fc.fnSetRowHeight( $('#example tbody tr:eq(0)')[0], 50 );
	 */
	"fnSetRowHeight": function ( nTarget, iHeight )
	{
		nTarget.style.height = iHeight+"px";
	},


	/**
	 * Get data index information about a row or cell in the table body.
	 * This function is functionally identical to fnGetPosition in DataTables,
	 * taking the same parameter (TH, TD or TR node) and returning exactly the
	 * the same information (data index information). THe difference between
	 * the two is that this method takes into account the fixed columns in the
	 * table, so you can pass in nodes from the master table, or the cloned
	 * tables and get the index position for the data in the main table.
	 *  @param {node} node TR, TH or TD element to get the information about
	 *  @returns {int} If nNode is given as a TR, then a single index is 
	 *    returned, or if given as a cell, an array of [row index, column index
	 *    (visible), column index (all)] is given.
	 */
	"fnGetPosition": function ( node )
	{
		var idx;
		var inst = this.s.dt.oInstance;

		if ( ! $(node).parents('.DTFC_Cloned').length )
		{
			// Not in a cloned table
			return inst.fnGetPosition( node );
		}
		else
		{
			// Its in the cloned table, so need to look up position
			if ( node.nodeName.toLowerCase() === 'tr' ) {
				idx = $(node).index();
				return inst.fnGetPosition( $('tr', this.s.dt.nTBody)[ idx ] );
			}
			else
			{
				var colIdx = $(node).index();
				idx = $(node.parentNode).index();
				var row = inst.fnGetPosition( $('tr', this.s.dt.nTBody)[ idx ] );

				return [
					row,
					colIdx,
					inst.oApi._fnVisibleToColumnIndex( this.s.dt, colIdx )
				];
			}
		}
	},



	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods (they are of course public in JS, but recommended as private)
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	/**
	 * Initialisation for FixedColumns
	 *  @param   {Object} oInit User settings for initialisation
	 *  @returns {void}
	 *  @private
	 */
	"_fnConstruct": function ( oInit )
	{
		var i, iLen, iWidth,
			that = this;

		/* Sanity checking */
		if ( typeof this.s.dt.oInstance.fnVersionCheck != 'function' ||
		     this.s.dt.oInstance.fnVersionCheck( '1.8.0' ) !== true )
		{
			alert( "FixedColumns "+FixedColumns.VERSION+" required DataTables 1.8.0 or later. "+
				"Please upgrade your DataTables installation" );
			return;
		}

		if ( this.s.dt.oScroll.sX === "" )
		{
			this.s.dt.oInstance.oApi._fnLog( this.s.dt, 1, "FixedColumns is not needed (no "+
				"x-scrolling in DataTables enabled), so no action will be taken. Use 'FixedHeader' for "+
				"column fixing when scrolling is not enabled" );
			return;
		}

		/* Apply the settings from the user / defaults */
		this.s = $.extend( true, this.s, FixedColumns.defaults, oInit );

		/* Set up the DOM as we need it and cache nodes */
		var classes = this.s.dt.oClasses;
		this.dom.grid.dt = $(this.s.dt.nTable).parents('div.'+classes.sScrollWrapper)[0];
		this.dom.scroller = $('div.'+classes.sScrollBody, this.dom.grid.dt )[0];

		/* Set up the DOM that we want for the fixed column layout grid */
		this._fnColCalc();
		this._fnGridSetup();

		/* Event handlers */
		var mouseController;

		// When the body is scrolled - scroll the left and right columns
		$(this.dom.scroller)
			.on( 'mouseover.DTFC touchstart.DTFC', function () {
				mouseController = 'main';
			} )
			.on( 'scroll.DTFC', function (e) {
				if ( ! mouseController && e.originalEvent ) {
					mouseController = 'main';
				}

				if ( mouseController === 'main' ) {
					if ( that.s.iLeftColumns > 0 ) {
						that.dom.grid.left.liner.scrollTop = that.dom.scroller.scrollTop;
					}
					if ( that.s.iRightColumns > 0 ) {
						that.dom.grid.right.liner.scrollTop = that.dom.scroller.scrollTop;
					}
				}
			} );

		var wheelType = 'onwheel' in document.createElement('div') ?
			'wheel.DTFC' :
			'mousewheel.DTFC';

		if ( that.s.iLeftColumns > 0 ) {
			// When scrolling the left column, scroll the body and right column
			$(that.dom.grid.left.liner)
				.on( 'mouseover.DTFC touchstart.DTFC', function () {
					mouseController = 'left';
				} )
				.on( 'scroll.DTFC', function ( e ) {
					if ( ! mouseController && e.originalEvent ) {
						mouseController = 'left';
					}

					if ( mouseController === 'left' ) {
						that.dom.scroller.scrollTop = that.dom.grid.left.liner.scrollTop;
						if ( that.s.iRightColumns > 0 ) {
							that.dom.grid.right.liner.scrollTop = that.dom.grid.left.liner.scrollTop;
						}
					}
				} )
				.on( wheelType, function(e) {
					// Pass horizontal scrolling through
					var xDelta = e.type === 'wheel' ?
						-e.originalEvent.deltaX :
						e.originalEvent.wheelDeltaX;
					that.dom.scroller.scrollLeft -= xDelta;
				} );
		}

		if ( that.s.iRightColumns > 0 ) {
			// When scrolling the right column, scroll the body and the left column
			$(that.dom.grid.right.liner)
				.on( 'mouseover.DTFC touchstart.DTFC', function () {
					mouseController = 'right';
				} )
				.on( 'scroll.DTFC', function ( e ) {
					if ( ! mouseController && e.originalEvent ) {
						mouseController = 'right';
					}

					if ( mouseController === 'right' ) {
						that.dom.scroller.scrollTop = that.dom.grid.right.liner.scrollTop;
						if ( that.s.iLeftColumns > 0 ) {
							that.dom.grid.left.liner.scrollTop = that.dom.grid.right.liner.scrollTop;
						}
					}
				} )
				.on( wheelType, function(e) {
					// Pass horizontal scrolling through
					var xDelta = e.type === 'wheel' ?
						-e.originalEvent.deltaX :
						e.originalEvent.wheelDeltaX;
					that.dom.scroller.scrollLeft -= xDelta;
				} );
		}

		$(window).on( 'resize.DTFC', function () {
			that._fnGridLayout.call( that );
		} );

		var bFirstDraw = true;
		var jqTable = $(this.s.dt.nTable);

		jqTable
			.on( 'draw.dt.DTFC', function () {
				that._fnDraw.call( that, bFirstDraw );
				bFirstDraw = false;
			} )
			.on( 'column-sizing.dt.DTFC', function () {
				that._fnColCalc();
				that._fnGridLayout( that );
			} )
			.on( 'column-visibility.dt.DTFC', function ( e, settings, column, vis, recalc ) {
				if ( recalc === undefined || recalc ) {
					that._fnColCalc();
					that._fnGridLayout( that );
					that._fnDraw( true );
				}
			} )
			.on( 'destroy.dt.DTFC', function () {
				jqTable.off( 'column-sizing.dt.DTFC column-visibility.dt.DTFC destroy.dt.DTFC draw.dt.DTFC' );

				$(that.dom.scroller).off( 'mouseover.DTFC touchstart.DTFC scroll.DTFC' );
				$(window).off( 'resize.DTFC' );

				$(that.dom.grid.left.liner).off( 'mouseover.DTFC touchstart.DTFC scroll.DTFC '+wheelType );
				$(that.dom.grid.left.wrapper).remove();

				$(that.dom.grid.right.liner).off( 'mouseover.DTFC touchstart.DTFC scroll.DTFC '+wheelType );
				$(that.dom.grid.right.wrapper).remove();
			} );

		/* Get things right to start with - note that due to adjusting the columns, there must be
		 * another redraw of the main table. It doesn't need to be a full redraw however.
		 */
		this._fnGridLayout();
		this.s.dt.oInstance.fnDraw(false);
	},


	/**
	 * Calculate the column widths for the grid layout
	 *  @returns {void}
	 *  @private
	 */
	"_fnColCalc": function ()
	{
		var that = this;
		var iLeftWidth = 0;
		var iRightWidth = 0;

		this.s.aiInnerWidths = [];
		this.s.aiOuterWidths = [];

		$.each( this.s.dt.aoColumns, function (i, col) {
			var th = $(col.nTh);
			var border;

			if ( ! th.filter(':visible').length ) {
				that.s.aiInnerWidths.push( 0 );
				that.s.aiOuterWidths.push( 0 );
			}
			else
			{
				// Inner width is used to assign widths to cells
				// Outer width is used to calculate the container
				var iWidth = th.outerWidth();

				// When working with the left most-cell, need to add on the
				// table's border to the outerWidth, since we need to take
				// account of it, but it isn't in any cell
				if ( that.s.aiOuterWidths.length === 0 ) {
					border = $(that.s.dt.nTable).css('border-left-width');
					iWidth += typeof border === 'string' ? 1 : parseInt( border, 10 );
				}

				// Likewise with the final column on the right
				if ( that.s.aiOuterWidths.length === that.s.dt.aoColumns.length-1 ) {
					border = $(that.s.dt.nTable).css('border-right-width');
					iWidth += typeof border === 'string' ? 1 : parseInt( border, 10 );
				}

				that.s.aiOuterWidths.push( iWidth );
				that.s.aiInnerWidths.push( th.width() );

				if ( i < that.s.iLeftColumns )
				{
					iLeftWidth += iWidth;
				}

				if ( that.s.iTableColumns-that.s.iRightColumns <= i )
				{
					iRightWidth += iWidth;
				}
			}
		} );

		this.s.iLeftWidth = iLeftWidth;
		this.s.iRightWidth = iRightWidth;
	},


	/**
	 * Set up the DOM for the fixed column. The way the layout works is to create a 1x3 grid
	 * for the left column, the DataTable (for which we just reuse the scrolling element DataTable
	 * puts into the DOM) and the right column. In each of he two fixed column elements there is a
	 * grouping wrapper element and then a head, body and footer wrapper. In each of these we then
	 * place the cloned header, body or footer tables. This effectively gives as 3x3 grid structure.
	 *  @returns {void}
	 *  @private
	 */
	"_fnGridSetup": function ()
	{
		var that = this;
		var oOverflow = this._fnDTOverflow();
		var block;

		this.dom.body = this.s.dt.nTable;
		this.dom.header = this.s.dt.nTHead.parentNode;
		this.dom.header.parentNode.parentNode.style.position = "relative";

		var nSWrapper =
			$('<div class="DTFC_ScrollWrapper" style="position:relative; clear:both;">'+
				'<div class="DTFC_LeftWrapper" style="position:absolute; top:0; left:0;">'+
					'<div class="DTFC_LeftHeadWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div>'+
					'<div class="DTFC_LeftBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;">'+
						'<div class="DTFC_LeftBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div>'+
					'</div>'+
					'<div class="DTFC_LeftFootWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div>'+
				'</div>'+
				'<div class="DTFC_RightWrapper" style="position:absolute; top:0; left:0;">'+
					'<div class="DTFC_RightHeadWrapper" style="position:relative; top:0; left:0;">'+
						'<div class="DTFC_RightHeadBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div>'+
					'</div>'+
					'<div class="DTFC_RightBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;">'+
						'<div class="DTFC_RightBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div>'+
					'</div>'+
					'<div class="DTFC_RightFootWrapper" style="position:relative; top:0; left:0;">'+
						'<div class="DTFC_RightFootBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div>'+
					'</div>'+
				'</div>'+
			'</div>')[0];
		var nLeft = nSWrapper.childNodes[0];
		var nRight = nSWrapper.childNodes[1];

		this.dom.grid.dt.parentNode.insertBefore( nSWrapper, this.dom.grid.dt );
		nSWrapper.appendChild( this.dom.grid.dt );

		this.dom.grid.wrapper = nSWrapper;

		if ( this.s.iLeftColumns > 0 )
		{
			this.dom.grid.left.wrapper = nLeft;
			this.dom.grid.left.head = nLeft.childNodes[0];
			this.dom.grid.left.body = nLeft.childNodes[1];
			this.dom.grid.left.liner = $('div.DTFC_LeftBodyLiner', nSWrapper)[0];

			nSWrapper.appendChild( nLeft );
		}

		if ( this.s.iRightColumns > 0 )
		{
			this.dom.grid.right.wrapper = nRight;
			this.dom.grid.right.head = nRight.childNodes[0];
			this.dom.grid.right.body = nRight.childNodes[1];
			this.dom.grid.right.liner = $('div.DTFC_RightBodyLiner', nSWrapper)[0];

			block = $('div.DTFC_RightHeadBlocker', nSWrapper)[0];
			block.style.width = oOverflow.bar+"px";
			block.style.right = -oOverflow.bar+"px";
			this.dom.grid.right.headBlock = block;

			block = $('div.DTFC_RightFootBlocker', nSWrapper)[0];
			block.style.width = oOverflow.bar+"px";
			block.style.right = -oOverflow.bar+"px";
			this.dom.grid.right.footBlock = block;

			nSWrapper.appendChild( nRight );
		}

		if ( this.s.dt.nTFoot )
		{
			this.dom.footer = this.s.dt.nTFoot.parentNode;
			if ( this.s.iLeftColumns > 0 )
			{
				this.dom.grid.left.foot = nLeft.childNodes[2];
			}
			if ( this.s.iRightColumns > 0 )
			{
				this.dom.grid.right.foot = nRight.childNodes[2];
			}
		}
	},


	/**
	 * Style and position the grid used for the FixedColumns layout
	 *  @returns {void}
	 *  @private
	 */
	"_fnGridLayout": function ()
	{
		var oGrid = this.dom.grid;
		var iWidth = $(oGrid.wrapper).width();
		var iBodyHeight = $(this.s.dt.nTable.parentNode).outerHeight();
		var iFullHeight = $(this.s.dt.nTable.parentNode.parentNode).outerHeight();
		var oOverflow = this._fnDTOverflow();
		var
			iLeftWidth = this.s.iLeftWidth,
			iRightWidth = this.s.iRightWidth,
			iRight;
		var scrollbarAdjust = function ( node, width ) {
			if ( ! oOverflow.bar ) {
				// If there is no scrollbar (Macs) we need to hide the auto scrollbar
				node.style.width = (width+20)+"px";
				node.style.paddingRight = "20px";
				node.style.boxSizing = "border-box";
			}
			else {
				// Otherwise just overflow by the scrollbar
				node.style.width = (width+oOverflow.bar)+"px";
			}
		};

		// When x scrolling - don't paint the fixed columns over the x scrollbar
		if ( oOverflow.x )
		{
			iBodyHeight -= oOverflow.bar;
		}

		oGrid.wrapper.style.height = iFullHeight+"px";

		if ( this.s.iLeftColumns > 0 )
		{
			oGrid.left.wrapper.style.width = iLeftWidth+"px";
			oGrid.left.wrapper.style.height = "1px";
			oGrid.left.body.style.height = iBodyHeight+"px";
			if ( oGrid.left.foot ) {
				oGrid.left.foot.style.top = (oOverflow.x ? oOverflow.bar : 0)+"px"; // shift footer for scrollbar
			}

			scrollbarAdjust( oGrid.left.liner, iLeftWidth );
			oGrid.left.liner.style.height = iBodyHeight+"px";
		}

		if ( this.s.iRightColumns > 0 )
		{
			iRight = iWidth - iRightWidth;
			if ( oOverflow.y )
			{
				iRight -= oOverflow.bar;
			}

			oGrid.right.wrapper.style.width = iRightWidth+"px";
			oGrid.right.wrapper.style.left = iRight+"px";
			oGrid.right.wrapper.style.height = "1px";
			oGrid.right.body.style.height = iBodyHeight+"px";
			if ( oGrid.right.foot ) {
				oGrid.right.foot.style.top = (oOverflow.x ? oOverflow.bar : 0)+"px";
			}

			scrollbarAdjust( oGrid.right.liner, iRightWidth );
			oGrid.right.liner.style.height = iBodyHeight+"px";

			oGrid.right.headBlock.style.display = oOverflow.y ? 'block' : 'none';
			oGrid.right.footBlock.style.display = oOverflow.y ? 'block' : 'none';
		}
	},


	/**
	 * Get information about the DataTable's scrolling state - specifically if the table is scrolling
	 * on either the x or y axis, and also the scrollbar width.
	 *  @returns {object} Information about the DataTables scrolling state with the properties:
	 *    'x', 'y' and 'bar'
	 *  @private
	 */
	"_fnDTOverflow": function ()
	{
		var nTable = this.s.dt.nTable;
		var nTableScrollBody = nTable.parentNode;
		var out = {
			"x": false,
			"y": false,
			"bar": this.s.dt.oScroll.iBarWidth
		};

		if ( nTable.offsetWidth > nTableScrollBody.clientWidth )
		{
			out.x = true;
		}

		if ( nTable.offsetHeight > nTableScrollBody.clientHeight )
		{
			out.y = true;
		}

		return out;
	},


	/**
	 * Clone and position the fixed columns
	 *  @returns {void}
	 *  @param   {Boolean} bAll Indicate if the header and footer should be updated as well (true)
	 *  @private
	 */
	"_fnDraw": function ( bAll )
	{
		this._fnGridLayout();
		this._fnCloneLeft( bAll );
		this._fnCloneRight( bAll );

		/* Draw callback function */
		if ( this.s.fnDrawCallback !== null )
		{
			this.s.fnDrawCallback.call( this, this.dom.clone.left, this.dom.clone.right );
		}

		/* Event triggering */
		$(this).trigger( 'draw.dtfc', {
			"leftClone": this.dom.clone.left,
			"rightClone": this.dom.clone.right
		} );
	},


	/**
	 * Clone the right columns
	 *  @returns {void}
	 *  @param   {Boolean} bAll Indicate if the header and footer should be updated as well (true)
	 *  @private
	 */
	"_fnCloneRight": function ( bAll )
	{
		if ( this.s.iRightColumns <= 0 ) {
			return;
		}

		var that = this,
			i, jq,
			aiColumns = [];

		for ( i=this.s.iTableColumns-this.s.iRightColumns ; i<this.s.iTableColumns ; i++ ) {
			if ( this.s.dt.aoColumns[i].bVisible ) {
				aiColumns.push( i );
			}
		}

		this._fnClone( this.dom.clone.right, this.dom.grid.right, aiColumns, bAll );
	},


	/**
	 * Clone the left columns
	 *  @returns {void}
	 *  @param   {Boolean} bAll Indicate if the header and footer should be updated as well (true)
	 *  @private
	 */
	"_fnCloneLeft": function ( bAll )
	{
		if ( this.s.iLeftColumns <= 0 ) {
			return;
		}

		var that = this,
			i, jq,
			aiColumns = [];

		for ( i=0 ; i<this.s.iLeftColumns ; i++ ) {
			if ( this.s.dt.aoColumns[i].bVisible ) {
				aiColumns.push( i );
			}
		}

		this._fnClone( this.dom.clone.left, this.dom.grid.left, aiColumns, bAll );
	},


	/**
	 * Make a copy of the layout object for a header or footer element from DataTables. Note that
	 * this method will clone the nodes in the layout object.
	 *  @returns {Array} Copy of the layout array
	 *  @param   {Object} aoOriginal Layout array from DataTables (aoHeader or aoFooter)
	 *  @param   {Object} aiColumns Columns to copy
	 *  @param   {boolean} events Copy cell events or not
	 *  @private
	 */
	"_fnCopyLayout": function ( aoOriginal, aiColumns, events )
	{
		var aReturn = [];
		var aClones = [];
		var aCloned = [];

		for ( var i=0, iLen=aoOriginal.length ; i<iLen ; i++ )
		{
			var aRow = [];
			aRow.nTr = $(aoOriginal[i].nTr).clone(events, false)[0];

			for ( var j=0, jLen=this.s.iTableColumns ; j<jLen ; j++ )
			{
				if ( $.inArray( j, aiColumns ) === -1 )
				{
					continue;
				}

				var iCloned = $.inArray( aoOriginal[i][j].cell, aCloned );
				if ( iCloned === -1 )
				{
					var nClone = $(aoOriginal[i][j].cell).clone(events, false)[0];
					aClones.push( nClone );
					aCloned.push( aoOriginal[i][j].cell );

					aRow.push( {
						"cell": nClone,
						"unique": aoOriginal[i][j].unique
					} );
				}
				else
				{
					aRow.push( {
						"cell": aClones[ iCloned ],
						"unique": aoOriginal[i][j].unique
					} );
				}
			}

			aReturn.push( aRow );
		}

		return aReturn;
	},


	/**
	 * Clone the DataTable nodes and place them in the DOM (sized correctly)
	 *  @returns {void}
	 *  @param   {Object} oClone Object containing the header, footer and body cloned DOM elements
	 *  @param   {Object} oGrid Grid object containing the display grid elements for the cloned
	 *                    column (left or right)
	 *  @param   {Array} aiColumns Column indexes which should be operated on from the DataTable
	 *  @param   {Boolean} bAll Indicate if the header and footer should be updated as well (true)
	 *  @private
	 */
	"_fnClone": function ( oClone, oGrid, aiColumns, bAll )
	{
		var that = this,
			i, iLen, j, jLen, jq, nTarget, iColumn, nClone, iIndex, aoCloneLayout,
			jqCloneThead, aoFixedHeader,
			dt = this.s.dt;

		/*
		 * Header
		 */
		if ( bAll )
		{
			$(oClone.header).remove();

			oClone.header = $(this.dom.header).clone(true, false)[0];
			oClone.header.className += " DTFC_Cloned";
			oClone.header.style.width = "100%";
			oGrid.head.appendChild( oClone.header );

			/* Copy the DataTables layout cache for the header for our floating column */
			aoCloneLayout = this._fnCopyLayout( dt.aoHeader, aiColumns, true );
			jqCloneThead = $('>thead', oClone.header);
			jqCloneThead.empty();

			/* Add the created cloned TR elements to the table */
			for ( i=0, iLen=aoCloneLayout.length ; i<iLen ; i++ )
			{
				jqCloneThead[0].appendChild( aoCloneLayout[i].nTr );
			}

			/* Use the handy _fnDrawHead function in DataTables to do the rowspan/colspan
			 * calculations for us
			 */
			dt.oApi._fnDrawHead( dt, aoCloneLayout, true );
		}
		else
		{
			/* To ensure that we copy cell classes exactly, regardless of colspan, multiple rows
			 * etc, we make a copy of the header from the DataTable again, but don't insert the
			 * cloned cells, just copy the classes across. To get the matching layout for the
			 * fixed component, we use the DataTables _fnDetectHeader method, allowing 1:1 mapping
			 */
			aoCloneLayout = this._fnCopyLayout( dt.aoHeader, aiColumns, false );
			aoFixedHeader=[];

			dt.oApi._fnDetectHeader( aoFixedHeader, $('>thead', oClone.header)[0] );

			for ( i=0, iLen=aoCloneLayout.length ; i<iLen ; i++ )
			{
				for ( j=0, jLen=aoCloneLayout[i].length ; j<jLen ; j++ )
				{
					aoFixedHeader[i][j].cell.className = aoCloneLayout[i][j].cell.className;

					// If jQuery UI theming is used we need to copy those elements as well
					$('span.DataTables_sort_icon', aoFixedHeader[i][j].cell).each( function () {
						this.className = $('span.DataTables_sort_icon', aoCloneLayout[i][j].cell)[0].className;
					} );
				}
			}
		}
		this._fnEqualiseHeights( 'thead', this.dom.header, oClone.header );

		/*
		 * Body
		 */
		if ( this.s.sHeightMatch == 'auto' )
		{
			/* Remove any heights which have been applied already and let the browser figure it out */
			$('>tbody>tr', that.dom.body).css('height', 'auto');
		}

		if ( oClone.body !== null )
		{
			$(oClone.body).remove();
			oClone.body = null;
		}

		oClone.body = $(this.dom.body).clone(true)[0];
		oClone.body.className += " DTFC_Cloned";
		oClone.body.style.paddingBottom = dt.oScroll.iBarWidth+"px";
		oClone.body.style.marginBottom = (dt.oScroll.iBarWidth*2)+"px"; /* For IE */
		if ( oClone.body.getAttribute('id') !== null )
		{
			oClone.body.removeAttribute('id');
		}

		$('>thead>tr', oClone.body).empty();
		$('>tfoot', oClone.body).remove();

		var nBody = $('tbody', oClone.body)[0];
		$(nBody).empty();
		if ( dt.aiDisplay.length > 0 )
		{
			/* Copy the DataTables' header elements to force the column width in exactly the
			 * same way that DataTables does it - have the header element, apply the width and
			 * colapse it down
			 */
			var nInnerThead = $('>thead>tr', oClone.body)[0];
			for ( iIndex=0 ; iIndex<aiColumns.length ; iIndex++ )
			{
				iColumn = aiColumns[iIndex];

				nClone = $(dt.aoColumns[iColumn].nTh).clone(true)[0];
				nClone.innerHTML = "";

				var oStyle = nClone.style;
				oStyle.paddingTop = "0";
				oStyle.paddingBottom = "0";
				oStyle.borderTopWidth = "0";
				oStyle.borderBottomWidth = "0";
				oStyle.height = 0;
				oStyle.width = that.s.aiInnerWidths[iColumn]+"px";

				nInnerThead.appendChild( nClone );
			}

			/* Add in the tbody elements, cloning form the master table */
			$('>tbody>tr', that.dom.body).each( function (z) {
				var n = this.cloneNode(false);
				n.removeAttribute('id');
				var i = that.s.dt.oFeatures.bServerSide===false ?
					that.s.dt.aiDisplay[ that.s.dt._iDisplayStart+z ] : z;
				var aTds = that.s.dt.aoData[ i ].anCells || $(this).children('td, th');

				for ( iIndex=0 ; iIndex<aiColumns.length ; iIndex++ )
				{
					iColumn = aiColumns[iIndex];

					if ( aTds.length > 0 )
					{
						nClone = $( aTds[iColumn] ).clone(true, true)[0];
						n.appendChild( nClone );
					}
				}
				nBody.appendChild( n );
			} );
		}
		else
		{
			$('>tbody>tr', that.dom.body).each( function (z) {
				nClone = this.cloneNode(true);
				nClone.className += ' DTFC_NoData';
				$('td', nClone).html('');
				nBody.appendChild( nClone );
			} );
		}

		oClone.body.style.width = "100%";
		oClone.body.style.margin = "0";
		oClone.body.style.padding = "0";

		// Interop with Scroller - need to use a height forcing element in the
		// scrolling area in the same way that Scroller does in the body scroll.
		if ( dt.oScroller !== undefined )
		{
			var scrollerForcer = dt.oScroller.dom.force;

			if ( ! oGrid.forcer ) {
				oGrid.forcer = scrollerForcer.cloneNode( true );
				oGrid.liner.appendChild( oGrid.forcer );
			}
			else {
				oGrid.forcer.style.height = scrollerForcer.style.height;
			}
		}

		oGrid.liner.appendChild( oClone.body );

		this._fnEqualiseHeights( 'tbody', that.dom.body, oClone.body );

		/*
		 * Footer
		 */
		if ( dt.nTFoot !== null )
		{
			if ( bAll )
			{
				if ( oClone.footer !== null )
				{
					oClone.footer.parentNode.removeChild( oClone.footer );
				}
				oClone.footer = $(this.dom.footer).clone(true, true)[0];
				oClone.footer.className += " DTFC_Cloned";
				oClone.footer.style.width = "100%";
				oGrid.foot.appendChild( oClone.footer );

				/* Copy the footer just like we do for the header */
				aoCloneLayout = this._fnCopyLayout( dt.aoFooter, aiColumns, true );
				var jqCloneTfoot = $('>tfoot', oClone.footer);
				jqCloneTfoot.empty();

				for ( i=0, iLen=aoCloneLayout.length ; i<iLen ; i++ )
				{
					jqCloneTfoot[0].appendChild( aoCloneLayout[i].nTr );
				}
				dt.oApi._fnDrawHead( dt, aoCloneLayout, true );
			}
			else
			{
				aoCloneLayout = this._fnCopyLayout( dt.aoFooter, aiColumns, false );
				var aoCurrFooter=[];

				dt.oApi._fnDetectHeader( aoCurrFooter, $('>tfoot', oClone.footer)[0] );

				for ( i=0, iLen=aoCloneLayout.length ; i<iLen ; i++ )
				{
					for ( j=0, jLen=aoCloneLayout[i].length ; j<jLen ; j++ )
					{
						aoCurrFooter[i][j].cell.className = aoCloneLayout[i][j].cell.className;
					}
				}
			}
			this._fnEqualiseHeights( 'tfoot', this.dom.footer, oClone.footer );
		}

		/* Equalise the column widths between the header footer and body - body get's priority */
		var anUnique = dt.oApi._fnGetUniqueThs( dt, $('>thead', oClone.header)[0] );
		$(anUnique).each( function (i) {
			iColumn = aiColumns[i];
			this.style.width = that.s.aiInnerWidths[iColumn]+"px";
		} );

		if ( that.s.dt.nTFoot !== null )
		{
			anUnique = dt.oApi._fnGetUniqueThs( dt, $('>tfoot', oClone.footer)[0] );
			$(anUnique).each( function (i) {
				iColumn = aiColumns[i];
				this.style.width = that.s.aiInnerWidths[iColumn]+"px";
			} );
		}
	},


	/**
	 * From a given table node (THEAD etc), get a list of TR direct child elements
	 *  @param   {Node} nIn Table element to search for TR elements (THEAD, TBODY or TFOOT element)
	 *  @returns {Array} List of TR elements found
	 *  @private
	 */
	"_fnGetTrNodes": function ( nIn )
	{
		var aOut = [];
		for ( var i=0, iLen=nIn.childNodes.length ; i<iLen ; i++ )
		{
			if ( nIn.childNodes[i].nodeName.toUpperCase() == "TR" )
			{
				aOut.push( nIn.childNodes[i] );
			}
		}
		return aOut;
	},


	/**
	 * Equalise the heights of the rows in a given table node in a cross browser way
	 *  @returns {void}
	 *  @param   {String} nodeName Node type - thead, tbody or tfoot
	 *  @param   {Node} original Original node to take the heights from
	 *  @param   {Node} clone Copy the heights to
	 *  @private
	 */
	"_fnEqualiseHeights": function ( nodeName, original, clone )
	{
		if ( this.s.sHeightMatch == 'none' && nodeName !== 'thead' && nodeName !== 'tfoot' )
		{
			return;
		}

		var that = this,
			i, iLen, iHeight, iHeight2, iHeightOriginal, iHeightClone,
			rootOriginal = original.getElementsByTagName(nodeName)[0],
			rootClone    = clone.getElementsByTagName(nodeName)[0],
			jqBoxHack    = $('>'+nodeName+'>tr:eq(0)', original).children(':first'),
			iBoxHack     = jqBoxHack.outerHeight() - jqBoxHack.height(),
			anOriginal   = this._fnGetTrNodes( rootOriginal ),
			anClone      = this._fnGetTrNodes( rootClone ),
			heights      = [];

		for ( i=0, iLen=anClone.length ; i<iLen ; i++ )
		{
			iHeightOriginal = anOriginal[i].offsetHeight;
			iHeightClone = anClone[i].offsetHeight;
			iHeight = iHeightClone > iHeightOriginal ? iHeightClone : iHeightOriginal;

			if ( this.s.sHeightMatch == 'semiauto' )
			{
				anOriginal[i]._DTTC_iHeight = iHeight;
			}

			heights.push( iHeight );
		}

		for ( i=0, iLen=anClone.length ; i<iLen ; i++ )
		{
			anClone[i].style.height = heights[i]+"px";
			anOriginal[i].style.height = heights[i]+"px";
		}
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * FixedColumns default settings for initialisation
 *  @name FixedColumns.defaults
 *  @namespace
 *  @static
 */
FixedColumns.defaults = /** @lends FixedColumns.defaults */{
	/**
	 * Number of left hand columns to fix in position
	 *  @type     int
	 *  @default  1
	 *  @static
	 *  @example
	 *      var  = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      new $.fn.dataTable.fixedColumns( table, {
	 *          "leftColumns": 2
	 *      } );
	 */
	"iLeftColumns": 1,

	/**
	 * Number of right hand columns to fix in position
	 *  @type     int
	 *  @default  0
	 *  @static
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      new $.fn.dataTable.fixedColumns( table, {
	 *          "rightColumns": 1
	 *      } );
	 */
	"iRightColumns": 0,

	/**
	 * Draw callback function which is called when FixedColumns has redrawn the fixed assets
	 *  @type     function(object, object):void
	 *  @default  null
	 *  @static
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      new $.fn.dataTable.fixedColumns( table, {
	 *          "drawCallback": function () {
	 *	            alert( "FixedColumns redraw" );
	 *	        }
	 *      } );
	 */
	"fnDrawCallback": null,

	/**
	 * Height matching algorthim to use. This can be "none" which will result in no height
	 * matching being applied by FixedColumns (height matching could be forced by CSS in this
	 * case), "semiauto" whereby the height calculation will be performed once, and the result
	 * cached to be used again (fnRecalculateHeight can be used to force recalculation), or
	 * "auto" when height matching is performed on every draw (slowest but must accurate)
	 *  @type     string
	 *  @default  semiauto
	 *  @static
	 *  @example
	 *      var table = $('#example').dataTable( {
	 *          "scrollX": "100%"
	 *      } );
	 *      new $.fn.dataTable.fixedColumns( table, {
	 *          "heightMatch": "auto"
	 *      } );
	 */
	"sHeightMatch": "semiauto"
};




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Constants
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * FixedColumns version
 *  @name      FixedColumns.version
 *  @type      String
 *  @default   See code
 *  @static
 */
FixedColumns.version = "3.2.0";



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API integration
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

DataTable.Api.register( 'fixedColumns()', function () {
	return this;
} );

DataTable.Api.register( 'fixedColumns().update()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._oFixedColumns ) {
			ctx._oFixedColumns.fnUpdate();
		}
	} );
} );

DataTable.Api.register( 'fixedColumns().relayout()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._oFixedColumns ) {
			ctx._oFixedColumns.fnRedrawLayout();
		}
	} );
} );

DataTable.Api.register( 'rows().recalcHeight()', function () {
	return this.iterator( 'row', function ( ctx, idx ) {
		if ( ctx._oFixedColumns ) {
			ctx._oFixedColumns.fnRecalculateHeight( this.row(idx).node() );
		}
	} );
} );

DataTable.Api.register( 'fixedColumns().rowIndex()', function ( row ) {
	row = $(row);

	return row.parents('.DTFC_Cloned').length ?
		this.rows( { page: 'current' } ).indexes()[ row.index() ] :
		this.row( row ).index();
} );

DataTable.Api.register( 'fixedColumns().cellIndex()', function ( cell ) {
	cell = $(cell);

	if ( cell.parents('.DTFC_Cloned').length ) {
		var rowClonedIdx = cell.parent().index();
		var rowIdx = this.rows( { page: 'current' } ).indexes()[ rowClonedIdx ];
		var columnIdx;

		if ( cell.parents('.DTFC_LeftWrapper').length ) {
			columnIdx = cell.index();
		}
		else {
			var columns = this.columns().flatten().length;
			columnIdx = columns - this.context[0]._oFixedColumns.s.iRightColumns + cell.index();
		}

		return {
			row: rowIdx,
			column: this.column.index( 'toData', columnIdx ),
			columnVisible: columnIdx
		};
	}
	else {
		return this.cell( cell ).index();
	}
} );




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'init.dt.fixedColumns', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.fixedColumns;
	var defaults = DataTable.defaults.fixedColumns;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new FixedColumns( settings, opts );
		}
	}
} );



// Make FixedColumns accessible from the DataTables instance
$.fn.dataTable.FixedColumns = FixedColumns;
$.fn.DataTable.FixedColumns = FixedColumns;

return FixedColumns;
}));
/*! Responsive 1.0.1
 * 2014 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     Responsive
 * @description Responsive tables plug-in for DataTables
 * @version     1.0.1
 * @file        dataTables.responsive.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2014 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

(function(window, document, undefined) {


var factory = function( $, DataTable ) {
"use strict";

/**
 * Responsive is a plug-in for the DataTables library that makes use of
 * DataTables' ability to change the visibility of columns, changing the
 * visibility of columns so the displayed columns fit into the table container.
 * The end result is that complex tables will be dynamically adjusted to fit
 * into the viewport, be it on a desktop, tablet or mobile browser.
 *
 * Responsive for DataTables has two modes of operation, which can used
 * individually or combined:
 *
 * * Class name based control - columns assigned class names that match the
 *   breakpoint logic can be shown / hidden as required for each breakpoint.
 * * Automatic control - columns are automatically hidden when there is no
 *   room left to display them. Columns removed from the right.
 *
 * In additional to column visibility control, Responsive also has built into
 * options to use DataTables' child row display to show / hide the information
 * from the table that has been hidden. There are also two modes of operation
 * for this child row display:
 *
 * * Inline - when the control element that the user can use to show / hide
 *   child rows is displayed inside the first column of the table.
 * * Column - where a whole column is dedicated to be the show / hide control.
 *
 * Initialisation of Responsive is performed by:
 *
 * * Adding the class `responsive` or `dt-responsive` to the table. In this case
 *   Responsive will automatically be initialised with the default configuration
 *   options when the DataTable is created.
 * * Using the `responsive` option in the DataTables configuration options. This
 *   can also be used to specify the configuration options, or simply set to
 *   `true` to use the defaults.
 *
 *  @class
 *  @param {object} settings DataTables settings object for the host table
 *  @param {object} [opts] Configuration options
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.1+
 *
 *  @example
 *      $('#example').DataTable( {
 *        responsive: true
 *      } );
 *    } );
 */
var Responsive = function ( settings, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.1' ) ) {
		throw 'DataTables Responsive requires DataTables 1.10.1 or newer';
	}
	else if ( settings.responsive ) {
		return;
	}

	this.s = {
		dt: new DataTable.Api( settings ),
		columns: []
	};

	// details is an object, but for simplicity the user can give it as a string
	if ( opts && typeof opts.details === 'string' ) {
		opts.details = { type: opts.details };
	}

	this.c = $.extend( true, {}, Responsive.defaults, opts );
	settings.responsive = this;
	this._constructor();
};

Responsive.prototype = {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the Responsive instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;

		dt.settings()[0]._responsive = this;

		// Use DataTables' private throttle function to avoid processor thrashing
		$(window).on( 'resize.dtr orientationchange.dtr', dt.settings()[0].oApi._fnThrottle( function () {
			that._resize();
		} ) );

		// Destroy event handler
		dt.on( 'destroy.dtr', function () {
			$(window).off( 'resize.dtr orientationchange.dtr' );
		} );

		// Reorder the breakpoints array here in case they have been added out
		// of order
		this.c.breakpoints.sort( function (a, b) {
			return a.width < b.width ? 1 :
				a.width > b.width ? -1 : 0;
		} );

		this._classLogic();
		this._resizeAuto();

		// First pass - draw the table for the current viewport size
		this._resize();

		// Details handler
		var details = this.c.details;
		if ( details.type ) {
			that._detailsInit();
			this._detailsVis();

			dt.on( 'column-visibility.dtr', function () {
				that._detailsVis();
			} );

			$(dt.table().node()).addClass( 'dtr-'+details.type );
		}
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Calculate the visibility for the columns in a table for a given
	 * breakpoint. The result is pre-determined based on the class logic if
	 * class names are used to control all columns, but the width of the table
	 * is also used if there are columns which are to be automatically shown
	 * and hidden.
	 *
	 * @param  {string} breakpoint Breakpoint name to use for the calculation
	 * @return {array} Array of boolean values initiating the visibility of each
	 *   column.
	 *  @private
	 */
	_columnsVisiblity: function ( breakpoint )
	{
		var dt = this.s.dt;
		var columns = this.s.columns;
		var i, ien;

		// Class logic - determine which columns are in this breakpoint based
		// on the classes. If no class control (i.e. `auto`) then `-` is used
		// to indicate this to the rest of the function
		var display = $.map( columns, function ( col ) {
			return col.auto && col.minWidth === null ?
				false :
				col.auto === true ?
					'-' :
					col.includeIn.indexOf( breakpoint ) !== -1;
		} );

		// Auto column control - first pass: how much width is taken by the
		// ones that must be included from the non-auto columns
		var requiredWidth = 0;
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( display[i] === true ) {
				requiredWidth += columns[i].minWidth;
			}
		}

		// Second pass, use up any remaining width for other columns
		var widthAvailable = dt.table().container().offsetWidth;
		var usedWidth = widthAvailable - requiredWidth;

		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			// Control column needs to always be included. This makes it sub-
			// optimal in terms of using the available with, but to stop layout
			// thrashing or overflow
			if ( columns[i].control ) {
				usedWidth -= columns[i].minWidth;
			}
			else if ( display[i] === '-' ) {
				// Otherwise, remove the width
				display[i] = usedWidth - columns[i].minWidth < 0 ?
					false :
					true;

				// Continue counting down the width, so a smaller column to the
				// left won't be shown
				usedWidth -= columns[i].minWidth;
			}
		}

		// Determine if the 'control' column should be shown (if there is one).
		// This is the case when there is a hidden column (that is not the
		// control column). The two loops look inefficient here, but they are
		// trivial and will fly through. We need to know the outcome from the
		// first , before the action in the second can be taken
		var showControl = false;

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( ! columns[i].control && ! display[i] ) {
				showControl = true;
				break;
			}
		}

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				display[i] = showControl;
			}
		}

		return display;
	},


	/**
	 * Create the internal `columns` array with information about the columns
	 * for the table. This includes determining which breakpoints the column
	 * will appear in, based upon class names in the column, which makes up the
	 * vast majority of this method.
	 *
	 * @private
	 */
	_classLogic: function ()
	{
		var that = this;
		var calc = {};
		var breakpoints = this.c.breakpoints;
		var columns = this.s.dt.columns().eq(0).map( function (i) {
			return {
				className: this.column(i).header().className,
				includeIn: [],
				auto:      false,
				control:   false
			};
		} );

		// Simply add a breakpoint to `includeIn` array, ensuring that there are
		// no duplicates
		var add = function ( colIdx, name ) {
			var includeIn = columns[ colIdx ].includeIn;

			if ( includeIn.indexOf( name ) === -1 ) {
				includeIn.push( name );
			}
		};

		var column = function ( colIdx, name, operator, matched ) {
			var size, i, ien;

			if ( ! operator ) {
				columns[ colIdx ].includeIn.push( name );
			}
			else if ( operator === 'max-' ) {
				// Add this breakpoint and all smaller
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width <= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'min-' ) {
				// Add this breakpoint and all larger
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width >= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'not-' ) {
				// Add all but this breakpoint (xxx need extra information)

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].name.indexOf( matched ) === -1 ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
		};

		// Loop over each column and determine if it has a responsive control
		// class
		columns.each( function ( col, i ) {
			var classNames = col.className.split(' ');
			var hasClass = false;

			// Split the class name up so multiple rules can be applied if needed
			for ( var k=0, ken=classNames.length ; k<ken ; k++ ) {
				var className = $.trim( classNames[k] );

				if ( className === 'all' ) {
					// Include in all
					hasClass = true;
					col.includeIn = $.map( breakpoints, function (a) {
						return a.name;
					} );
					return;
				}
				else if ( className === 'none' ) {
					// Include in none (default) and no auto
					hasClass = true;
					return;
				}
				else if ( className === 'control' ) {
					// Special column that is only visible, when one of the other
					// columns is hidden. This is used for the details control
					hasClass = true;
					col.control = true;
					return;
				}

				$.each( breakpoints, function ( j, breakpoint ) {
					// Does this column have a class that matches this breakpoint?
					var brokenPoint = breakpoint.name.split('-');
					var re = new RegExp( '(min\\-|max\\-|not\\-)?('+brokenPoint[0]+')(\\-[_a-zA-Z0-9])?' );
					var match = className.match( re );

					if ( match ) {
						hasClass = true;

						if ( match[2] === brokenPoint[0] && match[3] === '-'+brokenPoint[1] ) {
							// Class name matches breakpoint name fully
							column( i, breakpoint.name, match[1], match[2]+match[3] );
						}
						else if ( match[2] === brokenPoint[0] && ! match[3] ) {
							// Class name matched primary breakpoint name with no qualifier
							column( i, breakpoint.name, match[1], match[2] );
						}
					}
				} );
			}

			// If there was no control class, then automatic sizing is used
			if ( ! hasClass ) {
				col.auto = true;
			}
		} );

		this.s.columns = columns;
	},


	/**
	 * Initialisation for the details handler
	 *
	 * @private
	 */
	_detailsInit: function ()
	{
		var that    = this;
		var dt      = this.s.dt;
		var details = this.c.details;

		// The inline type always uses the first child as the target
		if ( details.type === 'inline' ) {
			details.target = 'td:first-child';
		}

		// type.target can be a string jQuery selector or a column index
		var target   = details.target;
		var selector = typeof target === 'string' ? target : 'td';

		// Click handler to show / hide the details rows when they are available
		$( dt.table().body() ).on( 'click', selector, function (e) {
			// If the table is not collapsed (i.e. there is no hidden columns)
			// then take no action
			if ( ! $(dt.table().node()).hasClass('collapsed' ) ) {
				return;
			}

			// For column index, we determine if we should act or not in the
			// handler - otherwise it is already okay
			if ( typeof target === 'number' ) {
				var targetIdx = target < 0 ?
					dt.columns().eq(0).length + target :
					target;

				if ( dt.cell( this ).index().column !== targetIdx ) {
					return;
				}
			}

			// $().closest() includes itself in its check
			var row = dt.row( $(this).closest('tr') );

			if ( row.child.isShown() ) {
				row.child( false );
				$( row.node() ).removeClass( 'parent' );
			}
			else {
				var info = that.c.details.renderer( dt, row[0] );
				row.child( info, 'child' ).show();
				$( row.node() ).addClass( 'parent' );
			}
		} );
	},


	/**
	 * Update the child rows in the table whenever the column visibility changes
	 *
	 * @private
	 */
	_detailsVis: function ()
	{
		var that = this;
		var dt = this.s.dt;

		var hiddenColumns = dt.columns(':hidden').indexes().flatten();
		var haveHidden = true;

		if ( hiddenColumns.length === 0 || ( hiddenColumns.length === 1 && this.s.columns[ hiddenColumns[0] ].control ) ) {
			haveHidden = false;
		}

		if ( haveHidden ) {
			// Got hidden columns
			$( dt.table().node() ).addClass('collapsed');

			// Show all existing child rows
			dt.rows().eq(0).each( function (idx) {
				var row = dt.row( idx );

				if ( row.child() ) {
					var info = that.c.details.renderer( dt, row[0] );

					// The renderer can return false to have no child row
					if ( info === false ) {
						row.child.hide();
					}
					else {
						row.child( info, 'child' ).show();
					}
				}
			} );
		}
		else {
			// No hidden columns
			$( dt.table().node() ).removeClass('collapsed');

			// Hide all existing child rows
			dt.rows().eq(0).each( function (idx) {
				dt.row( idx ).child.hide();
			} );
		}
	},


	/**
	 * Find a breakpoint object from a name
	 * @param  {string} name Breakpoint name to find
	 * @return {object}      Breakpoint description object
	 */
	_find: function ( name )
	{
		var breakpoints = this.c.breakpoints;

		for ( var i=0, ien=breakpoints.length ; i<ien ; i++ ) {
			if ( breakpoints[i].name === name ) {
				return breakpoints[i];
			}
		}
	},


	/**
	 * Alter the table display for a resized viewport. This involves first
	 * determining what breakpoint the window currently is in, getting the
	 * column visibilities to apply and then setting them.
	 *
	 * @private
	 */
	_resize: function ()
	{
		var dt = this.s.dt;
		var width = $(window).width();
		var breakpoints = this.c.breakpoints;
		var breakpoint = breakpoints[0].name;

		// Determine what breakpoint we are currently at
		for ( var i=breakpoints.length-1 ; i>=0 ; i-- ) {
			if ( width <= breakpoints[i].width ) {
				breakpoint = breakpoints[i].name;
				break;
			}
		}
		
		// Show the columns for that break point
		var columns = this._columnsVisiblity( breakpoint );

		dt.columns().eq(0).each( function ( colIdx, i ) {
			dt.column( colIdx ).visible( columns[i] );
		} );
	},


	/**
	 * Determine the width of each column in the table so the auto column hiding
	 * has that information to work with. This method is never going to be 100%
	 * perfect since column widths can change slightly per page, but without
	 * seriously compromising performance this is quite effective.
	 *
	 * @private
	 */
	_resizeAuto: function ()
	{
		var dt = this.s.dt;
		var columns = this.s.columns;

		// Are we allowed to do auto sizing?
		if ( ! this.c.auto ) {
			return;
		}

		// Are there any columns that actually need auto-sizing, or do they all
		// have classes defined
		if ( $.inArray( true, $.map( columns, function (c) { return c.auto; } ) ) === -1 ) {
			return;
		}

		// Clone the table with the current data in it
		var tableWidth   = dt.table().node().offsetWidth;
		var columnWidths = dt.columns;
		var clonedTable  = dt.table().node().cloneNode( false );
		var clonedHeader = $( dt.table().header().cloneNode( false ) ).appendTo( clonedTable );
		var clonedBody   = $( dt.table().body().cloneNode( false ) ).appendTo( clonedTable );

		// This is a bit slow, but we need to get a clone of each row that
		// includes all columns. As such, try to do this as little as possible.
		dt.rows( { page: 'current' } ).indexes().each( function ( idx ) {
			var clone = dt.row( idx ).node().cloneNode( true );
			
			if ( dt.columns( ':hidden' ).flatten().length ) {
				$(clone).append( dt.cells( idx, ':hidden' ).nodes().to$().clone() );
			}

			$(clone).appendTo( clonedBody );
		} );

		var cells        = dt.columns().header().to$().clone( false ).wrapAll('tr').appendTo( clonedHeader );
		var inserted     = $('<div/>')
			.css( {
				width: 1,
				height: 1,
				overflow: 'hidden'
			} )
			.append( clonedTable )
			.insertBefore( dt.table().node() );

		// The cloned header now contains the smallest that each column can be
		dt.columns().eq(0).each( function ( idx ) {
			columns[idx].minWidth = cells[ idx ].offsetWidth || 0;
		} );

		inserted.remove();
	}
};


/**
 * List of default breakpoints. Each item in the array is an object with two
 * properties:
 *
 * * `name` - the breakpoint name.
 * * `width` - the breakpoint width
 *
 * @name Responsive.breakpoints
 * @static
 */
Responsive.breakpoints = [
	{ name: 'desktop',  width: Infinity },
	{ name: 'tablet-l', width: 1024 },
	{ name: 'tablet-p', width: 768 },
	{ name: 'mobile-l', width: 480 },
	{ name: 'mobile-p', width: 320 }
];


/**
 * Responsive default settings for initialisation
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.defaults = {
	/**
	 * List of breakpoints for the instance. Note that this means that each
	 * instance can have its own breakpoints. Additionally, the breakpoints
	 * cannot be changed once an instance has been creased.
	 *
	 * @type {Array}
	 * @default Takes the value of `Responsive.breakpoints`
	 */
	breakpoints: Responsive.breakpoints,

	/**
	 * Enable / disable auto hiding calculations. It can help to increase
	 * performance slightly if you disable this option, but all columns would
	 * need to have breakpoint classes assigned to them
	 *
	 * @type {Boolean}
	 * @default  `true`
	 */
	auto: true,

	/**
	 * Details control. If given as a string value, the `type` property of the
	 * default object is set to that value, and the defaults used for the rest
	 * of the object - this is for ease of implementation.
	 *
	 * The object consists of the following properties:
	 *
	 * * `renderer` - function that is called for display of the child row data.
	 *   The default function will show the data from the hidden columns
	 * * `target` - Used as the selector for what objects to attach the child
	 *   open / close to
	 * * `type` - `false` to disable the details display, `inline` or `column`
	 *   for the two control types
	 *
	 * @type {Object|string}
	 */
	details: {
		renderer: function ( api, rowIdx ) {
			var data = api.cells( rowIdx, ':hidden' ).eq(0).map( function ( cell ) {
				var header = $( api.column( cell.column ).header() );

				if ( header.hasClass( 'control' ) ) {
					return '';
				}

				return '<li>'+
						'<span class="dtr-title">'+
							header.text()+':'+
						'</span> '+
						'<span class="dtr-data">'+
							api.cell( cell ).data()+
						'</span>'+
					'</li>';
			} ).toArray().join('');

			return data ?
				$('<ul/>').append( data ) :
				false;
		},

		target: 0,

		type: 'inline'
	}
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - work around for a bug in DT... Not documented
Api.register( 'responsive()', function () {
	return this;
} );

Api.register( 'responsive.recalc()', function ( rowIdx, intParse, virtual ) {
	this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._resizeAuto();
			ctx._responsive._resize();
		}
	} );
} );


/**
 * Version information
 *
 * @name Responsive.version
 * @static
 */
Responsive.version = '1.0.1';


$.fn.dataTable.Responsive = Responsive;
$.fn.DataTable.Responsive = Responsive;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'init.dt.dtr', function (e, settings, json) {
	if ( $(settings.nTable).hasClass( 'responsive' ) ||
		 $(settings.nTable).hasClass( 'dt-responsive' ) ||
		 settings.oInit.responsive
	) {
		var init = settings.oInit.responsive;

		if ( init !== false ) {
			new Responsive( settings, $.isPlainObject( init ) ? init : {}  );
		}
	}
} );

return Responsive;
}; // /factory


// Define as an AMD module if possible
if ( typeof define === 'function' && define.amd ) {
	define( ['jquery', 'datatables'], factory );
}
else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    factory( require('jquery'), require('datatables') );
}
else if ( jQuery && !jQuery.fn.dataTable.Responsive ) {
	// Otherwise simply initialise as normal, stopping multiple evaluation
	factory( jQuery, jQuery.fn.dataTable );
}


})(window, document);


'use strict';

// See https://datatables.net/extensions/buttons/
angular.module('datatables.buttons', ['datatables'])
    .config(dtButtonsConfig)
    .run(initButtonsPlugin);

/* @ngInject */
function dtButtonsConfig($provide) {
    $provide.decorator('DTOptionsBuilder', dtOptionsBuilderDecorator);

    function dtOptionsBuilderDecorator($delegate) {
        var newOptions = $delegate.newOptions;
        var fromSource = $delegate.fromSource;
        var fromFnPromise = $delegate.fromFnPromise;

        $delegate.newOptions = function() {
            return _decorateOptions(newOptions);
        };
        $delegate.fromSource = function(ajax) {
            return _decorateOptions(fromSource, ajax);
        };
        $delegate.fromFnPromise = function(fnPromise) {
            return _decorateOptions(fromFnPromise, fnPromise);
        };

        return $delegate;

        function _decorateOptions(fn, params) {
            var options = fn(params);
            options.withButtons = withButtons;
            return options;

            /**
             * Add buttons compatibility
             * @param buttonsOptions the options of the buttons extension (see https://datatables.net/reference/option/buttons#Examples)
             * @returns {DTOptions} the options
             */
            function withButtons(buttonsOptions) {
                var buttonsPrefix = 'B';
                options.dom = options.dom ? options.dom : $.fn.dataTable.defaults.sDom;
                if (options.dom.indexOf(buttonsPrefix) === -1) {
                    options.dom = buttonsPrefix + options.dom;
                }
                if (angular.isUndefined(buttonsOptions)) {
                    throw new Error('You must define the options for the button extension. See https://datatables.net/reference/option/buttons#Examples for some example');
                }
                options.buttons = buttonsOptions;
                return options;
            }
        }
    }
}

/* @ngInject */
function initButtonsPlugin(DTRendererService) {
    var buttonsPlugin = {
        preRender: preRender,
        postRender: postRender
    };
    DTRendererService.registerPlugin(buttonsPlugin);

    function preRender(options) {
        if (options && angular.isArray(options.buttons)) {
            // The extension buttons seems to clear the content of the options.buttons for some reasons...
            // So, we save it in a tmp variable so that we can restore it afterwards
            // See https://github.com/l-lin/angular-datatables/issues/502
            options.buttonsTmp = options.buttons.slice();
        }
    }

    function postRender(options) {
        if (options && angular.isDefined(options.buttonsTmp)) {
            // Restore the buttons options
            options.buttons = options.buttonsTmp;
            delete options.buttonsTmp;
        }
    }
}

/*!
 * HTML5 export buttons for Buttons and DataTables.
 * 2015 SpryMedia Ltd - datatables.net/license
 *
 * FileSaver.js (2015-05-07.2) - MIT license
 * Copyright © 2015 Eli Grey - http://eligrey.com
 */

(function($, DataTable) {
"use strict";


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * FileSaver.js dependency
 */

/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

var _saveAs = (function(view) {
	// IE <10 is explicitly unsupported
	if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			node.dispatchEvent(event);
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
		// https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
		// for the reasoning behind the timeout and revocation flow
		, arbitrary_revoke_timeout = 500 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			if (view.chrome) {
				revoker();
			} else {
				setTimeout(revoker, arbitrary_revoke_timeout);
			}
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob(["\ufeff", blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name) {
			blob = auto_bom(blob);
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					} else {
						var new_tab = view.open(object_url, "_blank");
						if (new_tab === undefined && typeof safari !== "undefined") {
							//Apple do not allow window.open, see http://bit.ly/1kZffRI
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				save_link.href = object_url;
				save_link.download = name;
				click(save_link);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				revoke(object_url);
				return;
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			// Update: Google errantly closed 91158, I submitted it again:
			// https://code.google.com/p/chromium/issues/detail?id=389642
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
									revoke(file);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name) {
			return navigator.msSaveOrOpenBlob(auto_bom(blob), name);
		};
	}

	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(window));



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local (private) functions
 */

/**
 * Get the title / file name for an exported file.
 *
 * @param {object}  config       Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
var _filename = function ( config, incExtension )
{
	var title = config.title;

	if ( title.indexOf( '*' ) !== -1 ) {
		title = title.replace( '*', $('title').text() );
	}

	// Strip characters which the OS will object to
	title = title.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

	return incExtension === undefined || incExtension === true ?
		title+config.extension :
		title;
};

/**
 * Get the newline character(s)
 *
 * @param {object}  config Button configuration
 * @return {string}        Newline character
 */
var _newLine = function ( config )
{
	return config.newline ?
		config.newline :
		navigator.userAgent.match(/Windows/) ?
			'\r\n' :
			'\n';
};

/**
 * Combine the data from the `buttons.exportData` method into a string that
 * will be used in the export file.
 *
 * @param  {DataTable.Api} dt     DataTables API instance
 * @param  {object}        config Button configuration
 * @return {object}               The data to export
 */
var _exportData = function ( dt, config )
{
	var newLine = _newLine( config );
	var data = dt.buttons.exportData( config.exportOptions );
	var join = function ( a ) {
		var s = '';
		var boundary = config.fieldBoundary;
		var separator = config.fieldSeparator;

		// If there is a field boundary, then we might need to escape it in
		// the source data
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( i > 0 ) {
				s += separator;
			}

			s += boundary ?
				boundary + a[i].replace( boundary, '\\'+boundary ) + boundary :
				a[i];
		}

		return s;
	};

	var header = config.header ? join( data.header )+newLine : '';
	var footer = config.footer ? newLine+join( data.footer ) : '';
	var body = [];

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		body.push( join( data.body[i] ) );
	}

	return {
		str: header + body.join( newLine ) + footer,
		rows: body.length
	};
};

/**
 * Safari's data: support for creating and downloading files is really poor, so
 * various options need to be disabled in it. See
 * https://bugs.webkit.org/show_bug.cgi?id=102914
 * 
 * @return {Boolean} `true` if Safari
 */
var _isSafari = function ()
{
	return navigator.userAgent.indexOf('Safari') !== -1 &&
		navigator.userAgent.indexOf('Chrome') === -1 &&
		navigator.userAgent.indexOf('Opera') === -1;
};


// Excel - Pre-defined strings to build a minimal XLSX file
var excelStrings = {
	"_rels/.rels": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\
	<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>\
</Relationships>',

	"xl/_rels/workbook.xml.rels": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\
	<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>\
</Relationships>',

	"[Content_Types].xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\
	<Default Extension="xml" ContentType="application/xml"/>\
	<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\
	<Default Extension="jpeg" ContentType="image/jpeg"/>\
	<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>\
	<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>\
</Types>',

	"xl/workbook.xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\
	<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>\
	<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>\
	<bookViews>\
		<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>\
	</bookViews>\
	<sheets>\
		<sheet name="Sheet1" sheetId="1" r:id="rId1"/>\
	</sheets>\
</workbook>',

	"xl/worksheets/sheet1.xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">\
	<sheetData>\
		__DATA__\
	</sheetData>\
</worksheet>'
};



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */

//
// Copy to clipboard
//
DataTable.ext.buttons.copyHtml5 = {
	className: 'buttons-copy buttons-html5',

	text: function ( dt ) {
		return dt.i18n( 'buttons.copy', 'Copy' );
	},

	action: function ( e, dt, button, config ) {
		// This button is slightly sneaky as there is no HTML API to copy text
		// to a clipboard, so what it does is use the buttons information
		// element with an also completely hidden textarea that contains the
		// data to be copied. That is pre-selected so the user just needs to
		// activate their system clipboard.
		var newLine = _newLine( config );
		var output = _exportData( dt, config ).str;
		var message = $('<span>'+dt.i18n( 'buttons.copyKeys',
				'Press <i>ctrl</i> or <i>\u2318</i> + <i>C</i> to copy the table data<br>to your system clipboard.<br><br>'+
				'To cancel, click this message or press escape.' )+'</span>'
			)
			.append( $('<div/>')
				.css( {
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<textarea readonly/>').val( output )
				)
		);

		dt.buttons.info( dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ), message, 0 );

		// Select the text so when the user activates their system clipboard
		// it will copy that text
		message.find('textarea')[0].focus();
		message.find('textarea')[0].select();

		// Event to hide the message when the user is done
		var container = $(message).closest('.dt-button-info');
		var close = function () {
			container.off( 'click.buttons-copy' );
			$(document).off( '.buttons-copy' );
			dt.buttons.info( false );
		};

		container.on( 'click.buttons-copy', close );
		$(document)
			.on( 'keydown.buttons-copy', function (e) {
				if ( e.keyCode === 27 ) { // esc
					close();
				}
			} )
			.on( 'copy.buttons-copy cut.buttons-copy', function () {
				close();
			} );
	},

	exportOptions: {},

	fieldSeparator: '\t',

	fieldBoundary: '',

	header: true,

	footer: false
};

//
// CSV export
//
DataTable.ext.buttons.csvHtml5 = {
	className: 'buttons-csv buttons-html5',

	available: function () {
		return window.FileReader !== undefined && window.Blob;
	},

	text: function ( dt ) {
		return dt.i18n( 'buttons.csv', 'CSV' );
	},

	action: function ( e, dt, button, config ) {
		// Set the text
		var newLine = _newLine( config );
		var output = _exportData( dt, config ).str;

		_saveAs(
			new Blob( [output], {type : 'text/csv'} ),
			_filename( config )
		);
	},

	title: '*',

	extension: '.csv',

	exportOptions: {},

	fieldSeparator: ',',

	fieldBoundary: '"',

	header: true,

	footer: false
};

//
// Excel (xlsx) export
//
DataTable.ext.buttons.excelHtml5 = {
	className: 'buttons-excel buttons-html5',

	available: function () {
		return window.FileReader !== undefined && window.JSZip !== undefined && ! _isSafari();
	},

	text: function ( dt ) {
		return dt.i18n( 'buttons.excel', 'Excel' );
	},

	action: function ( e, dt, button, config ) {
		// Set the text
		var xml = '';
		var data = dt.buttons.exportData( config.exportOptions );
		var addRow = function ( row ) {
			var cells = [];

			for ( var i=0, ien=row.length ; i<ien ; i++ ) {
				cells.push( $.isNumeric( row[i] ) ?
					'<c t="n"><v>'+row[i]+'</v></c>' :
					'<c t="inlineStr"><is><t>'+
						row[i].replace(/&(?!amp;)/g, '&amp;')+
					'</t></is></c>'
				);
			}

			return '<row>'+cells.join('')+'</row>';
		};

		if ( config.header ) {
			xml += addRow( data.header );
		}

		for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
			xml += addRow( data.body[i] );
		}

		if ( config.footer ) {
			xml += addRow( data.footer );
		}

		var zip           = new window.JSZip();
		var _rels         = zip.folder("_rels");
		var xl            = zip.folder("xl");
		var xl_rels       = zip.folder("xl/_rels");
		var xl_worksheets = zip.folder("xl/worksheets");

		zip.file(           '[Content_Types].xml', excelStrings['[Content_Types].xml'] );
		_rels.file(         '.rels',               excelStrings['_rels/.rels'] );
		xl.file(            'workbook.xml',        excelStrings['xl/workbook.xml'] );
		xl_rels.file(       'workbook.xml.rels',   excelStrings['xl/_rels/workbook.xml.rels'] );
		xl_worksheets.file( 'sheet1.xml',          excelStrings['xl/worksheets/sheet1.xml'].replace( '__DATA__', xml ) );

		_saveAs(
			zip.generate( {type:"blob"} ),
			_filename( config )
		);
	},

	title: '*',

	extension: '.xlsx',

	exportOptions: {},

	header: true,

	footer: false
};

//
// PDF export - using pdfMake - http://pdfmake.org
//
DataTable.ext.buttons.pdfHtml5 = {
	className: 'buttons-pdf buttons-html5',

	available: function () {
		return window.FileReader !== undefined && window.pdfMake;
	},

	text: function ( dt ) {
		return dt.i18n( 'buttons.pdf', 'PDF' );
	},

	action: function ( e, dt, button, config ) {
		var newLine = _newLine( config );
		var data = dt.buttons.exportData( config.exportOptions );
		var rows = [];

		if ( config.header ) {
			rows.push( $.map( data.header, function ( d ) {
				return {
					text: d,
					style: 'tableHeader'
				};
			} ) );
		}

		for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
			rows.push( $.map( data.body[i], function ( d ) {
				return {
					text: d,
					style: i % 2 ? 'tableBodyEven' : 'tableBodyOdd'
				};
			} ) );
		}

		if ( config.footer ) {
			rows.push( $.map( data.footer, function ( d ) {
				return {
					text: d,
					style: 'tableFooter'
				};
			} ) );
		}

		var doc = {
			pageSize: config.pageSize,
			pageOrientation: config.orientation,
			content: [
				{
					table: {
						headerRows: 1,
						body: rows
					},
					layout: 'noBorders'
				}
			],
			styles: {
				tableHeader: {
					bold: true,
					fontSize: 11,
					color: 'white',
					fillColor: '#2d4154',
					alignment: 'center'
				},
				tableBodyEven: {},
				tableBodyOdd: {
					fillColor: '#f3f3f3'
				},
				tableFooter: {
					bold: true,
					fontSize: 11,
					color: 'white',
					fillColor: '#2d4154'
				},
				title: {
					alignment: 'center',
					fontSize: 15
				},
				message: {}
			},
			defaultStyle: {
				fontSize: 10
			}
		};

		if ( config.message ) {
			doc.content.unshift( {
				text: config.message,
				style: 'message',
				margin: [ 0, 0, 0, 12 ]
			} );
		}

		if ( config.title ) {
			doc.content.unshift( {
				text: _filename( config, false ),
				style: 'title',
				margin: [ 0, 0, 0, 12 ]
			} );
		}

		if ( config.customize ) {
			config.customize( doc );
		}

		var pdf = window.pdfMake.createPdf( doc );

		if ( config.download === 'open' && ! _isSafari() ) {
			pdf.open();
		}
		else {
			pdf.getBuffer( function (buffer) {
				var blob = new Blob( [buffer], {type:'application/pdf'} );

				_saveAs( blob, _filename( config ) );
			} );
		}
	},

	title: '*',

	extension: '.pdf',

	exportOptions: {},

	orientation: 'portrait',

	pageSize: 'A4',

	header: true,

	footer: false,

	message: null,

	customize: null,

	download: 'download'
};


})(jQuery, jQuery.fn.dataTable);

(function(d){"function"===typeof define&&define.amd?define(["jquery","datatables.net","datatables.net-buttons"],function(e){return d(e,window,document)}):"object"===typeof exports?module.exports=function(e,a){e||(e=window);if(!a||!a.fn.dataTable)a=require("datatables.net")(e,a).$;a.fn.dataTable.Buttons||require("datatables.net-buttons")(e,a);return d(a,e,e.document)}:d(jQuery,window,document)})(function(d,e,a){var i=d.fn.dataTable,g=a.createElement("a");i.ext.buttons.print={className:"buttons-print",
text:function(c){return c.i18n("buttons.print","Print")},action:function(c,b,a,f){c=b.buttons.exportData(f.exportOptions);a=function(c,a){for(var b="<tr>",d=0,e=c.length;d<e;d++)b+="<"+a+">"+c[d]+"</"+a+">";return b+"</tr>"};b='<table class="'+b.table().node().className+'">';f.header&&(b+="<thead>"+a(c.header,"th")+"</thead>");for(var b=b+"<tbody>",j=0,i=c.body.length;j<i;j++)b+=a(c.body[j],"td");b+="</tbody>";f.footer&&(b+="<tfoot>"+a(c.footer,"th")+"</tfoot>");var h=e.open("",""),c=f.title;"function"===
typeof c&&(c=c());-1!==c.indexOf("*")&&(c=c.replace("*",d("title").text()));h.document.close();var k="<title>"+c+"</title>";d("style, link").each(function(){var c=k,b=d(this).clone()[0],a;"link"===b.nodeName.toLowerCase()&&(g.href=b.href,a=g.host,-1===a.indexOf("/")&&0!==g.pathname.indexOf("/")&&(a+="/"),b.href=g.protocol+"//"+a+g.pathname+g.search);k=c+b.outerHTML});d(h.document.head).html(k);d(h.document.body).html("<h1>"+c+"</h1><div>"+f.message+"</div>"+b);f.customize&&f.customize(h);setTimeout(function(){f.autoPrint&&
(h.print(),h.close())},250)},title:"*",message:"",exportOptions:{},header:!0,footer:!1,autoPrint:!0,customize:null};return i.Buttons});
/*!
 * Column visibility buttons for Buttons and DataTables.
 * 2015 SpryMedia Ltd - datatables.net/license
 */

(function($, DataTable) {
"use strict";


$.extend( DataTable.ext.buttons, {
	// A collection of column visibility buttons
	colvis: function ( dt, conf ) {
		return {
			extend: 'collection',
			text: function ( dt ) {
				return dt.i18n( 'buttons.colvis', 'Column visibility' );
			},
			className: 'buttons-colvis',
			buttons: [ {
				extend: 'columnsToggle',
				columns: conf.columns
			} ]
		};
	},

	// Selected columns with individual buttons - toggle column visibility
	columnsToggle: function ( dt, conf ) {
		var columns = dt.columns( conf.columns ).indexes().map( function ( idx ) {
			return {
				extend: 'columnToggle',
				columns: idx
			};
		} ).toArray();

		return columns;
	},

	// Single button to toggle column visibility
	columnToggle: function ( dt, conf ) {
		return {
			extend: 'columnVisibility',
			columns: conf.columns
		};
	},

	// Selected columns with individual buttons - set column visibility
	columnsVisibility: function ( dt, conf ) {
		var columns = dt.columns( conf.columns ).indexes().map( function ( idx ) {
			return {
				extend: 'columnVisibility',
				columns: idx,
				visibility: conf.visibility
			};
		} ).toArray();

		return columns;
	},

	// Single button to set column visibility
	columnVisibility: {
		columns: null, // column selector
		text: function ( dt, button, conf ) {
			return conf._columnText( dt, conf.columns );
		},
		className: 'buttons-columnVisibility',
		action: function ( e, dt, button, conf ) {
			var col = dt.column( conf.columns );

			col.visible( conf.visibility !== undefined ?
				conf.visibility :
				! col.visible()
			);
		},
		init: function ( dt, button, conf ) {
			var that = this;
			var col = dt.column( conf.columns );

			dt
				.on( 'column-visibility.dt'+conf.namespace, function (e, settings, column, state) {
					if ( column === conf.columns ) {
						that.active( state );
					}
				} )
				.on( 'column-reorder.dt'+conf.namespace, function (e, settings, details) {
					var col = dt.column( conf.columns );

					button.text( conf._columnText( dt, conf.columns ) );
					that.active( col.visible() );
				} );

			this.active( col.visible() );
		},
		destroy: function ( dt, button, conf ) {
			dt
				.off( 'column-visibility.dt'+conf.namespace )
				.off( 'column-reorder.dt'+conf.namespace );
		},

		_columnText: function ( dt, col ) {
			// Use DataTables' internal data structure until this is presented
			// is a public API. The other option is to use
			// `$( column(col).node() ).text()` but the node might not have been
			// populated when Buttons is constructed.
			var idx = dt.column( col ).index();
			return dt.settings()[0].aoColumns[ idx ].sTitle
				.replace(/\n/g," ")        // remove new lines
				.replace( /<.*?>/g, "" )   // strip HTML
				.replace(/^\s+|\s+$/g,""); // trim
		}
	},


	colvisRestore: {
		className: 'buttons-colvisRestore',

		text: function ( dt ) {
			return dt.i18n( 'buttons.colvisRestore', 'Restore visibility' );
		},

		init: function ( dt, button, conf ) {
			conf._visOriginal = dt.columns().indexes().map( function ( idx ) {
				return dt.column( idx ).visible();
			} ).toArray();
		},

		action: function ( e, dt, button, conf ) {
			dt.columns().every( function ( i ) {
				this.visible( conf._visOriginal[ i ] );
			} );
		}
	},


	colvisGroup: {
		className: 'buttons-colvisGroup',

		action: function ( e, dt, button, conf ) {
			dt.columns( conf.show ).visible( true );
			dt.columns( conf.hide ).visible( false );
		},

		show: [],

		hide: []
	}
} );


})(jQuery, jQuery.fn.dataTable);

/*!
 * Flash export buttons for Buttons and DataTables.
 * 2015 SpryMedia Ltd - datatables.net/license
 *
 * ZeroClipbaord - MIT license
 * Copyright (c) 2012 Joseph Huckaby
 */

(function($, DataTable) {
"use strict";


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * ZeroClipboard dependency
 */

/*
 * ZeroClipboard 1.0.4 with modifications
 * Author: Joseph Huckaby
 * License: MIT
 *
 * Copyright (c) 2012 Joseph Huckaby
 */
var ZeroClipboard_TableTools = {
	version: "1.0.4-TableTools2",
	clients: {}, // registered upload clients on page, indexed by id
	moviePath: '', // URL to movie
	nextId: 1, // ID of next movie

	$: function(thingy) {
		// simple DOM lookup utility function
		if (typeof(thingy) == 'string') {
			thingy = document.getElementById(thingy);
		}
		if (!thingy.addClass) {
			// extend element with a few useful methods
			thingy.hide = function() { this.style.display = 'none'; };
			thingy.show = function() { this.style.display = ''; };
			thingy.addClass = function(name) { this.removeClass(name); this.className += ' ' + name; };
			thingy.removeClass = function(name) {
				this.className = this.className.replace( new RegExp("\\s*" + name + "\\s*"), " ").replace(/^\s+/, '').replace(/\s+$/, '');
			};
			thingy.hasClass = function(name) {
				return !!this.className.match( new RegExp("\\s*" + name + "\\s*") );
			};
		}
		return thingy;
	},

	setMoviePath: function(path) {
		// set path to ZeroClipboard.swf
		this.moviePath = path;
	},

	dispatch: function(id, eventName, args) {
		// receive event from flash movie, send to client
		var client = this.clients[id];
		if (client) {
			client.receiveEvent(eventName, args);
		}
	},

	register: function(id, client) {
		// register new client to receive events
		this.clients[id] = client;
	},

	getDOMObjectPosition: function(obj) {
		// get absolute coordinates for dom element
		var info = {
			left: 0,
			top: 0,
			width: obj.width ? obj.width : obj.offsetWidth,
			height: obj.height ? obj.height : obj.offsetHeight
		};

		if ( obj.style.width !== "" ) {
			info.width = obj.style.width.replace("px","");
		}

		if ( obj.style.height !== "" ) {
			info.height = obj.style.height.replace("px","");
		}

		while (obj) {
			info.left += obj.offsetLeft;
			info.top += obj.offsetTop;
			obj = obj.offsetParent;
		}

		return info;
	},

	Client: function(elem) {
		// constructor for new simple upload client
		this.handlers = {};

		// unique ID
		this.id = ZeroClipboard_TableTools.nextId++;
		this.movieId = 'ZeroClipboard_TableToolsMovie_' + this.id;

		// register client with singleton to receive flash events
		ZeroClipboard_TableTools.register(this.id, this);

		// create movie
		if (elem) {
			this.glue(elem);
		}
	}
};

ZeroClipboard_TableTools.Client.prototype = {

	id: 0, // unique ID for us
	ready: false, // whether movie is ready to receive events or not
	movie: null, // reference to movie object
	clipText: '', // text to copy to clipboard
	fileName: '', // default file save name
	action: 'copy', // action to perform
	handCursorEnabled: true, // whether to show hand cursor, or default pointer cursor
	cssEffects: true, // enable CSS mouse effects on dom container
	handlers: null, // user event handlers
	sized: false,

	glue: function(elem, title) {
		// glue to DOM element
		// elem can be ID or actual DOM element object
		this.domElement = ZeroClipboard_TableTools.$(elem);

		// float just above object, or zIndex 99 if dom element isn't set
		var zIndex = 99;
		if (this.domElement.style.zIndex) {
			zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
		}

		// find X/Y position of domElement
		var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);

		// create floating DIV above element
		this.div = document.createElement('div');
		var style = this.div.style;
		style.position = 'absolute';
		style.left = '0px';
		style.top = '0px';
		style.width = (box.width) + 'px';
		style.height = box.height + 'px';
		style.zIndex = zIndex;

		if ( typeof title != "undefined" && title !== "" ) {
			this.div.title = title;
		}
		if ( box.width !== 0 && box.height !== 0 ) {
			this.sized = true;
		}

		// style.backgroundColor = '#f00'; // debug
		if ( this.domElement ) {
			this.domElement.appendChild(this.div);
			this.div.innerHTML = this.getHTML( box.width, box.height ).replace(/&/g, '&amp;');
		}
	},

	positionElement: function() {
		var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);
		var style = this.div.style;

		style.position = 'absolute';
		//style.left = (this.domElement.offsetLeft)+'px';
		//style.top = this.domElement.offsetTop+'px';
		style.width = box.width + 'px';
		style.height = box.height + 'px';

		if ( box.width !== 0 && box.height !== 0 ) {
			this.sized = true;
		} else {
			return;
		}

		var flash = this.div.childNodes[0];
		flash.width = box.width;
		flash.height = box.height;
	},

	getHTML: function(width, height) {
		// return HTML for movie
		var html = '';
		var flashvars = 'id=' + this.id +
			'&width=' + width +
			'&height=' + height;

		if (navigator.userAgent.match(/MSIE/)) {
			// IE gets an OBJECT tag
			var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
			html += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+protocol+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="'+width+'" height="'+height+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard_TableTools.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+flashvars+'"/><param name="wmode" value="transparent"/></object>';
		}
		else {
			// all other browsers get an EMBED tag
			html += '<embed id="'+this.movieId+'" src="'+ZeroClipboard_TableTools.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+width+'" height="'+height+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+flashvars+'" wmode="transparent" />';
		}
		return html;
	},

	hide: function() {
		// temporarily hide floater offscreen
		if (this.div) {
			this.div.style.left = '-2000px';
		}
	},

	show: function() {
		// show ourselves after a call to hide()
		this.reposition();
	},

	destroy: function() {
		// destroy control and floater
		var that = this;

		if (this.domElement && this.div) {
			$(this.div).remove();

			this.domElement = null;
			this.div = null;

			$.each( ZeroClipboard_TableTools.clients, function ( id, client ) {
				if ( client === that ) {
					delete ZeroClipboard_TableTools.clients[ id ];
				}
			} );
		}
	},

	reposition: function(elem) {
		// reposition our floating div, optionally to new container
		// warning: container CANNOT change size, only position
		if (elem) {
			this.domElement = ZeroClipboard_TableTools.$(elem);
			if (!this.domElement) {
				this.hide();
			}
		}

		if (this.domElement && this.div) {
			var box = ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);
			var style = this.div.style;
			style.left = '' + box.left + 'px';
			style.top = '' + box.top + 'px';
		}
	},

	clearText: function() {
		// clear the text to be copy / saved
		this.clipText = '';
		if (this.ready) {
			this.movie.clearText();
		}
	},

	appendText: function(newText) {
		// append text to that which is to be copied / saved
		this.clipText += newText;
		if (this.ready) { this.movie.appendText(newText) ;}
	},

	setText: function(newText) {
		// set text to be copied to be copied / saved
		this.clipText = newText;
		if (this.ready) { this.movie.setText(newText) ;}
	},

	setFileName: function(newText) {
		// set the file name
		this.fileName = newText;
		if (this.ready) {
			this.movie.setFileName(newText);
		}
	},

	setAction: function(newText) {
		// set action (save or copy)
		this.action = newText;
		if (this.ready) {
			this.movie.setAction(newText);
		}
	},

	addEventListener: function(eventName, func) {
		// add user event listener for event
		// event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');
		if (!this.handlers[eventName]) {
			this.handlers[eventName] = [];
		}
		this.handlers[eventName].push(func);
	},

	setHandCursor: function(enabled) {
		// enable hand cursor (true), or default arrow cursor (false)
		this.handCursorEnabled = enabled;
		if (this.ready) {
			this.movie.setHandCursor(enabled);
		}
	},

	setCSSEffects: function(enabled) {
		// enable or disable CSS effects on DOM container
		this.cssEffects = !!enabled;
	},

	receiveEvent: function(eventName, args) {
		var self;

		// receive event from flash
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');

		// special behavior for certain events
		switch (eventName) {
			case 'load':
				// movie claims it is ready, but in IE this isn't always the case...
				// bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
				this.movie = document.getElementById(this.movieId);
				if (!this.movie) {
					self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 1 );
					return;
				}

				// firefox on pc needs a "kick" in order to set these in certain cases
				if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
					self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 100 );
					this.ready = true;
					return;
				}

				this.ready = true;
				this.movie.clearText();
				this.movie.appendText( this.clipText );
				this.movie.setFileName( this.fileName );
				this.movie.setAction( this.action );
				this.movie.setHandCursor( this.handCursorEnabled );
				break;

			case 'mouseover':
				if (this.domElement && this.cssEffects) {
					//this.domElement.addClass('hover');
					if (this.recoverActive) {
						this.domElement.addClass('active');
					}
				}
				break;

			case 'mouseout':
				if (this.domElement && this.cssEffects) {
					this.recoverActive = false;
					if (this.domElement.hasClass('active')) {
						this.domElement.removeClass('active');
						this.recoverActive = true;
					}
					//this.domElement.removeClass('hover');
				}
				break;

			case 'mousedown':
				if (this.domElement && this.cssEffects) {
					this.domElement.addClass('active');
				}
				break;

			case 'mouseup':
				if (this.domElement && this.cssEffects) {
					this.domElement.removeClass('active');
					this.recoverActive = false;
				}
				break;
		} // switch eventName

		if (this.handlers[eventName]) {
			for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
				var func = this.handlers[eventName][idx];

				if (typeof(func) == 'function') {
					// actual function reference
					func(this, args);
				}
				else if ((typeof(func) == 'object') && (func.length == 2)) {
					// PHP style object + method, i.e. [myObject, 'myMethod']
					func[0][ func[1] ](this, args);
				}
				else if (typeof(func) == 'string') {
					// name of function
					window[func](this, args);
				}
			} // foreach event handler defined
		} // user defined handler for event
	}
};

ZeroClipboard_TableTools.hasFlash = function ()
{
	try {
		var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
		if (fo) {
			return true;
		}
	}
	catch (e) {
		if (
			navigator.mimeTypes &&
			navigator.mimeTypes['application/x-shockwave-flash'] !== undefined &&
			navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin
		) {
			return true;
		}
	}

	return false;
};

// For the Flash binding to work, ZeroClipboard_TableTools must be on the global
// object list
window.ZeroClipboard_TableTools = ZeroClipboard_TableTools;



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local (private) functions
 */

/**
 * If a Buttons instance is initlaised before it is placed into the DOM, Flash
 * won't be able to bind to it, so we need to wait until it is available, this
 * method abstracts that out.
 *
 * @param {ZeroClipboard} flash ZeroClipboard instance
 * @param {jQuery} node  Button
 */
var _glue = function ( flash, node )
{
	var id = node.attr('id');

	if ( node.parents('html').length ) {
		flash.glue( node[0], '' );
	}
	else {
		setTimeout( function () {
			_glue( flash, node );
		}, 500 );
	}
};

/**
 * Get the title / file name for an exported file.
 *
 * @param {object}  config       Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
var _filename = function ( config, incExtension )
{
	var title = config.title;

	if ( title.indexOf( '*' ) !== -1 ) {
		title = title.replace( '*', $('title').text() );
	}

	// Strip characters which the OS will object to
	title = title.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

	return incExtension === undefined || incExtension === true ?
		title+config.extension :
		title;
};

/**
 * Set the flash text. This has to be broken up into chunks as the Javascript /
 * Flash bridge has a size limit. There is no indication in the Flash
 * documentation what this is, and it probably depends upon the browser.
 * Experimentation shows that the point is around 50k when data starts to get
 * lost, so an 8K limit used here is safe.
 *
 * @param {ZeroClipboard} flash ZeroClipboard instance
 * @param {string}        data  Data to send to Flash
 */
var _setText = function ( flash, data )
{
	var parts = data.match(/[\s\S]{1,8192}/g) || [];

	flash.clearText();
	for ( var i=0, len=parts.length ; i<len ; i++ )
	{
		flash.appendText( parts[i] );
	}
};

/**
 * Get the newline character(s)
 *
 * @param {object}  config Button configuration
 * @return {string}        Newline character
 */
var _newLine = function ( config )
{
	return config.newline ?
		config.newline :
		navigator.userAgent.match(/Windows/) ?
			'\r\n' :
			'\n';
};

/**
 * Combine the data from the `buttons.exportData` method into a string that
 * will be used in the export file.
 *
 * @param  {DataTable.Api} dt     DataTables API instance
 * @param  {object}        config Button configuration
 * @return {object}               The data to export
 */
var _exportData = function ( dt, config )
{
	var newLine = _newLine( config );
	var data = dt.buttons.exportData( config.exportOptions );
	var join = function ( a ) {
		var s = '';
		var boundary = config.fieldBoundary;
		var separator = config.fieldSeparator;

		// If there is a field boundary, then we might need to escape it in
		// the source data
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( i > 0 ) {
				s += separator;
			}

			s += boundary ?
				boundary + a[i].replace( boundary, '\\'+boundary ) + boundary :
				a[i];
		}

		return s;
	};

	var header = config.header ? join( data.header )+newLine : '';
	var footer = config.footer ? newLine+join( data.footer ) : '';
	var body = [];

	for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
		body.push( join( data.body[i] ) );
	}

	return {
		str: header + body.join( newLine ) + footer,
		rows: body.length
	};
};


// Basic initialisation for the buttons is common between them
var flashButton = {
	available: function () {
		return ZeroClipboard_TableTools.hasFlash();
	},

	init: function ( dt, button, config ) {
		// Insert the Flash movie
		ZeroClipboard_TableTools.moviePath = DataTable.Buttons.swfPath;
		var flash = new ZeroClipboard_TableTools.Client();

		flash.setHandCursor( true );
		flash.addEventListener('mouseDown', function(client) {
			config._fromFlash = true;
			dt.button( button[0] ).trigger();
			config._fromFlash = false;
		} );

		_glue( flash, button );

		config._flash = flash;
	},

	destroy: function ( dt, button, config ) {
		config._flash.destroy();
	},

	fieldSeparator: ',',

	fieldBoundary: '"',

	exportOptions: {},

	title: '*',

	extension: '.csv',

	header: true,

	footer: false
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables options and methods
 */

// Set the default SWF path
DataTable.Buttons.swfPath = '//cdn.datatables.net/buttons/1.0.0/swf/flashExport.swf';

// Method to allow Flash buttons to be resized when made visible - as they are
// of zero height and width if initialised hidden
DataTable.Api.register( 'buttons.resize()', function () {
	$.each( ZeroClipboard_TableTools.clients, function ( i, client ) {
		if ( client.domElement !== undefined && client.domElement.parentNode ) {
			client.positionElement();
		}
	} );
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Button definitions
 */

// Copy to clipboard
DataTable.ext.buttons.copyFlash = $.extend( {}, flashButton, {
	className: 'buttons-copy buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.copy', 'Copy' );
	},

	action: function ( e, dt, button, config ) {
		// Check that the trigger did actually occur due to a Flash activation
		if ( ! config._fromFlash ) {
			return;
		}

		var flash = config._flash;
		var data = _exportData( dt, config );

		flash.setAction( 'copy' );
		_setText( flash, data.str ); 

		dt.buttons.info(
			dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ),
			dt.i18n( 'buttons.copyInfo', {
				_: 'Copied %d rows to clipboard',
				1: 'Copied 1 row to clipboard'
			}, data.rows ),
			3000
		);
	},

	fieldSeparator: '\t',

	fieldBoundary: ''
} );

// CSV save file
DataTable.ext.buttons.csvFlash = $.extend( {}, flashButton, {
	className: 'buttons-csv buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.csv', 'CSV' );
	},

	action: function ( e, dt, button, config ) {
		// Set the text
		var flash = config._flash;
		var data = _exportData( dt, config );

		flash.setAction( 'csv' );
		flash.setFileName( _filename( config ) );
		_setText( flash, data.str );
	}
} );

// Excel save file - this is really a CSV file using UTF-8 that Excel can read
DataTable.ext.buttons.excelFlash = $.extend( {}, flashButton, {
	className: 'buttons-excel buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.excel', 'Excel' );
	},

	action: function ( e, dt, button, config ) {
		// Set the text
		var xml = '';
		var flash = config._flash;
		var data = dt.buttons.exportData( config.exportOptions );
		var addRow = function ( row ) {
			var cells = [];

			for ( var i=0, ien=row.length ; i<ien ; i++ ) {
				cells.push( $.isNumeric( row[i] ) ?
					'<c t="n"><v>'+row[i]+'</v></c>' :
					'<c t="inlineStr"><is><t>'+
						row[i].replace(/&(?!amp;)/g, '&amp;')+
					'</t></is></c>'
				);
			}

			return '<row>'+cells.join('')+'</row>';
		};

		if ( config.header ) {
			xml += addRow( data.header );
		}

		for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
			xml += addRow( data.body[i] );
		}

		if ( config.footer ) {
			xml += addRow( data.footer );
		}

		flash.setAction( 'excel' );
		flash.setFileName( _filename( config ) );
		_setText( flash, xml );
	},

	extension: '.xlsx'
} );

// PDF export
DataTable.ext.buttons.pdfFlash = $.extend( {}, flashButton, {
	className: 'buttons-pdf buttons-flash',

	text: function ( dt ) {
		return dt.i18n( 'buttons.pdf', 'PDF' );
	},

	action: function ( e, dt, button, config ) {
		// Set the text
		var flash = config._flash;
		var data = dt.buttons.exportData( config.exportOptions );
		var totalWidth = dt.table().node().offsetWidth;

		// Calculate the column width ratios for layout of the table in the PDF
		var ratios = dt.columns( config.columns ).indexes().map( function ( idx ) {
			return dt.column( idx ).header().offsetWidth / totalWidth;
		} );

		flash.setAction( 'pdf' );
		flash.setFileName( _filename( config ) );

		_setText( flash, JSON.stringify( {
			title:       _filename(config, false),
			message:     config.message,
			colWidth:    ratios.toArray(),
			orientation: config.orientation,
			size:        config.pageSize,
			header:      config.header ? data.header : null,
			footer:      config.footer ? data.footer : null,
			body:        data.body
		} ) );
	},

	extension: '.pdf',

	orientation: 'portrait',

	pageSize: 'A4',

	message: '',

	newline: '\n'
} );


})(jQuery, jQuery.fn.dataTable);

/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(p,h){var i={},l=i.lib={},r=l.Base=function(){function a(){}return{extend:function(e){a.prototype=this;var c=new a;e&&c.mixIn(e);c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),o=l.WordArray=r.extend({init:function(a,e){a=
this.words=a||[];this.sigBytes=e!=h?e:4*a.length},toString:function(a){return(a||s).stringify(this)},concat:function(a){var e=this.words,c=a.words,b=this.sigBytes,a=a.sigBytes;this.clamp();if(b%4)for(var d=0;d<a;d++)e[b+d>>>2]|=(c[d>>>2]>>>24-8*(d%4)&255)<<24-8*((b+d)%4);else if(65535<c.length)for(d=0;d<a;d+=4)e[b+d>>>2]=c[d>>>2];else e.push.apply(e,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,e=this.sigBytes;a[e>>>2]&=4294967295<<32-8*(e%4);a.length=p.ceil(e/4)},clone:function(){var a=
r.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var e=[],c=0;c<a;c+=4)e.push(4294967296*p.random()|0);return o.create(e,a)}}),m=i.enc={},s=m.Hex={stringify:function(a){for(var e=a.words,a=a.sigBytes,c=[],b=0;b<a;b++){var d=e[b>>>2]>>>24-8*(b%4)&255;c.push((d>>>4).toString(16));c.push((d&15).toString(16))}return c.join("")},parse:function(a){for(var e=a.length,c=[],b=0;b<e;b+=2)c[b>>>3]|=parseInt(a.substr(b,2),16)<<24-4*(b%8);return o.create(c,e/2)}},n=m.Latin1={stringify:function(a){for(var e=
a.words,a=a.sigBytes,c=[],b=0;b<a;b++)c.push(String.fromCharCode(e[b>>>2]>>>24-8*(b%4)&255));return c.join("")},parse:function(a){for(var e=a.length,c=[],b=0;b<e;b++)c[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return o.create(c,e)}},k=m.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(e){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},f=l.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=o.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=k.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var e=this._data,c=e.words,b=e.sigBytes,d=this.blockSize,q=b/(4*d),q=a?p.ceil(q):p.max((q|0)-this._minBufferSize,0),a=q*d,b=p.min(4*a,b);if(a){for(var j=0;j<a;j+=d)this._doProcessBlock(c,j);j=c.splice(0,a);e.sigBytes-=b}return o.create(j,b)},clone:function(){var a=r.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=f.extend({init:function(){this.reset()},
reset:function(){f.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=f.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(e,c){return a.create(c).finalize(e)}},_createHmacHelper:function(a){return function(e,c){return g.HMAC.create(a,c).finalize(e)}}});var g=i.algo={};return i}(Math);
(function(){var p=CryptoJS,h=p.lib.WordArray;p.enc.Base64={stringify:function(i){var l=i.words,h=i.sigBytes,o=this._map;i.clamp();for(var i=[],m=0;m<h;m+=3)for(var s=(l[m>>>2]>>>24-8*(m%4)&255)<<16|(l[m+1>>>2]>>>24-8*((m+1)%4)&255)<<8|l[m+2>>>2]>>>24-8*((m+2)%4)&255,n=0;4>n&&m+0.75*n<h;n++)i.push(o.charAt(s>>>6*(3-n)&63));if(l=o.charAt(64))for(;i.length%4;)i.push(l);return i.join("")},parse:function(i){var i=i.replace(/\s/g,""),l=i.length,r=this._map,o=r.charAt(64);o&&(o=i.indexOf(o),-1!=o&&(l=o));
for(var o=[],m=0,s=0;s<l;s++)if(s%4){var n=r.indexOf(i.charAt(s-1))<<2*(s%4),k=r.indexOf(i.charAt(s))>>>6-2*(s%4);o[m>>>2]|=(n|k)<<24-8*(m%4);m++}return h.create(o,m)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(p){function h(f,g,a,e,c,b,d){f=f+(g&a|~g&e)+c+d;return(f<<b|f>>>32-b)+g}function i(f,g,a,e,c,b,d){f=f+(g&e|a&~e)+c+d;return(f<<b|f>>>32-b)+g}function l(f,g,a,e,c,b,d){f=f+(g^a^e)+c+d;return(f<<b|f>>>32-b)+g}function r(f,g,a,e,c,b,d){f=f+(a^(g|~e))+c+d;return(f<<b|f>>>32-b)+g}var o=CryptoJS,m=o.lib,s=m.WordArray,m=m.Hasher,n=o.algo,k=[];(function(){for(var f=0;64>f;f++)k[f]=4294967296*p.abs(p.sin(f+1))|0})();n=n.MD5=m.extend({_doReset:function(){this._hash=s.create([1732584193,4023233417,
2562383102,271733878])},_doProcessBlock:function(f,g){for(var a=0;16>a;a++){var e=g+a,c=f[e];f[e]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360}for(var e=this._hash.words,c=e[0],b=e[1],d=e[2],q=e[3],a=0;64>a;a+=4)16>a?(c=h(c,b,d,q,f[g+a],7,k[a]),q=h(q,c,b,d,f[g+a+1],12,k[a+1]),d=h(d,q,c,b,f[g+a+2],17,k[a+2]),b=h(b,d,q,c,f[g+a+3],22,k[a+3])):32>a?(c=i(c,b,d,q,f[g+(a+1)%16],5,k[a]),q=i(q,c,b,d,f[g+(a+6)%16],9,k[a+1]),d=i(d,q,c,b,f[g+(a+11)%16],14,k[a+2]),b=i(b,d,q,c,f[g+a%16],20,k[a+3])):48>a?(c=
l(c,b,d,q,f[g+(3*a+5)%16],4,k[a]),q=l(q,c,b,d,f[g+(3*a+8)%16],11,k[a+1]),d=l(d,q,c,b,f[g+(3*a+11)%16],16,k[a+2]),b=l(b,d,q,c,f[g+(3*a+14)%16],23,k[a+3])):(c=r(c,b,d,q,f[g+3*a%16],6,k[a]),q=r(q,c,b,d,f[g+(3*a+7)%16],10,k[a+1]),d=r(d,q,c,b,f[g+(3*a+14)%16],15,k[a+2]),b=r(b,d,q,c,f[g+(3*a+5)%16],21,k[a+3]));e[0]=e[0]+c|0;e[1]=e[1]+b|0;e[2]=e[2]+d|0;e[3]=e[3]+q|0},_doFinalize:function(){var f=this._data,g=f.words,a=8*this._nDataBytes,e=8*f.sigBytes;g[e>>>5]|=128<<24-e%32;g[(e+64>>>9<<4)+14]=(a<<8|a>>>
24)&16711935|(a<<24|a>>>8)&4278255360;f.sigBytes=4*(g.length+1);this._process();f=this._hash.words;for(g=0;4>g;g++)a=f[g],f[g]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360}});o.MD5=m._createHelper(n);o.HmacMD5=m._createHmacHelper(n)})(Math);
(function(){var p=CryptoJS,h=p.lib,i=h.Base,l=h.WordArray,h=p.algo,r=h.EvpKDF=i.extend({cfg:i.extend({keySize:4,hasher:h.MD5,iterations:1}),init:function(i){this.cfg=this.cfg.extend(i)},compute:function(i,m){for(var h=this.cfg,n=h.hasher.create(),k=l.create(),f=k.words,g=h.keySize,h=h.iterations;f.length<g;){a&&n.update(a);var a=n.update(i).finalize(m);n.reset();for(var e=1;e<h;e++)a=n.finalize(a),n.reset();k.concat(a)}k.sigBytes=4*g;return k}});p.EvpKDF=function(i,l,h){return r.create(h).compute(i,
l)}})();
CryptoJS.lib.Cipher||function(p){var h=CryptoJS,i=h.lib,l=i.Base,r=i.WordArray,o=i.BufferedBlockAlgorithm,m=h.enc.Base64,s=h.algo.EvpKDF,n=i.Cipher=o.extend({cfg:l.extend(),createEncryptor:function(b,d){return this.create(this._ENC_XFORM_MODE,b,d)},createDecryptor:function(b,d){return this.create(this._DEC_XFORM_MODE,b,d)},init:function(b,d,a){this.cfg=this.cfg.extend(a);this._xformMode=b;this._key=d;this.reset()},reset:function(){o.reset.call(this);this._doReset()},process:function(b){this._append(b);return this._process()},
finalize:function(b){b&&this._append(b);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){return function(b){return{encrypt:function(a,q,j){return("string"==typeof q?c:e).encrypt(b,a,q,j)},decrypt:function(a,q,j){return("string"==typeof q?c:e).decrypt(b,a,q,j)}}}}()});i.StreamCipher=n.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var k=h.mode={},f=i.BlockCipherMode=l.extend({createEncryptor:function(b,a){return this.Encryptor.create(b,
a)},createDecryptor:function(b,a){return this.Decryptor.create(b,a)},init:function(b,a){this._cipher=b;this._iv=a}}),k=k.CBC=function(){function b(b,a,d){var c=this._iv;c?this._iv=p:c=this._prevBlock;for(var e=0;e<d;e++)b[a+e]^=c[e]}var a=f.extend();a.Encryptor=a.extend({processBlock:function(a,d){var c=this._cipher,e=c.blockSize;b.call(this,a,d,e);c.encryptBlock(a,d);this._prevBlock=a.slice(d,d+e)}});a.Decryptor=a.extend({processBlock:function(a,d){var c=this._cipher,e=c.blockSize,f=a.slice(d,d+
e);c.decryptBlock(a,d);b.call(this,a,d,e);this._prevBlock=f}});return a}(),g=(h.pad={}).Pkcs7={pad:function(b,a){for(var c=4*a,c=c-b.sigBytes%c,e=c<<24|c<<16|c<<8|c,f=[],g=0;g<c;g+=4)f.push(e);c=r.create(f,c);b.concat(c)},unpad:function(b){b.sigBytes-=b.words[b.sigBytes-1>>>2]&255}};i.BlockCipher=n.extend({cfg:n.cfg.extend({mode:k,padding:g}),reset:function(){n.reset.call(this);var b=this.cfg,a=b.iv,b=b.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=b.createEncryptor;else c=b.createDecryptor,
this._minBufferSize=1;this._mode=c.call(b,this,a&&a.words)},_doProcessBlock:function(b,a){this._mode.processBlock(b,a)},_doFinalize:function(){var b=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){b.pad(this._data,this.blockSize);var a=this._process(!0)}else a=this._process(!0),b.unpad(a);return a},blockSize:4});var a=i.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),k=(h.format={}).OpenSSL={stringify:function(a){var d=
a.ciphertext,a=a.salt,d=(a?r.create([1398893684,1701076831]).concat(a).concat(d):d).toString(m);return d=d.replace(/(.{64})/g,"$1\n")},parse:function(b){var b=m.parse(b),d=b.words;if(1398893684==d[0]&&1701076831==d[1]){var c=r.create(d.slice(2,4));d.splice(0,4);b.sigBytes-=16}return a.create({ciphertext:b,salt:c})}},e=i.SerializableCipher=l.extend({cfg:l.extend({format:k}),encrypt:function(b,d,c,e){var e=this.cfg.extend(e),f=b.createEncryptor(c,e),d=f.finalize(d),f=f.cfg;return a.create({ciphertext:d,
key:c,iv:f.iv,algorithm:b,mode:f.mode,padding:f.padding,blockSize:b.blockSize,formatter:e.format})},decrypt:function(a,c,e,f){f=this.cfg.extend(f);c=this._parse(c,f.format);return a.createDecryptor(e,f).finalize(c.ciphertext)},_parse:function(a,c){return"string"==typeof a?c.parse(a):a}}),h=(h.kdf={}).OpenSSL={compute:function(b,c,e,f){f||(f=r.random(8));b=s.create({keySize:c+e}).compute(b,f);e=r.create(b.words.slice(c),4*e);b.sigBytes=4*c;return a.create({key:b,iv:e,salt:f})}},c=i.PasswordBasedCipher=
e.extend({cfg:e.cfg.extend({kdf:h}),encrypt:function(a,c,f,j){j=this.cfg.extend(j);f=j.kdf.compute(f,a.keySize,a.ivSize);j.iv=f.iv;a=e.encrypt.call(this,a,c,f.key,j);a.mixIn(f);return a},decrypt:function(a,c,f,j){j=this.cfg.extend(j);c=this._parse(c,j.format);f=j.kdf.compute(f,a.keySize,a.ivSize,c.salt);j.iv=f.iv;return e.decrypt.call(this,a,c,f.key,j)}})}();
(function(){var p=CryptoJS,h=p.lib.BlockCipher,i=p.algo,l=[],r=[],o=[],m=[],s=[],n=[],k=[],f=[],g=[],a=[];(function(){for(var c=[],b=0;256>b;b++)c[b]=128>b?b<<1:b<<1^283;for(var d=0,e=0,b=0;256>b;b++){var j=e^e<<1^e<<2^e<<3^e<<4,j=j>>>8^j&255^99;l[d]=j;r[j]=d;var i=c[d],h=c[i],p=c[h],t=257*c[j]^16843008*j;o[d]=t<<24|t>>>8;m[d]=t<<16|t>>>16;s[d]=t<<8|t>>>24;n[d]=t;t=16843009*p^65537*h^257*i^16843008*d;k[j]=t<<24|t>>>8;f[j]=t<<16|t>>>16;g[j]=t<<8|t>>>24;a[j]=t;d?(d=i^c[c[c[p^i]]],e^=c[c[e]]):d=e=1}})();
var e=[0,1,2,4,8,16,32,64,128,27,54],i=i.AES=h.extend({_doReset:function(){for(var c=this._key,b=c.words,d=c.sigBytes/4,c=4*((this._nRounds=d+6)+1),i=this._keySchedule=[],j=0;j<c;j++)if(j<d)i[j]=b[j];else{var h=i[j-1];j%d?6<d&&4==j%d&&(h=l[h>>>24]<<24|l[h>>>16&255]<<16|l[h>>>8&255]<<8|l[h&255]):(h=h<<8|h>>>24,h=l[h>>>24]<<24|l[h>>>16&255]<<16|l[h>>>8&255]<<8|l[h&255],h^=e[j/d|0]<<24);i[j]=i[j-d]^h}b=this._invKeySchedule=[];for(d=0;d<c;d++)j=c-d,h=d%4?i[j]:i[j-4],b[d]=4>d||4>=j?h:k[l[h>>>24]]^f[l[h>>>
16&255]]^g[l[h>>>8&255]]^a[l[h&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,o,m,s,n,l)},decryptBlock:function(c,b){var d=c[b+1];c[b+1]=c[b+3];c[b+3]=d;this._doCryptBlock(c,b,this._invKeySchedule,k,f,g,a,r);d=c[b+1];c[b+1]=c[b+3];c[b+3]=d},_doCryptBlock:function(a,b,d,e,f,h,i,g){for(var l=this._nRounds,k=a[b]^d[0],m=a[b+1]^d[1],o=a[b+2]^d[2],n=a[b+3]^d[3],p=4,r=1;r<l;r++)var s=e[k>>>24]^f[m>>>16&255]^h[o>>>8&255]^i[n&255]^d[p++],u=e[m>>>24]^f[o>>>16&255]^h[n>>>8&255]^
i[k&255]^d[p++],v=e[o>>>24]^f[n>>>16&255]^h[k>>>8&255]^i[m&255]^d[p++],n=e[n>>>24]^f[k>>>16&255]^h[m>>>8&255]^i[o&255]^d[p++],k=s,m=u,o=v;s=(g[k>>>24]<<24|g[m>>>16&255]<<16|g[o>>>8&255]<<8|g[n&255])^d[p++];u=(g[m>>>24]<<24|g[o>>>16&255]<<16|g[n>>>8&255]<<8|g[k&255])^d[p++];v=(g[o>>>24]<<24|g[n>>>16&255]<<16|g[k>>>8&255]<<8|g[m&255])^d[p++];n=(g[n>>>24]<<24|g[k>>>16&255]<<16|g[m>>>8&255]<<8|g[o&255])^d[p++];a[b]=s;a[b+1]=u;a[b+2]=v;a[b+3]=n},keySize:8});p.AES=h._createHelper(i)})();

/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(g,i){var f={},b=f.lib={},m=b.Base=function(){function a(){}return{extend:function(e){a.prototype=this;var c=new a;e&&c.mixIn(e);c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),l=b.WordArray=m.extend({init:function(a,e){a=
this.words=a||[];this.sigBytes=e!=i?e:4*a.length},toString:function(a){return(a||d).stringify(this)},concat:function(a){var e=this.words,c=a.words,o=this.sigBytes,a=a.sigBytes;this.clamp();if(o%4)for(var b=0;b<a;b++)e[o+b>>>2]|=(c[b>>>2]>>>24-8*(b%4)&255)<<24-8*((o+b)%4);else if(65535<c.length)for(b=0;b<a;b+=4)e[o+b>>>2]=c[b>>>2];else e.push.apply(e,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,e=this.sigBytes;a[e>>>2]&=4294967295<<32-8*(e%4);a.length=g.ceil(e/4)},clone:function(){var a=
m.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var e=[],c=0;c<a;c+=4)e.push(4294967296*g.random()|0);return l.create(e,a)}}),n=f.enc={},d=n.Hex={stringify:function(a){for(var e=a.words,a=a.sigBytes,c=[],b=0;b<a;b++){var d=e[b>>>2]>>>24-8*(b%4)&255;c.push((d>>>4).toString(16));c.push((d&15).toString(16))}return c.join("")},parse:function(a){for(var e=a.length,c=[],b=0;b<e;b+=2)c[b>>>3]|=parseInt(a.substr(b,2),16)<<24-4*(b%8);return l.create(c,e/2)}},j=n.Latin1={stringify:function(a){for(var e=
a.words,a=a.sigBytes,b=[],d=0;d<a;d++)b.push(String.fromCharCode(e[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return l.create(c,b)}},k=n.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)))}},h=b.BufferedBlockAlgorithm=m.extend({reset:function(){this._data=l.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=k.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,d=b.sigBytes,j=this.blockSize,h=d/(4*j),h=a?g.ceil(h):g.max((h|0)-this._minBufferSize,0),a=h*j,d=g.min(4*a,d);if(a){for(var f=0;f<a;f+=j)this._doProcessBlock(c,f);f=c.splice(0,a);b.sigBytes-=d}return l.create(f,d)},clone:function(){var a=m.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});b.Hasher=h.extend({init:function(){this.reset()},
reset:function(){h.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=h.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,c){return a.create(c).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return u.HMAC.create(a,c).finalize(b)}}});var u=f.algo={};return f}(Math);
(function(){var g=CryptoJS,i=g.lib,f=i.WordArray,i=i.Hasher,b=[],m=g.algo.SHA1=i.extend({_doReset:function(){this._hash=f.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var d=this._hash.words,j=d[0],k=d[1],h=d[2],g=d[3],a=d[4],e=0;80>e;e++){if(16>e)b[e]=f[n+e]|0;else{var c=b[e-3]^b[e-8]^b[e-14]^b[e-16];b[e]=c<<1|c>>>31}c=(j<<5|j>>>27)+a+b[e];c=20>e?c+((k&h|~k&g)+1518500249):40>e?c+((k^h^g)+1859775393):60>e?c+((k&h|k&g|h&g)-1894007588):c+((k^h^g)-
899497514);a=g;g=h;h=k<<30|k>>>2;k=j;j=c}d[0]=d[0]+j|0;d[1]=d[1]+k|0;d[2]=d[2]+h|0;d[3]=d[3]+g|0;d[4]=d[4]+a|0},_doFinalize:function(){var b=this._data,f=b.words,d=8*this._nDataBytes,j=8*b.sigBytes;f[j>>>5]|=128<<24-j%32;f[(j+64>>>9<<4)+15]=d;b.sigBytes=4*f.length;this._process()}});g.SHA1=i._createHelper(m);g.HmacSHA1=i._createHmacHelper(m)})();
(function(){var g=CryptoJS,i=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(f,b){f=this._hasher=f.create();"string"==typeof b&&(b=i.parse(b));var g=f.blockSize,l=4*g;b.sigBytes>l&&(b=f.finalize(b));for(var n=this._oKey=b.clone(),d=this._iKey=b.clone(),j=n.words,k=d.words,h=0;h<g;h++)j[h]^=1549556828,k[h]^=909522486;n.sigBytes=d.sigBytes=l;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var b=
this._hasher,f=b.finalize(f);b.reset();return b.finalize(this._oKey.clone().concat(f))}})})();
(function(){var g=CryptoJS,i=g.lib,f=i.Base,b=i.WordArray,i=g.algo,m=i.HMAC,l=i.PBKDF2=f.extend({cfg:f.extend({keySize:4,hasher:i.SHA1,iterations:1}),init:function(b){this.cfg=this.cfg.extend(b)},compute:function(f,d){for(var g=this.cfg,k=m.create(g.hasher,f),h=b.create(),i=b.create([1]),a=h.words,e=i.words,c=g.keySize,g=g.iterations;a.length<c;){var l=k.update(d).finalize(i);k.reset();for(var q=l.words,t=q.length,r=l,s=1;s<g;s++){r=k.finalize(r);k.reset();for(var v=r.words,p=0;p<t;p++)q[p]^=v[p]}h.concat(l);
e[0]++}h.sigBytes=4*c;return h}});g.PBKDF2=function(b,d,f){return l.create(f).compute(b,d)}})();

//(function(){
	var AesUtil = function(keySize, iterationCount) {
	  this.keySize = keySize / 32;
	  this.iterationCount = iterationCount;
	};

	AesUtil.prototype.generateKey = function(salt, passPhrase) {
	  var key = CryptoJS.PBKDF2(
	      passPhrase, 
	      CryptoJS.enc.Hex.parse(salt),
	      { keySize: this.keySize, iterations: this.iterationCount });
	  return key;
	}

	AesUtil.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
	  var key = this.generateKey(salt, passPhrase);
	  var encrypted = CryptoJS.AES.encrypt(
	      plainText,
	      key,
	      { iv: CryptoJS.enc.Hex.parse(iv) });
	  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
	}

	AesUtil.prototype.decrypt = function(salt, iv, passPhrase, cipherText) {
	  var key = this.generateKey(salt, passPhrase);
	  var cipherParams = CryptoJS.lib.CipherParams.create({
	    ciphertext: CryptoJS.enc.Base64.parse(cipherText)
	  });
	  var decrypted = CryptoJS.AES.decrypt(
	      cipherParams,
	      key,
	      { iv: CryptoJS.enc.Hex.parse(iv) });
	  return decrypted.toString(CryptoJS.enc.Utf8);
	}
//})();