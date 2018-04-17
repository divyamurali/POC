package com.goal.beans;

import java.util.List;

public class Section {
	private int sectionId;
	private String sectionName;
	private int sectionWeight;
	private String sectionDesc;
	private int sectionScore;
	private String sectionType;
	private List<Goal> goals;
	public int getSectionId() {
		return sectionId;
	}
	public void setSectionId(int sectionId) {
		this.sectionId = sectionId;
	}
	public String getSectionName() {
		return sectionName;
	}
	public void setSectionName(String sectionName) {
		this.sectionName = sectionName;
	}
	public int getSectionWeight() {
		return sectionWeight;
	}
	public void setSectionWeight(int sectionWeight) {
		this.sectionWeight = sectionWeight;
	}
	public String getSectionDesc() {
		return sectionDesc;
	}
	public void setSectionDesc(String sectionDesc) {
		this.sectionDesc = sectionDesc;
	}
	public int getSectionScore() {
		return sectionScore;
	}
	public void setSectionScore(int sectionScore) {
		this.sectionScore = sectionScore;
	}
	public String getSectionType() {
		return sectionType;
	}
	public void setSectionType(String sectionType) {
		this.sectionType = sectionType;
	}
	public List<Goal> getGoals() {
		return goals;
	}
	public void setGoals(List<Goal> goals) {
		this.goals = goals;
	}
	
	
	

}
