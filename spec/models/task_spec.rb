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

require 'spec_helper'

describe Task do
  before do
    @user = User.create!(email: "test@example.com", password: "password")
    @task = Task.new(user_id: @user.id, name: "Run 2 miles", start_date: Date.today)
  end

  subject { @task }

  it { should be_valid }
  it { should respond_to(:user_id) }
  it { should respond_to(:name) }
  it { should respond_to(:start_date) }

  describe "when name is missing" do
    before { @task.name = nil }
    it { should_not be_valid }
  end

  describe "when start date is missing" do
    before { @task.start_date = nil }
    it { should_not be_valid }
  end

  describe "when user is missing" do
    before { @task.user_id = nil }
    it { should_not be_valid }
  end
end
