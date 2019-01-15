# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string(255)      default(""), not null
#  encrypted_password     :string(255)      default(""), not null
#  reset_password_token   :string(255)
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0)
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :string(255)
#  last_sign_in_ip        :string(255)
#  created_at             :datetime
#  updated_at             :datetime
#

require 'spec_helper'

describe User do
  before do
    @user = User.new(email: "test@example.com", password: "password")
  end

  subject { @user }

  it { should be_valid }
  it { should respond_to(:email) }
  it { should respond_to(:password) }
  it { should respond_to(:tasks) }

  describe "when email is missing" do
    before { @user.email = nil }
    it { should_not be_valid }
  end

  describe "when password is missing" do
    before { @user.password = nil }
    it { should_not be_valid }
  end

  describe "when passwords do not match" do
    before do
      @user.password = "poplpopkffk"
      @user.password_confirmation = "nonmatching"
    end

    it { should_not be_valid }
  end

  describe "with task" do
    before { @task = @user.build(name: "test", start_date: Date.today) }

    
  end
end
