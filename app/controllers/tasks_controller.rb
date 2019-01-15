class TasksController < ApplicationController
  before_filter :authenticate_user!, only: [:new, :create, :destroy, :edit, :update, :remove]

  def index
    configure_start_date
  end

  def new
    @task = Task.new
  end

  def create

    @task = Task.new(task_params)
    @task.user_id = current_user.id

    respond_to do |format|
      if @task.save
        format.html { redirect_to root_path }
        format.json do
          configure_start_date
          render json: { task: @task, week_date: @date }
        end
      else
        format.html { render 'new' }
      end
    end
  end

  def destroy
    @task = Task.find(params[:id])

   respond_to do |format| 
      if @task.destroy
        format.html { redirect_to root_path }
          #flash[:success] = "successfully deleted task"
        format.json { render json: { task: @task } }
      else
        format.html { redirecto_to root_path }
          #flash[:alert] = "unable to delete task"
        format.json { render json: { task: @task } }
      end
    end
  end

  def edit
    @task = Task.find(params[:id])
  end

  def update
    @task = Task.find(params[:id])
    if @task.update_attributes(task_params)
      flash[:success] = 'task updated'
      redirect_to root_path
    else
      render 'edit'
    end
  end

  def remove
    @task = Task.find(params[:id])
  end

  private

    def task_params
      params.require(:task).permit(:name, :start_date)
    end

    def configure_start_date
      begin
        @date = Date.parse(params[:date]).beginning_of_week
      rescue
        @date = Date.today.beginning_of_week
      end
    end

end