package com.goal.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.goal.beans.*;
import com.goal.dao.*;
@Controller
@SessionAttributes("App")
public class MainController{
	@Autowired
	private GoalDAO goaldao;
	@Autowired
	private AppraiselDAO appdao;
	@Autowired
	private ReviewerDAO revdao;

	@RequestMapping(value="/home.ds",method = RequestMethod.GET)
	public String home1(ModelMap model){
		Yrecord rec=goaldao.getCurrentDetails();
		List<Yrecord> recs=goaldao.getHistoryDetails();
		model.addAttribute("recs",recs);
		model.addAttribute("yrec", rec);
		
		return "home1.jsp";
	}
	
	@RequestMapping(value="/Appraisal.ds")
	public String home1(ModelMap model,@RequestParam("value") int gid){
		Appraisal appr=appdao.getGoals(gid);
		model.addAttribute("App", appr);
		return "Appraisal.jsp";
	}
	
	
	@RequestMapping(value = "/update.ds", method = RequestMethod.POST)
	public String updateGoal(@ModelAttribute("App") Appraisal app,ModelMap model ){
		appdao.updateGoals(app);
		int gid=app.getGoalYearId();
		Appraisal appr=appdao.getGoals(gid);
		model.addAttribute("App", appr);
		return "Appraisal.jsp";
		
		
	}
	
	@RequestMapping(value = "/reviewer.ds", method = RequestMethod.GET)
	public String review(ModelMap model)
	{
		
		Yrecord rec=revdao.getCurrentDetails();
		List<Yrecord> recs=revdao.getHistoryDetails();
		List<Zrecord> zrec=revdao.getApproved();
		List zreco=revdao.getEvaluated();
		model.addAttribute("recs",recs);
		model.addAttribute("yrec", rec);
		model.addAttribute("zrecs",zrec);
		model.addAttribute("zrecss",zreco);
		return "home_reviewer.jsp";
		
	}
	}
	
	

