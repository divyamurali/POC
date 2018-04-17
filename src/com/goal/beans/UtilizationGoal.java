package com.goal.beans;

public class UtilizationGoal extends Goal{
	
	private int goalId;
	private int utilization;
    private int utilizationScore;
	
	
	public int getGoalId() {
		return goalId;
	}
	public void setGoalId(int goalId) {
		this.goalId = goalId;
	}
	public int getUtilization() {
		return utilization;
	}
	public void setUtilization(int utilization) {
		this.utilization = utilization;
	}
	public int getUtilizationScore() {
		return utilizationScore;
	}
	public void setUtilizationScore(int utilizationScore) {
		this.utilizationScore = utilizationScore;
	}
	

}
