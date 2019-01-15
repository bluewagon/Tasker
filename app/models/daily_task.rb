# == Schema Information
#
# Table name: daily_tasks
#
#  id         :integer          not null, primary key
#  task_id    :integer
#  task_date  :date
#  created_at :datetime
#  updated_at :datetime
#

class DailyTask < ActiveRecord::Base
  belongs_to :tasks

  validates :task_id, presence: true
  validates :task_date, presence: true
end
