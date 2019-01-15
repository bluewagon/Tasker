class DailyTasksController < ApplicationController
  before_filter :authenticate_user!

  def new
    @daily_task = DailyTask.new
  end

  def create
    @task = Task.find(params[:task_id])
    @daily_task = @task.daily_tasks.build(task_date: params[:task_date])

    respond_to do |format|
      if @task.save
        format.html do
          flash[:success] = "successfully completed task"
          redirect_to root_path
        end
        format.json { render json: { destroy_url: remove_task_daily_task_path(@task, @daily_task)} }
      else
        format.html { render 'new' }
        format.json { render json: { error: "error" } }
      end
    end
  end

  def destroy
    @daily_task = DailyTask.find(params[:id])

    @daily_task.destroy

    respond_to do |format|
        format.html { redirect_to root_path }
        format.json { render json: 
          { daily_task: @daily_task, 
            create_url: new_task_daily_task_path(@daily_task.task_id, date: @daily_task.task_date) } }
    end
  end

  def remove
    @task = Task.find(params[:task_id])
    @daily_task = DailyTask.find(params[:id])
  end

  private

    def daily_task_params
      params.require(:daily_task).permit(:task_date)
    end
end
