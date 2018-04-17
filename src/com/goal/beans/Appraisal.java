package com.goal.beans;

import java.util.List;

public class Appraisal {
	int goalYearId;
	private List<Section> sections;

	
	public int getGoalYearId() {
		return goalYearId;
	}
	public void setGoalYearId(int goalYearId) {
		this.goalYearId = goalYearId;
	}
	public List<Section> getSections() {
		return sections;
	}
	public void setSections(List<Section> sections) {
		this.sections = sections;
	}
	
	
}
