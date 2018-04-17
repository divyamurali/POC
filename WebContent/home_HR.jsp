<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" class="no-touch">

<!-- Mirrored from www.chennaiwfm.com/home by HTTrack Website Copier/3.x [XR&CO'2010], Thu, 10 Aug 2017 03:55:27 GMT -->
<!-- Added by HTTrack --><meta http-equiv="content-type" content="text/html;charset=ISO-8859-1" /><!-- /Added by HTTrack -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Perficient Chennai-WFM</title>
<!-- Vendors CSS -->
<link rel="shortcut icon" type="image/x-icon" href="images/p.png"/>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <link rel="stylesheet" href="css/vendors.min.css">
  <link rel="stylesheet" href="css/prft.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <link rel="stylesheet" href="css/jquery.dataTables.min.css">
  <script src="js/jquery-1.12.4.js"></script>
<script src="js/jquery.dataTables.min.js"></script>
  <style type="text/css">
	td.details-control {
		background: url('images/details_open.png') no-repeat center center;
		cursor: pointer;
	}
	tr.shown td.details-control {
		background: url('images/details_close.png') no-repeat center center;
	}
	
	
	/*******************************
* Does not work properly if "in" is added after "collapse".
* Get free snippets on bootpen.com
*******************************/
    .panel-group .panel {
        border-radius: 0;
        box-shadow: none;
        border-color: #EEEEEE;
    }

    .panel-default > .panel-heading {
        padding: 0;
        border-radius: 0;
        color: #212121;
        background-color: #FAFAFA;
        border-color: #EEEEEE;
    }

    .panel-title {
        font-size: 14px;
    }

    .panel-title > a {
        display: block;
        padding: 15px;
        text-decoration: none;
    }

    .more-less {
        float: left;
        color: #212121;
		padding-right: 5px;
    }

    .panel-default > .panel-heading + .panel-collapse > .panel-body {
        border-top-color: #EEEEEE;
    }

/* ----- v CAN BE DELETED v ----- */
body {
    background-color: #26a69a;
}

.demo {
    padding-top: 60px;
    padding-bottom: 60px;
}
/* .dataTables_filter, .dataTables_info, .dataTables_pagination { display: none; }  */
  </style>
</head>
<body ng-app="perficientHr" class="hold-transition skin-red sidebar-mini sidebar-collapse">
<div class="wrapper">
  <div ng-controller="headerController">
	  <header class="main-header">
	    <!-- Logo -->
	    <a href="javascript:void(0);" class="logo">
	      <!-- mini logo for sidebar mini 50x50 pixels -->
	      <span class="logo-mini"><img src="images/logo2-sm.png" alt="Perficient Logo sm"></span>
	      <!-- logo for regular state and mobile devices -->
	      <span class="logo-lg"><img src="images/logo2.png" alt="Perficient Logo"></span>
	    </a>
	    <!-- Header Navbar: style can be found in header.less -->
	    <nav class="navbar navbar-static-top">
	      <!-- Sidebar toggle button-->
	      <a href="javascript:void(0);" class="sidebar-toggle" data-toggle="offcanvas" role="button">
	        <span class="sr-only">Toggle navigation</span>
	      </a>
	      <div class="application-name">
	      	<ul class="nav navbar-nav">
	      		<li class="user">
	      			<a href="javascript:void(0);" class="dropdown-toggle cursor-default" data-toggle="dropdown">
	      				<span class="hidden-xs">Perficient - Work Force Management</span>
	      				<span class="visible-xs">Perficient - WFM</span>
	      			</a>
	      		</li>
	      	</ul>
	      </div>
	      <div class="navbar-custom-menu" id="navBarInfo" style="display:none;">
	        <ul class="nav navbar-nav">
	          <li class="dropdown notifications-menu" ng-if="notificationCount != 0">
	            <a href="javascript:void(0);" class="dropdown-toggle notification-count" data-toggle="dropdown">
	              <i class="fa fa-bell-o"></i>
	              <span class="label label-success">{{notificationCount}}</span>
	            </a>
	            <ul class="dropdown-menu">
	              <li class="header"><h4>You have {{notificationCount}} notifications</h4></li>
	              <li>
	                <!-- inner menu: contains the actual data -->
	                <ul class="menu">
	                	<li ng-repeat="notification in notifications">
		                    <a href="#/notifications">
		                      <i class="fa {{notification.icon}} {{notification.cls}}"></i> {{notification.count}} {{notification.type}} {{notification.msg}} 
		                    </a>
		                </li>
	                </ul>
	              </li>
	            </ul>
	          </li>
	          <!-- User Account: style can be found in dropdown.less -->
	          <li class="dropdown user user-menu">
	            <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">
	              <img src="images/user-icon.png" class="user-image" alt="User Image">
	              <span class="hidden-xs">{{user.lastName}}, {{user.firstName}}</span>
	            </a>
	            <ul class="dropdown-menu">
	              <!-- User image -->
	              <li class="user-header">
	                <img src="images/user-icon.png" class="img-circle" alt="User Image">
	                <p>
	                  {{user.lastName}}, {{user.firstName}}
	                  <small>{{user.designations.designation}}</small>
	                </p>
	              </li>
	              <!-- Menu Body -->
	              <!-- Menu Footer-->
	              <li class="user-footer">
	                <div class="pull-left">
	                  <a href="#/profile" class="btn btn-default btn-flat">Profile</a>
	                </div>
	                <div class="pull-right">
	                  <a href="javascript:void(0);" ng-click="logout()" id="logout" class="btn btn-default btn-flat">Log out</a>
	                </div>
	              </li>
	            </ul>
	          </li>
	          <!-- Control Sidebar Toggle Button -->
	          <li>
	            <a href="javascript:void(0);" ng-click="refreshPage()" ng-if="displayRefresh"><i class="fa fa-refresh fa-4"></i></a>
	          </li>
	        </ul>
	      </div>
	    </nav>
	  </header>
	  <!-- Left side column. contains the logo and sidebar -->
	  <aside class="main-sidebar">
	    <section class="sidebar">
	      <div ng-include src="%27html/menu.html"></div>
	      <div>
	      	<span id="version" style="color: #fff;"></span>
          </div>
	    </section>
	  </aside>
  </div>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper" style="min-height: 976px;">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <ol class="breadcrumb" id="breadcrumb">
        <li><a href="#/dashboard"><i class="fa fa-dashboard"></i> DashBoard</a></li>
      </ol>
    </section>
	
	<div class="container demo">

    
    <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

        <div class="panel panel-default">
            <div class="panel-heading" role="tab" id="headingOne">
                <h4 class="panel-title">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        <i class="more-less glyphicon glyphicon-plus"></i>
                        Current
                    </a>
                </h4>
            </div>
            <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                <div class="panel-body">
	  <table id="current" class="display" cellspacing="0" width="100%">
        <thead>
            <tr>
                <th>Year</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>2016 - 2017</td>
                <td>Approved</td>
                <td><a href="#">Edit</a></td>
            </tr>
        </tbody>
    </table>            </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading" role="tab" id="headingTwo">
                <h4 class="panel-title">
                    <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        <i class="more-less glyphicon glyphicon-plus"></i>
                        History
                    </a>
                </h4>
            </div>
            <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                <div class="panel-body">
	  <table id="history" class="display" cellspacing="0" width="100%">
        <thead>
            <tr>
                <th>Year</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>2016 - 2017</td>
                <td>Approved</td>
                <td><a href="#">View</a></td>
            </tr>
            <tr>
                <td>2015 - 2016</td>
                <td>Approved</td>
                <td><a href="#">View</a></td>
            </tr>
			<tr>
                <td>2014 - 2015</td>
                <td>Approved</td>
                <td><a href="#">View</a></td>
            </tr>
            <tr>
                <td>2013 - 2014</td>
                <td>Approved</td>
                <td><a href="#">View</a></td>
            </tr>
        </tbody>
    </table>                 </div>
            </div>
        </div>

    <div class="panel panel-default">
            <div class="panel-heading" role="tab" id="headingThree">
                <h4 class="panel-title">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                        <i class="more-less glyphicon glyphicon-plus"></i>
                        To Be Evaluated
                    </a>
                </h4>
            </div>
            <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                <div class="panel-body">
	  <table id="tobeapproved" class="display" cellspacing="0" width="100%">
        <thead>
            <tr>
                <th>Employee Name</th>
                <th>Status</th>
				<th>DOJ</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Manivel</td>
                <td>New</td>
				<td>12-SEP</td>
                <td><a href="#">Edit</a></td>
            </tr>
            <tr>
                <td>Thomas</td>
                <td>Resubmitted</td>
				<td>15-SEP</td>
                <td><a href="#">Edit</a></td>
            </tr>
			<tr>
                <<td>Giri</td>
                <td>Resubmitted</td>
				<td>16-SEP</td>
                <td><a href="#">Edit</a></td>
            </tr>
            <tr>
                <td>Swapna</td>
                <td>New</td>
				<td>19-SEP</td>
                <td><a href="#">Edit</a></td>
            </tr>
        </tbody>
    </table>            </div>
            </div>
        </div>
	<div class="panel panel-default">
            <div class="panel-heading" role="tab" id="headingFour">
                <h4 class="panel-title">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                        <i class="more-less glyphicon glyphicon-plus"></i>
                        History - All
                    </a>
                </h4>
            </div>
            <div id="collapseFour" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
                <div class="panel-body">
	  <table id="tobeevaluated" class="display" cellspacing="0" width="100%">
        <thead>
            <tr>
                <th>Employee Name</th>
                <th>Status</th>
				<th>Year</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Manivel</td>
                <td>New</td>
				<td>2016 - 2017</td>
                <td><a href="#">View</a></td>
            </tr>
            <tr>
                <td>Thomas</td>
                <td>Resubmitted</td>
				<td>2014 - 2015</td>
                <td><a href="#">View</a></td>
            </tr>
			<tr>
                <<td>Giri</td>
                <td>Resubmitted</td>
				<td>2016 - 2017</td>
                <td><a href="#">View</a></td>
            </tr>
            <tr>
                <td>Swapna</td>
                <td>2015 - 2016</td>
                <td><a href="#">View</a></td>
            </tr>
        </tbody>
    </table>            </div>
            </div>
        </div>

    </div><!-- panel-group -->
    
    
</div><!-- container -->
	
	
	

  </div>
</div>

<script>
$(document).ready(function(){    
   var table= $('#current').DataTable({
        paging:false,
		info:false,
        searching: false,
        
       
    });
    
    $('#search-inp').on('keyup',function(){
      table.search($(this).val()).draw() ;
});
    
});
</script>

<script>
$(document).ready(function() {
    $('table.display').DataTable();
} );

</script>

<script>
function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('glyphicon-plus glyphicon-minus');
}
$('.panel-group').on('hidden.bs.collapse', toggleIcon);
$('.panel-group').on('shown.bs.collapse', toggleIcon);
</script>
<script src="js/dev/common-lib.min.js"></script>
<script src="js/dev/lib.js"></script>
<script src="js/app/app.js"></script>
<script src="js/constants/constants.js"></script>
<script src="js/dev/prft.min.js"></script>
</body>

<!-- Mirrored from www.chennaiwfm.com/home by HTTrack Website Copier/3.x [XR&CO'2010], Thu, 10 Aug 2017 03:55:36 GMT -->
<!-- Added by HTTrack --><meta http-equiv="content-type" content="text/html;charset=ISO-8859-1" /><!-- /Added by HTTrack -->
</html>