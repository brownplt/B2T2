# frozen_string_literal: true

# Row: an ordered sequence of cells
class Row
  # implicit in the spec
  attr_accessor :schema
  # explicit in the spec
  attr_accessor :cells

  def initialize(schema:, cells:)
    @schema = schema
    @cells = cells
  end
end
