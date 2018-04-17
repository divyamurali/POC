<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" class="no-touch">

<meta http-equiv="content-type" content="text/html;charset=ISO-8859-1" />

<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Perficient Chennai-WFM</title>
<!-- Vendors CSS -->
<link rel="shortcut icon" type="image/x-icon" href="images/p.png" />
<!-- Tell the browser to be responsive to screen width -->
<meta
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
	name="viewport">
<link rel="stylesheet" href="css/vendors.min.css">
<link rel="stylesheet" href="css/prft.min.css">
<script
	src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<link rel="stylesheet" href="css/jquery.dataTables.min.css">
<link
	href="https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css"
	rel="stylesheet">
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
<script src="js/jquery-1.12.4.js"></script>
<script src="js/jquery.dataTables.min.js"></script>
<style type="text/css">
.faq-content #accordion .panel-title>a.accordion-toggle::before,
	.faq-content #accordion a[data-toggle="collapse"]::before {
	content: "-";
	float: left;
	font-family: 'Glyphicons Halflings';
	margin-right: 1em;
	margin-left: 10px;
	color: #fff;
	font-size: 13px;
	font-weight: 700;
	display: inline-block;
	width: 20px;
	height: 20px;
	line-height: 20px;
	border-radius: 50%;
	text-align: center;
	font-size: 10px;
	background: #ff9900;
}

.faq-content #accordion .panel-title>a.accordion-toggle.collapsed::before,
	.faq-content #accordion a.collapsed[data-toggle="collapse"]::before {
	content: "+";
	color: #fff;
	font-size: 10px;
	font-weight: 300;
	background: #333;
}

.faq-content {
	float: left;
	width: 100%;
}

.faq-content .panel-heading {
	padding-left: 0px;
	border-radius: 0px !important;
}

.faq-content .panel-heading a {
	text-decoration: none;
}

.faq-content .panel {
	border-radius: 0px !important;
}

.faq-content .panel-default {
	
}

.faq-content .panel-heading {
	background: #f3f3f3 !important;
	color: #666666;
}

.faq-content .panel-body {
	font-size: 14px;
	color: #666666;
}

.faq-saelect {
	background: #f3f3f3;
	padding: 15px;
	border-bottom: 2px solid #666666;
	float: left;
	width: 100%;
	margin-bottom: 20px;
	margin-top: -10px;
}

.faq-saelect span {
	font-size: 16px;
	color: #333;
	margin-right: 20px;
}

.faq-saelect select {
	border: 1px solid #dcdcdc;
	color: #999999;
	width: 300px;
	height: 40px;
}

.faq-content .panel {
	border-top: none !important;
	border-right: none !important;
	border-left: none !important;
}

.faq-content .panel-body {
	border: 1px solid #f3f3f3;
}

.template {
	display: none;
}

.nav-tabs {
	border-bottom: 2px solid #DDD;
}

.nav-tabs>li.active>a, .nav-tabs>li.active>a:focus, .nav-tabs>li.active>a:hover
	{
	border-width: 0;
}

.nav-tabs>li>a {
	border: none;
	color: #ffffff;
	background: #5a4080;
}

.nav-tabs>li.active>a, .nav-tabs>li>a:hover {
	border: none;
	color: #5a4080 !important;
	background: #fff;
}

.nav-tabs>li>a::after {
	content: "";
	background: #5a4080;
	height: 2px;
	position: absolute;
	width: 100%;
	left: 0px;
	bottom: -1px;
	transition: all 250ms ease 0s;
	transform: scale(0);
}

.nav-tabs>li.active>a::after, .nav-tabs>li:hover>a::after {
	transform: scale(1);
}

.tab-nav>li>a::after {
	background: ##5a4080 none repeat scroll 0% 0%;
	color: #fff;
}

.tab-pane {
	padding: 15px 0;
}

.tab-content {
	padding: 20px
}

.nav-tabs>li {
	width: 20%;
	text-align: center;
}

.card {
	background: #FFF none repeat scroll 0% 0%;
	box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
	margin-bottom: 30px;
}

