# frozen_string_literal: true

# Cell: a container for data (which may be empty)
class Cell
  attr_accessor :column_name, :value

  def initialize(column_name, value)
    @column_name = column_name
    @value = value
  end
end
