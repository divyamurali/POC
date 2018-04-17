var mainApp = angular.module("perficientHr",
        ['ngRoute', 'ngResource', 'ngAnimate', 'ngMessages',
         'mwl.calendar', 'ui.bootstrap', 'nya.bootstrap.select',
         'datatables', 'datatables.bootstrap', 'datatables.buttons', 'datatables.columnfilter', 'datatables.fixedcolumns',
         'ngSanitize', 'ui.select', 'ui.multiselect', 'chart.js']);

(function(window){
	mainApp.value('user', {
	    loggedUser:{},
	    role:{}
	});
	
	mainApp.config(function($routeProvider) {
	  var originalWhen = $routeProvider.when;
	  $routeProvider.when = function(path, route) {
         route.resolve || (route.resolve = {});
         angular.extend(route.resolve, {
            currentUser : function(profileAPIservice) {
            	return profileAPIservice.getProfileDetails();
            },
            roles: function(emprolesAPIservice){
            	return emprolesAPIservice.loadEmpRoles();
            }
         });
         return originalWhen.call($routeProvider, path, route);
	  };
		
	  $routeProvider
	    .when('/home', {
	        templateUrl: 'html/home.html',
	        controller: 'homeController'
	    })
	    .when('/dashboard', {
	        templateUrl: 'html/dashboard.html',
	        controller: 'dashboardController'
	    })
	    .when('/employees', {
	        templateUrl: 'html/employees.html',
	        controller: 'employeeController'
	    })
	    .when('/profile', {
	        templateUrl: 'html/profile.html',
	        controller: 'profileController'
	    })
	    .when('/pto', {
	        templateUrl: 'html/pto.html'
	    })
	    .when('/designations', {
	        templateUrl: 'html/designations.html',
	        controller: 'designationController'
	    })
	    .when('/projects', {
	        templateUrl: 'html/projects.html',
	        controller: 'projectController'
	    })
	    .when('/projectmembers', {
	        templateUrl: 'html/projectmembers.html',
	        controller: 'projectMembersController'
	    })
	    .when('/importpto', {
	        templateUrl: 'html/importpto.html',
	        controller: 'importPtoController'
	    })
	    .when('/wfh', {
	        templateUrl: 'html/wfh.html'
	    })
	    .when('/notifications', {
	        templateUrl: 'html/notifications.html',
	        controller: 'notificationController'
	    })
	    .when('/report/jobtitle', {
	        templateUrl: 'html/reports_jobtitle.html',
	        controller: 'reportsJobtitleController'
	    })
	    .when('/report/reports_pto', {
	        templateUrl: 'html/reports_pto.html',
	        controller: 'ptoReportController'
	    })
	    .when('/report/reports_wfh', {
	        templateUrl: 'html/reports_wfh.html',
	        controller: 'wfhReportController'
	    })
	    .when('/report/ebsreport', {
	        templateUrl: 'html/reports_ebs.html',
	        controller: 'ebsReportController'
	    })
	    .when('/roles', {
	        templateUrl: 'html/roles.html',
	        controller: 'rolesController'
	    })
	    .when('/emproles', {
	        templateUrl: 'html/emproles.html',
	        controller: 'empRolesController'
	    })
	    .when('/goals', {
	        templateUrl: 'html/empgoals.html',
	        controller: 'empGoalsController'
	    })
	    .when('/componentroles', {
	        templateUrl: 'html/componentroles.html',
	        controller: 'componentRolesController'
	    })
	    .when('/holidays', {
	        templateUrl: 'html/holidays.html',
	        controller: 'holidaysController'
	    })
	    .when('/ticket', {
	        templateUrl: 'html/ticketform.html',
	        controller: 'ticketController'
	    })
	    .when('/supportDashboard', {
	        templateUrl: 'html/ticketform.html',
	        controller: 'supportController'
	    })
	    .when('/report/reports_ticket', {
	        templateUrl: 'html/reports_tickets.html',
	        controller: 'ticketsReportController'
	    })
	    .when('/report/reports_office_entry', {
	        templateUrl: 'html/officeentry.html',
	        controller: 'officeEntryReportController'
	    })
	    .when('/page_403', {
	        templateUrl: 'html/page_403.html'
	    })
	    .when('/resetPass', {
	        templateUrl: 'html/forgotpass.html',
	        controller: 'resetPwdController'
	    })
	    .otherwise({
	        redirectTo: '/home'
	    });
	});
}(window));