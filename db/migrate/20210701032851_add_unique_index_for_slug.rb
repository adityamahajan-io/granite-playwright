# frozen_string_literal: true

class AddUniqueIndexForSlug < ActiveRecord::Migration[6.0]
  def change
    add_index :tasks, :slug, unique: true
  end
end
