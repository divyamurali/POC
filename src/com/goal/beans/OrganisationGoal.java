package com.goal.beans;

public class OrganisationGoal extends Goal{
	
	private int goalId;
	private String goalDesc;
	private int selfRating;
	private int mgrRating;
	private String comments;
	private int weightage;
	private String artifacts;
	
	
	public int getGoalId() {
		return goalId;
	}
	public void setGoalId(int goalId) {
		this.goalId = goalId;
	}
	public String getGoalDesc() {
		return goalDesc;
	}
	public void setGoalDesc(String goalDesc) {
		this.goalDesc = goalDesc;
	}
	public int getSelfRating() {
		return selfRating;
	}
	public void setSelfRating(int selfRating) {
		this.selfRating = selfRating;
	}
	public int getMgrRating() {
		return mgrRating;
	}
	public void setMgrRating(int mgrRating) {
		this.mgrRating = mgrRating;
	}
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	public int getWeightage() {
		return weightage;
	}
	public void setWeightage(int weightage) {
		this.weightage = weightage;
	}
	public String getArtifacts() {
		return artifacts;
	}
	public void setArtifacts(String artifacts) {
		this.artifacts = artifacts;
	}
	
	
	
}