@media all and (max-width:724px) {
	.nav-tabs>li>a>span {
		display: none;
	}
	.nav-tabs>li>a {
		padding: 5px 5px;
	}
}
</style>
</head>
<body ng-app="perficientHr"
	class="hold-transition skin-red sidebar-mini sidebar-collapse">
	<div class="wrapper">
		<div ng-controller="headerController">
			<header class="main-header">
				<!-- Logo -->
				<a href="javascript:void(0);" class="logo"> <!-- mini logo for sidebar mini 50x50 pixels -->
					<span class="logo-mini"><img src="images/logo2-sm.png"
						alt="Perficient Logo sm"></span> <!-- logo for regular state and mobile devices -->
					<span class="logo-lg"><img src="images/logo2.png"
						alt="Perficient Logo"></span>
				</a>
				<!-- Header Navbar: style can be found in header.less -->
				<nav class="navbar navbar-static-top">
					<!-- Sidebar toggle button-->
					<a href="javascript:void(0);" class="sidebar-toggle"
						data-toggle="offcanvas" role="button"> <span class="sr-only">Toggle
							navigation</span>
					</a>
					<div class="application-name">
						<ul class="nav navbar-nav">
							<li class="user"><a href="javascript:void(0);"
								class="dropdown-toggle cursor-default" data-toggle="dropdown">
									<span class="hidden-xs">Perficient - Work Force
										Management</span> <span class="visible-xs">Perficient - WFM</span>
							</a></li>
						</ul>
					</div>
					<div class="navbar-custom-menu" id="navBarInfo"
						style="display: none;">
						<ul class="nav navbar-nav">
							<li class="dropdown notifications-menu"
								ng-if="notificationCount != 0"><a
								href="javascript:void(0);"
								class="dropdown-toggle notification-count"
								data-toggle="dropdown"> <i class="fa fa-bell-o"></i> <span
									class="label label-success">{{notificationCount}}</span>
							</a>
								<ul class="dropdown-menu">
									<li class="header">
										<h4>You have {{notificationCount}} notifications</h4>
									</li>
									<li>
										<!-- inner menu: contains the actual data -->
										<ul class="menu">
											<li ng-repeat="notification in notifications"><a
												href="#/notifications"> <i
													class="fa {{notification.icon}} {{notification.cls}}"></i>
													{{notification.count}} {{notification.type}}
													{{notification.msg}}
											</a></li>
										</ul>
									</li>
								</ul></li>
							<!-- User Account: style can be found in dropdown.less -->
							<li class="dropdown user user-menu"><a
								href="javascript:void(0);" class="dropdown-toggle"
								data-toggle="dropdown"> <img src="images/user-icon.png"
									class="user-image" alt="User Image"> <span
									class="hidden-xs">{{user.lastName}}, {{user.firstName}}</span>
							</a>
								<ul class="dropdown-menu">
									<!-- User image -->
									<li class="user-header"><img src="images/user-icon.png"
										class="img-circle" alt="User Image">
										<p>
											{{user.lastName}}, {{user.firstName}} <small>{{user.designations.designation}}</small>
										</p></li>
									<!-- Menu Body -->
									<!-- Menu Footer-->
									<li class="user-footer">
										<div class="pull-left">
											<a href="#/profile" class="btn btn-default btn-flat">Profile</a>
										</div>
										<div class="pull-right">
											<a href="javascript:void(0);" ng-click="logout()" id="logout"
												class="btn btn-default btn-flat">Log out</a>
										</div>
									</li>
								</ul></li>
							<!-- Control Sidebar Toggle Button -->
							<li><a href="javascript:void(0);" ng-click="refreshPage()"
								ng-if="displayRefresh"><i class="fa fa-refresh fa-4"></i></a></li>
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
					<li><a href="#/dashboard"><i class="fa fa-dashboard"></i>
							DashBoard</a></li>
				</ol>
			</section>



			<div class="container-fluid">
				<div class="row">
					<div class="col-lg-12">
						<h1 class="page-header">Appraisal</h1>

						<ul id="myTab" class="nav nav-tabs">
							<li class="active"><a href="#home" data-toggle="tab"><i
									class="fa fa-users"></i>  <span>Project</span></a></li>
							<li><a href="#a" data-toggle="tab"><i class="fa fa-user"></i> 
									<span>Professional</span></a></li>
							<li><a href="#b" data-toggle="tab"><i
									class="fa fa-sitemap"></i>  <span>Organisation</span></a></li>
							<li><a href="#c" data-toggle="tab"><i class="fa fa-cog"></i> 
									<span>Utilization</span></a></li>
							<li><a href="#d" data-toggle="tab"><i
									class="fa fa-plus-square-o"></i>  <span>General</span></a></li>


						</ul>
						<form:form action="update.ds" method="POST" modelAttribute="App">
							<c:forEach var="section" items="${App.sections}"
								varStatus="sectStatus">

								<div id="myTabContent" class="tab-content">



									<div class="tab-pane fade in active" id="home">

										<div class="content_accordion">
											<div class="panel-group" id="ga">

												<div class="form-group pull-right">
													<button type="button"
														class="btn btn-success btn-sm btn-add-panel">
														<span class="glyphicon glyphicon-plus"></span><b> Add
															Goal</b>
													</button>
												</div>
												<div class="col-md-12"
													style="border-bottom: 1px solid #ccc; margin-bottom: 20px;"></div>
												<c:forEach var="goal" items="${section.goals}"
													varStatus="goalStatus">

													<c:if test="${goal.goalType=='PROJ'}">
														<div class="panel panel-default templateClone">
															<div class="panel-heading" role="tab">
																<h4 class="panel-title">
																	<a class="collapsed accordion-toggle"
																		data-toggle="collapse" data-parent="#home"
																		href="#home"> <span>Project Goal</span>
																	</a>
																</h4>

															</div>

															<div id="aa" class="panel-collapse collapse in">
																<div class="panel-body">
																	<div class="row">
																		<div class="col-md-6">
																			<div class="form-group">
																				<label for="category"> Goal</label>
																				<form:textarea
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].goalDesc"
																					class="form-control" placeholder="Content" rows="4"></form:textarea>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																			<form:input
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].weightage"
																					class="form-control" placeholder=""></form:input>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<form:input
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].artifacts"
																					class="form-control" placeholder="" type="text"></form:input>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Self Appraisal</label> <form:select
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].selfRating"
																					class="form-control" id="category">
																					<option value="1"
																						${goal.selfRating == '1' ? 'selected' : ''}>1</option>
																					<option value="2"
																						${goal.selfRating == '2' ? 'selected' : ''}>2</option>
																					<option value="3"
																						${goal.selfRating == '3' ? 'selected' : ''}>3</option>
																					<option value="4"
																						${goal.selfRating == '4' ? 'selected' : ''}>4</option>
																					<option value="5"
																						${goal.selfRating == '5' ? 'selected' : ''}>5</option>
																				</form:select>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Reviewer Appraisal</label> <form:select
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].mgrRating"
																					class="form-control" id="category">
																					<option value="1"
																						${goal.mgrRating == '1' ? 'selected' : ''}>1</option>
																					<option value="2"
																						${goal.mgrRating == '2' ? 'selected' : ''}>2</option>
																					<option value="3"
																						${goal.mgrRating == '3' ? 'selected' : ''}>3</option>
																					<option value="4"
																						${goal.mgrRating == '4' ? 'selected' : ''}>4</option>
																					<option value="5"
																						${goal.mgrRating == '5' ? 'selected' : ''}>5</option>
																				</form:select>
																			</div>
																		</div>
																	</div>
																	<div class="row">
																		<div class="col-md-12">
																			<div class="form-group">
																				<label for="tags"> Comments</label> <input
																					class="form-control" id="tags" placeholder="Tags"
																					type="text">
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</c:if>
												</c:forEach>
											</div>

										</div>

										<!--accordion end-->

									</div>
									<div class="tab-pane fade" id="a">
										<div class="content_accordion">
											<div class="panel-group" id="ga">

												<div class="form-group pull-right">
													<button type="button"
														class="btn btn-success btn-sm btn-add-panel">
														<span class="glyphicon glyphicon-plus"></span><b> Add
															Goal</b>
													</button>
												</div>
												<div class="col-md-12"
													style="border-bottom: 1px solid #ccc; margin-bottom: 20px;"></div>
												<c:forEach var="goal" items="${section.goals}"
													varStatus="goalStatus">

													<c:if test="${goal.goalType=='PROF'}">

														<div class="panel panel-default templateClone">
															<div class="panel-heading" role="tab">
																<h4 class="panel-title">
																	<a class="collapsed accordion-toggle"
																		data-toggle="collapse" data-parent="#ga" href="#aa">
																		<span>Professional Goal</span>
																	</a>
																</h4>

															</div>

															<div id="aa" class="panel-collapse collapse in">
																<div class="panel-body">
																	<div class="row">
																		<div class="col-md-6">
																			<div class="form-group">
																				<label for="category"> Goal</label>
																				<%-- <c:out value="${goal.goalDesc}"></c:out> --%>

																				<form:textarea
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].goalDesc"
																					class="form-control" placeholder="Content" rows="4"></form:textarea>
																			</div>
																		</div>

																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Weightage</label>
																				<form:input
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].weightage"
																					class="form-control" placeholder=""></form:input>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Artifacts</label>
																				<form:input
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].artifacts"
																					class="form-control" placeholder="" type="text"></form:input>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Self Appraisal</label>
																				<form:select
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].selfRating"
																					class="form-control" id="category">
																					<option value="1"
																						${goal.selfRating == '1' ? 'selected' : ''}>1</option>
																					<option value="2"
																						${goal.selfRating == '2' ? 'selected' : ''}>2</option>
																					<option value="3"
																						${goal.selfRating == '3' ? 'selected' : ''}>3</option>
																					<option value="4"
																						${goal.selfRating == '4' ? 'selected' : ''}>4</option>
																					<option value="5"
																						${goal.selfRating == '5' ? 'selected' : ''}>5</option>
																				</form:select>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Reviewer Appraisal</label> <form:select
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].mgrRating"
																					class="form-control" id="category">
																					<option value="1"
																						${goal.mgrRating == '1' ? 'selected' : ''}>1</option>
																					<option value="2"
																						${goal.mgrRating == '2' ? 'selected' : ''}>2</option>
																					<option value="3"
																						${goal.mgrRating == '3' ? 'selected' : ''}>3</option>
																					<option value="4"
																						${goal.mgrRating == '4' ? 'selected' : ''}>4</option>
																					<option value="5"
																						${goal.mgrRating == '5' ? 'selected' : ''}>5</option>
																				</form:select>
																			</div>
																		</div>
																	</div>
																	<div class="row">
																		<div class="col-md-12">
																			<div class="form-group">
																				<label for="tags"> Comments</label>
																				<form:input
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].comments"
																					class="form-control" placeholder="" type="text"></form:input>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</c:if>
												</c:forEach>
											</div>

										</div>
										<!--accordion end-->
									</div>
									<div class="tab-pane fade" id="b">
										<div class="content_accordion">
											<div class="panel-group" id="gb">
												<div class="form-group pull-right">
													<button type="button"
														class="btn btn-success btn-sm btn-add-panel">
														<span class="glyphicon glyphicon-plus"></span><b> Add
															Goal</b>
													</button>

												</div>
												<div class="col-md-12"
													style="border-bottom: 1px solid #ccc; margin-bottom: 20px;"></div>
												<c:forEach var="goal" items="${section.goals}"
													varStatus="goalStatus">

													<c:if test="${goal.goalType=='ORG'}">
														<div class="panel panel-default templateClone">
															<div class="panel-heading">
																<h4 class="panel-title">
																	<a data-toggle="collapse" data-parent="#gb" href="#ps">Organisation
																		Goal</a>
																</h4>
															</div>
															<div id="ps" class="panel-collapse collapse in">
																<div class="panel-body">
																	<div class="row">
																		<div class="col-md-6">
																			<div class="form-group">
																				<label for="category"> Goal</label>
																				<form:textarea
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].goalDesc"
																					class="form-control" placeholder="Content" rows="4"></form:textarea>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Weightage</label> <form:input
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].weightage"
																					class="form-control" placeholder=""></form:input>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Artifacts</label> <form:input
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].artifacts"
																					class="form-control" placeholder="" type="text"></form:input>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Self Appraisal</label><form:select
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].selfRating"
																					class="form-control" id="category">
																					<option value="1"
																						${goal.selfRating == '1' ? 'selected' : ''}>1</option>
																					<option value="2"
																						${goal.selfRating == '2' ? 'selected' : ''}>2</option>
																					<option value="3"
																						${goal.selfRating == '3' ? 'selected' : ''}>3</option>
																					<option value="4"
																						${goal.selfRating == '4' ? 'selected' : ''}>4</option>
																					<option value="5"
																						${goal.selfRating == '5' ? 'selected' : ''}>5</option>
																				</form:select>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Reviewer Appraisal</label> <form:select
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].mgrRating"
																					class="form-control" id="category">
																					<option value="1"
																						${goal.mgrRating == '1' ? 'selected' : ''}>1</option>
																					<option value="2"
																						${goal.mgrRating == '2' ? 'selected' : ''}>2</option>
																					<option value="3"
																						${goal.mgrRating == '3' ? 'selected' : ''}>3</option>
																					<option value="4"
																						${goal.mgrRating == '4' ? 'selected' : ''}>4</option>
																					<option value="5"
																						${goal.mgrRating == '5' ? 'selected' : ''}>5</option>
																				</form:select>
																			</div>
																		</div>
																	</div>
																	<div class="row">
																		<div class="col-md-12">
																			<div class="form-group">
																				<label for="tags"> Comments</label> <input
																					class="form-control" id="tags" placeholder="Tags"
																					type="text">
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</c:if>
												</c:forEach>
											</div>
										</div>

										<!--accordion end-->
									</div>
									<div class="tab-pane fade" id="c">
										<div class="content_accordion">
											<div class="panel-group" id="gc">
												<c:forEach var="goal" items="${section.goals}"
													varStatus="goalStatus">

													<c:if test="${goal.goalType=='UTIL'}">
														<div class="panel panel-default">
															<div class="panel-heading">
																<h4 class="panel-title">
																	<a data-toggle="collapse" data-parent="#gc" href="#pm">Utilization
																		Goal</a>
																</h4>
															</div>
															<div id="pm" class="panel-collapse collapse in">


																<div class="panel-body">
																	<p>
																		Evaluation Value will be derived from Project Goal
																		Worksheet . Every individual is expected to have 98 %
																		utilization in assigned project. </a>
																	</p>


																	<div class="row">
																		<div class="col-md-6">
																			<div class="form-group">
																				<label for="category"> Goal</label>
																				<form:textarea
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].goalDesc"
																					class="form-control" placeholder="Content" rows="4"></form:textarea>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Weightage</label> <form:input
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].weightage"
																					class="form-control" placeholder=""></form:input>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Artifacts</label><form:input
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].artifacts"
																					class="form-control" placeholder="" type="text"></form:input>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Self Appraisal</label> <form:select
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].selfRating"
																					class="form-control" id="category">
																					<option value="1"
																						${goal.selfRating == '1' ? 'selected' : ''}>1</option>
																					<option value="2"
																						${goal.selfRating == '2' ? 'selected' : ''}>2</option>
																					<option value="3"
																						${goal.selfRating == '3' ? 'selected' : ''}>3</option>
																					<option value="4"
																						${goal.selfRating == '4' ? 'selected' : ''}>4</option>
																					<option value="5"
																						${goal.selfRating == '5' ? 'selected' : ''}>5</option>
																				</form:select>
																			</div>
																		</div>
																		<div class="col-md-3">
																			<div class="form-group">
																				<label for="category"> Reviewer Appraisal</label> <form:select
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].mgrRating"
																					class="form-control" id="category">
																					<option value="1"
																						${goal.mgrRating == '1' ? 'selected' : ''}>1</option>
																					<option value="2"
																						${goal.mgrRating == '2' ? 'selected' : ''}>2</option>
																					<option value="3"
																						${goal.mgrRating == '3' ? 'selected' : ''}>3</option>
																					<option value="4"
																						${goal.mgrRating == '4' ? 'selected' : ''}>4</option>
																					<option value="5"
																						${goal.mgrRating == '5' ? 'selected' : ''}>5</option>
																				</form:select>
																			</div>
																		</div>
																	</div>
																	<div class="row">
																		<div class="col-md-12">
																			<div class="form-group">
																				<label for="tags"> Comments</label> <input
																					class="form-control" id="tags" placeholder="Tags"
																					type="text">
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</c:if>
												</c:forEach>
											</div>
										</div>

										<!--accordion end-->
									</div>

								</div>
							</c:forEach>
							<div class="tab-pane fade" id="d">
								<div class="content_accordion">
									<div class="panel-group" id="gd">
										<c:forEach var="goal" items="${section.goals}"
											varStatus="goalStatus">

											<c:if test="${goal.goalType=='GEN'}">
												<div class="panel panel-default">
													<div class="panel-heading">
														<h4 class="panel-title">
															<a data-toggle="collapse" data-parent="#gd" href="#ps">General
																Goal</a>
														</h4>
													</div>
													<div id="phy" class="panel-collapse collapse in">


														<div class="panel-body">
															<p>Adhere to all policies and procedures as defined
																by the Organization, including but not limited to
																completing work logs by the given deadline each week,
																updating your resume every 90 days in resume repository,
																following Dress Code and submitting PMO report,
																Timesheet, PTO and WFH notification in a timely manner
																to all required recipients.</p>

															<div class="row">
																<div class="col-md-6">
																	<form data-toggle="validator" role="form">
																		<div class="form-group">
																			<label for="category"> Goal</label>
																			<form:textarea
																				path="sections[${sectStatus.index}].goals[${goalStatus.index}].goalDesc"
																				class="form-control" placeholder="Content" rows="4"></form:textarea>
																		</div>
																</div>
																<div class="col-md-3">
																	<div class="form-group">
																		<label for="category"> Weightage</label> <form:input
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].weightage"
																					class="form-control" placeholder=""></form:input>
																	</div>
																</div>
																<div class="col-md-3">
																	<div class="form-group">
																		<label for="category"> Artifacts</label><form:input
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].artifacts"
																					class="form-control" placeholder="" type="text"></form:input>
																	</div>
																</div>
																<div class="col-md-3">
																	<div class="form-group">
																		<label for="category"> Self Appraisal</label> <form:select
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].selfRating"
																					class="form-control" id="category">
																			<option value="1"
																				${goal.selfRating == '1' ? 'selected' : ''}>1</option>
																			<option value="2"
																				${goal.selfRating == '2' ? 'selected' : ''}>2</option>
																			<option value="3"
																				${goal.selfRating == '3' ? 'selected' : ''}>3</option>
																			<option value="4"
																				${goal.selfRating == '4' ? 'selected' : ''}>4</option>
																			<option value="5"
																				${goal.selfRating == '5' ? 'selected' : ''}>5</option>
																		</form:select>
																	</div>
																</div>
																<div class="col-md-3">
																	<div class="form-group">
																		<label for="category"> Reviewer Appraisal</label> <form:select
																					path="sections[${sectStatus.index}].goals[${goalStatus.index}].mgrRating"
																					class="form-control" id="category">
																			<option value="1"
																				${goal.mgrRating == '1' ? 'selected' : ''}>1</option>
																			<option value="2"
																				${goal.mgrRating == '2' ? 'selected' : ''}>2</option>
																			<option value="3"
																				${goal.mgrRating == '3' ? 'selected' : ''}>3</option>
																			<option value="4"
																				${goal.mgrRating == '4' ? 'selected' : ''}>4</option>
																			<option value="5"
																				${goal.mgrRating == '5' ? 'selected' : ''}>5</option>
																		</form:select>
																	</div>
																</div>
															</div>
															<div class="row">
																<div class="col-md-12">
																	<div class="form-group">
																		<label for="tags"> Comments</label> <input
																			class="form-control" id="tags" placeholder="Tags"
																			type="text">
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</c:if>
										</c:forEach>
									</div>
								</div>

								<!--accordion end-->
							</div>
							<div class="form-group pull-right">
								<input type="submit" class="btn btn btn-warning" value="save">
								<!-- <span class="glyphicon glyphicon-floppy-disk"></span> Save
											</input> -->
								<input type="button" class="btn btn-danger" value="cancel">
								<!-- <span class="glyphicon glyphicon glyphicon-remove"></span>
												Cancel
											</input> -->
								<input type="submit" class="btn btn-primary" value="submit">
								<!-- <span class="glyphicon glyphicon glyphicon-ok"></span>
												Submit
											</input -->
							</div>

						</form:form>
					</div>

				</div>
				<!-- /.row -->

			</div>
			<!-- /.container-fluid -->


			<script>
				$(".btn-add-panel").on(
						"click",
						function() {
							var template = $(this).parent().parent().find(
									'.templateClone');

							var newPanel = $(template).clone();
							var templateHTML = $(newPanel).html();
							$(this).parent().parent()
									.append($(newPanel).html());
						});

				$(document).on('click', '.glyphicon-remove-circle', function() {
					$(this).parents('.panel').get(0).remove();
				});
			</script>

			<script>
				function toggleIcon(e) {
					$(e.target).prev('.panel-heading').find(".more-less")
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


<meta http-equiv="content-type" content="text/html;charset=ISO-8859-1" />

</html>