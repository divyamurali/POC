package com.goal.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import com.goal.beans.Yrecord;
import com.goal.beans.Zrecord;

public class ReviewerDAO {
	private DataSource dataSource;
	private JdbcTemplate jdbcTemplateObject;
	
	public void setDataSource(DataSource dataSource) {
	      this.dataSource = dataSource;
	      this.jdbcTemplateObject = new JdbcTemplate(dataSource);
	}
	
	
	int eid=12345;
	public Yrecord getCurrentDetails(){
		int eid=12345;
		String SQL = "select * from goal_sheet where EMP_ID=? and active='Y'";
		Yrecord record = (Yrecord)jdbcTemplateObject.queryForObject(SQL, 
		         new Object[]{eid},new RowMapper()
        {

           @Override
            public Yrecord mapRow(ResultSet rs, int rowNum) throws SQLException
            {
                Yrecord rec=new Yrecord();
                char active=rs.getString("active").charAt(0);
                if(active==('Y')){
                rec.setStatus(rs.getString("status"));
                rec.setYear(rs.getString("goal_period"));
                rec.setGoalYearId(rs.getInt("emp_goal_year_id"));
               }
                return rec;
            }
        });

		return record;
	}
	
	public List<Yrecord> getHistoryDetails(){
		
		String SQL = "select * from goal_sheet where EMP_ID=? and active='N'";
		List<Yrecord> recs = jdbcTemplateObject.query(SQL,new Object[]{eid},new RowMapper()
        {

           @Override
            public Yrecord mapRow(ResultSet rs, int rowNum) throws SQLException
            {
                Yrecord rec=new Yrecord();
                char active=rs.getString("active").charAt(0);
                
                rec.setStatus(rs.getString("status"));
                rec.setYear(rs.getString("goal_period"));
                rec.setGoalYearId(rs.getInt("emp_goal_year_id"));
              
                return rec;
            }
        });

			
		return recs;
	}
	
		public List<Zrecord> getApproved(){
			String SQL = "select goal_sheet.STATUS, goal_sheet.EMP_GOAL_YEAR_ID, employee_master.JOINING_DATE, employee_master.EMP_NAME from goal_sheet inner join employee_master on goal_sheet.EMP_ID = employee_master.EMP_ID where STATUS ='pending'";




			List<Zrecord> recs = jdbcTemplateObject.query(SQL,new RowMapper()
			{

				@Override
				public Zrecord mapRow(ResultSet rs, int rowNum)
						throws SQLException {
					Zrecord zrec=new Zrecord();
					 char active=rs.getString("emp_goal_year_id").charAt(0);
					 
					 zrec.setEmployeeName(rs.getString("emp_name"));
		             zrec.setStatus(rs.getString("status"));
		             zrec.setDOJ(rs.getString("joining_date"));
		             zrec.setGoalYearid(rs.getInt("emp_goal_year_id"));
		                	
					return zrec;
				}
				
			});
			return recs;
			

		}
		
		public List<Zrecord> getEvaluated(){
			String SQL = "select goal_sheet.STATUS, goal_sheet.EMP_GOAL_YEAR_ID, employee_master.JOINING_DATE, employee_master.EMP_NAME from goal_sheet inner join employee_master on goal_sheet.EMP_ID = employee_master.EMP_ID where STATUS ='Evaluated'";

			List<Zrecord> recs = jdbcTemplateObject.query(SQL,new RowMapper()
			{
				@Override
				public Zrecord mapRow(ResultSet rs, int rowNum)
						throws SQLException {
					Zrecord zrec=new Zrecord();
					 char active=rs.getString("emp_goal_year_id").charAt(0);
					 
					 zrec.setEmployeeName(rs.getString("emp_name"));
		             zrec.setStatus(rs.getString("status"));
		             zrec.setDOJ(rs.getString("joining_date"));
		             zrec.setGoalYearid(rs.getInt("emp_goal_year_id"));
		                	
					return zrec;
				}
			});
			return recs;

		}
}
	
	


