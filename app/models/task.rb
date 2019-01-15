# == Schema Information
#
# Table name: tasks
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  name       :string(255)
#  start_date :date
#  created_at :datetime
#  updated_at :datetime
#

class Task < ActiveRecord::Base
  belongs_to :users
  has_many :daily_tasks, dependent: :destroy

  validates :name, presence: true
  validates :start_date, presence: true
  validates :user_id, presence: true
end
