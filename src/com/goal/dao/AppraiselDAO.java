package com.goal.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import com.goal.beans.Appraisal;
import com.goal.beans.GeneralGoal;
import com.goal.beans.Goal;
import com.goal.beans.IndividualProjectGoal;
import com.goal.beans.InfluencerProjectGoal;
import com.goal.beans.OrganisationGoal;
import com.goal.beans.Section;
import com.goal.beans.UtilizationGoal;

public class AppraiselDAO {
	final String IND="IND";
	final String INF="INF";
	final String PROF="PROF";
	final String ORG="ORG";
	final String UTIL="UTIL";
	final String GEN="GEN";
	
	private DataSource dataSource;
	private JdbcTemplate jdbcTemplateObject;

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
		this.jdbcTemplateObject = new JdbcTemplate(dataSource);
	}

	public Appraisal getGoals(int gid) {

		OrganisationGoal orgGoal = new OrganisationGoal();
		IndividualProjectGoal indProjGoal = new IndividualProjectGoal();
		InfluencerProjectGoal infProjGoal = new InfluencerProjectGoal();
		UtilizationGoal utilGoal = new UtilizationGoal();
		GeneralGoal genGoal = new GeneralGoal();
		
		Appraisal appraisal = new Appraisal();
		
		List<Section> sections = new ArrayList<Section>();

		String SQL1 = "select sect_id,sect_name from section_master where EMP_GOAL_YEAR_ID=?";
		String SQL2 = "select GOAL_ID,Goal_type from sect_goal_rel where sect_id=?";
		String SQL3 = null;

		List<Section> sectionTypes = new ArrayList<Section>();
		sectionTypes = jdbcTemplateObject.query(SQL1, new Object[] { gid }, new RowMapper<Section>() {
			public Section mapRow(ResultSet rs, int rowNum) throws SQLException {
				Section section = new Section();
				section.setSectionId(rs.getInt("sect_id"));
				section.setSectionName(rs.getString("sect_name"));
				return section;
			}
		});

		for (int j = 0; j < sectionTypes.size(); j++) {
			String sectionName = sectionTypes.get(j).getSectionName();
			int sectId = sectionTypes.get(j).getSectionId();
			List<Goal> goals = new ArrayList<Goal>();
			Section sect = new Section();
			List<Goal> goalTypes = new ArrayList<Goal>();
			goalTypes = jdbcTemplateObject.query(SQL2, new Object[] { sectId }, new RowMapper<Goal>() {
				public Goal mapRow(ResultSet rs, int rowNum) throws SQLException {
					Goal goal = new Goal();
					goal.setGoalId(rs.getInt("goal_id"));
					goal.setGoalType(rs.getString("goal_type"));
					return goal;
				}
			});

			for (int i = 0; i < goalTypes.size(); i++) {
				String type = goalTypes.get(i).getGoalType();
				int goalId = goalTypes.get(i).getGoalId();
				if (type.equals(IND)) {
					SQL3 = "select * from IND_PROJ_GOAL_MASTER where goal_id=?";
					indProjGoal = (IndividualProjectGoal) jdbcTemplateObject.queryForObject(SQL3,
							new Object[] { goalId }, new RowMapper() {
								@Override
								public IndividualProjectGoal mapRow(ResultSet rs, int rowNum) throws SQLException {
									IndividualProjectGoal indProjGoal = new IndividualProjectGoal();
									indProjGoal.setGoalId(goalId);
									indProjGoal.setGoalType(type);
									indProjGoal.setGoalDesc(rs.getString("goal_desc"));
									/*indProjGoal.setSelfRating(rs.getInt("self_rating"));
									indProjGoal.setMgrRating(rs.getInt("mgr_rating"));
									indProjGoal.setWeightage(rs.getInt("weightage"));
									indProjGoal.setArtifacts(rs.getString("artifacts"));*/
									indProjGoal.setComments(rs.getString("self_comments"));
									goals.add(indProjGoal);
									return indProjGoal;
								}
							});

				}
				if (type.equals(INF)) {
					SQL3 = "select * from INF_PROJ_GOAL_MASTER where goal_id=?";
					infProjGoal = (InfluencerProjectGoal) jdbcTemplateObject.queryForObject(SQL3,
							new Object[] { goalId }, new RowMapper() {
								@Override
								public InfluencerProjectGoal mapRow(ResultSet rs, int rowNum) throws SQLException {
									InfluencerProjectGoal infProjGoal = new InfluencerProjectGoal();
									infProjGoal.setGoalId(goalId);
									infProjGoal.setGoalType(type);
									infProjGoal.setGoalDesc(rs.getString("goal_desc"));
									infProjGoal.setSelfRating(rs.getInt("self_rating"));
									infProjGoal.setMgrRating(rs.getInt("mgr_rating"));
									infProjGoal.setWeightage(rs.getInt("weightage"));
									infProjGoal.setArtifacts(rs.getString("artifacts"));
									infProjGoal.setComments(rs.getString("self_comments"));
									goals.add(infProjGoal);
									return infProjGoal;
								}
							});

				}
				if (type.equals(PROF)) {
					SQL3 = "select * from org_prof_goal_master where goal_id=?";
					orgGoal = (OrganisationGoal) jdbcTemplateObject.queryForObject(SQL3, new Object[] { goalId },
							new RowMapper() {
								@Override
								public OrganisationGoal mapRow(ResultSet rs, int rowNum) throws SQLException {
									OrganisationGoal orgGoal = new OrganisationGoal();
									orgGoal.setGoalId(goalId);
									orgGoal.setGoalType(type);
									orgGoal.setGoalDesc(rs.getString("goal_desc"));
									orgGoal.setSelfRating(rs.getInt("self_rating"));
									orgGoal.setMgrRating(rs.getInt("mgr_rating"));
									orgGoal.setWeightage(rs.getInt("weightage"));
									orgGoal.setArtifacts(rs.getString("artifacts"));
									orgGoal.setComments(rs.getString("self_comments"));
									goals.add(orgGoal);
									return orgGoal;
								}
							});

				}
				
				  if (type.equals(ORG)){ SQL3=
				  "select * from org_prof_goal_master where goal_id=?";
				  orgGoal = (OrganisationGoal) jdbcTemplateObject.queryForObject(SQL3, new Object[] { goalId },
							new RowMapper() {
								@Override
								public OrganisationGoal mapRow(ResultSet rs, int rowNum) throws SQLException {
									OrganisationGoal orgGoal = new OrganisationGoal();
									orgGoal.setGoalId(goalId);
									orgGoal.setGoalType(type);
									orgGoal.setGoalDesc(rs.getString("goal_desc"));
									orgGoal.setSelfRating(rs.getInt("self_rating"));
									orgGoal.setMgrRating(rs.getInt("mgr_rating"));
									orgGoal.setWeightage(rs.getInt("weightage"));
									orgGoal.setArtifacts(rs.getString("artifacts"));
									orgGoal.setComments(rs.getString("self_comments"));
									goals.add(orgGoal);
									return orgGoal;
								}
				 });
				 
				  }
				 
				if (type.equals(UTIL)) {
					SQL3 = "select * from UTILIZATION_GOAL_MASTER where goal_id=?";
					utilGoal = (UtilizationGoal) jdbcTemplateObject.queryForObject(SQL3,new Object[] { goalId }, new RowMapper() {
						@Override
						public UtilizationGoal mapRow(ResultSet rs, int rowNum) throws SQLException {
							UtilizationGoal utilGoal = new UtilizationGoal();
							utilGoal.setGoalId(goalId);
							utilGoal.setGoalType(type);
							/*utilGoal.setGoalDesc(rs.getString("goal_desc"));
							utilGoal.setSelfRating(rs.getInt("self_rating"));
							utilGoal.setMgrRating(rs.getInt("mgr_rating"));
							utilGoal.setWeightage(rs.getInt("weightage"));
							utilGoal.setArtifacts(rs.getString("artifacts"));
							utilGoal.setComments(rs.getString("self_comments"));*/
							goals.add(utilGoal);
							return utilGoal;
						}
					});

				}
				if (type.equals(GEN)) {
					SQL3 = "select * from GENERAL_GOAL_MASTER where goal_id=?";
					genGoal = (GeneralGoal) jdbcTemplateObject.queryForObject(SQL3, new Object[] { goalId },
							new RowMapper() {
								@Override
								public GeneralGoal mapRow(ResultSet rs, int rowNum) throws SQLException {
									GeneralGoal genGoal = new GeneralGoal();
									genGoal.setGoalId(goalId);
									genGoal.setGoalType(type);
									genGoal.setEbsRemainderScore(rs.getInt("EBS_REMAINDER_SCORE"));
									genGoal.setOrgPolicyAdherenceScore(rs.getInt("ORG_POLICY_ADHERENCE_SCORE"));
									genGoal.setEbsWFMMismatchScore(rs.getInt("EBS_WFM_MISMATCH_SCORE"));
									genGoal.setResumeUpdateScore(rs.getInt("RESUME_UPDATE_SCORE"));
									goals.add(genGoal);
									return genGoal;
								}
							});

				}
				sect.setSectionId(sectId);
				sect.setSectionName(sectionName);
				sect.setGoals(goals);
			}
			
			sections.add(sect);
		}
		appraisal.setGoalYearId(gid);
		appraisal.setSections(sections);
		return appraisal;
	}

	public void updateGoals(Appraisal app) {
		System.out.println("success");		
		String sql=null;
		int gid=app.getGoalYearId();
		List<Section> sections = app.getSections();
		for(int i=0;i<sections.size();i++){			
			List<Goal> goals =sections.get(i).getGoals();
			for(int j=0;j<goals.size();j++){
				String type = goals.get(j).getGoalType();
				int goalId = goals.get(j).getGoalId();
				if (type.equals(IND)) {
					IndividualProjectGoal indGoal =(IndividualProjectGoal)goals.get(j);
					sql = "update ind_proj_goal_master set GOAL_DESC=?, weightage=?,SELF_RATING=?,MGR_RATING=?,SELF_COMMENTS=? ,artifacts=? where GOAL_ID=?";
					/*jdbcTemplateObject.update(sql,indGoal.getGoalDesc(),indGoal.getWeightage(),indGoal.getSelfRating(),indGoal.getMgrRating(),indGoal.getComments(),indGoal.getArtifacts(),goalId);*/

				}
				if (type.equals(INF)) {
					InfluencerProjectGoal infGoal =(InfluencerProjectGoal)goals.get(j);
					sql = "update inf_proj_goal_master set GOAL_DESC=?, weightage=?,SELF_RATING=?,MGR_RATING=?,SELF_COMMENTS=? ,artifacts=? where GOAL_ID=?";
					jdbcTemplateObject.update(sql,infGoal.getGoalDesc(),infGoal.getWeightage(),infGoal.getSelfRating(),infGoal.getMgrRating(),infGoal.getComments(),infGoal.getArtifacts(),goalId);
				}
				if (type.equals(PROF)) {
					 OrganisationGoal orgGoal =(OrganisationGoal)goals.get(j);
					sql = "update org_prof_goal_master set GOAL_DESC=?, weightage=?,SELF_RATING=?,MGR_RATING=?,SELF_COMMENTS=? ,artifacts=? where GOAL_ID=?";
					jdbcTemplateObject.update(sql,orgGoal.getGoalDesc(),orgGoal.getWeightage(),orgGoal.getSelfRating(),orgGoal.getMgrRating(),orgGoal.getComments(),orgGoal.getArtifacts(),goalId);

				}
		        if (type.equals(ORG)){ 
		        	 OrganisationGoal orgGoal =(OrganisationGoal)goals.get(j);
						sql = "update org_prof_goal_master set GOAL_DESC=?, weightage=?,SELF_RATING=?,MGR_RATING=?,SELF_COMMENTS=? ,artifacts=? where GOAL_ID=?";
						jdbcTemplateObject.update(sql,orgGoal.getGoalDesc(),orgGoal.getWeightage(),orgGoal.getSelfRating(),orgGoal.getMgrRating(),orgGoal.getComments(),orgGoal.getArtifacts(),goalId);
				  }
				if (type.equals(UTIL)) {
					UtilizationGoal utilGoal =(UtilizationGoal)goals.get(j);
					sql = "update utilization_goal_master set GOAL_DESC=?, weightage=?,SELF_RATING=?,MGR_RATING=?,SELF_COMMENTS=? ,artifacts=? where GOAL_ID=?";
					/*jdbcTemplateObject.update(sql,utilGoal.getGoalDesc(),utilGoal.getWeightage(),utilGoal.getSelfRating(),utilGoal.getMgrRating(),utilGoal.getComments(),utilGoal.getArtifacts(),goalId);*/
				}
				if (type.equals(GEN)) {
					GeneralGoal genGoal =(GeneralGoal)goals.get(j);
					sql = "update general_goal_master set EBS_REMAINDER_SCORE=?, EBS_WFM_MISMATCH_SCORE=?,ORG_POLICY_ADHERENCE_SCORE=?,RESUME_UPDATE_SCORE=? where GOAL_ID=?";
					jdbcTemplateObject.update(sql,genGoal.getEbsRemainderScore(),genGoal.getEbsWFMMismatchScore(),genGoal.getOrgPolicyAdherenceScore(),genGoal.getResumeUpdateScore(),goalId);
					}
			}
			}
		}

	}

