# frozen_string_literal: true

# Row: an ordered sequence of cells
class Row
  attr_reader :cells

  def initialize(cells)
    @cells = cells
  end
end
