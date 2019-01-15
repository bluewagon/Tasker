class CreateDailyTasks < ActiveRecord::Migration
  def change
    create_table :daily_tasks do |t|
      t.integer :task_id
      t.date :task_date

      t.timestamps
    end
  end
end
